import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, query, where, getDoc, getDocs, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebase-config.json";
import reportToSentry from "./Sentry";
import moment from "moment";
import { ISO_FORMAT } from "./Date";

const ENDPOINT = "https://us-central1-sandwich-orders.cloudfunctions.net/";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

const executeFunction = async (name, data = {}) => {
  let authorization = auth.currentUser ?
    { "Authorization": "Bearer " + await auth.currentUser.getIdToken(true) } :
    {};
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authorization,
    },
    body: JSON.stringify({ data })
  };
  try {
    let response = await fetch(ENDPOINT + name, requestOptions);
    return (await response.json()).result;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const deleteFailedUser = (uid, domain) => executeFunction("deleteFailedUser", { uid, domain });
export const createOrder = (uid, domain, sandwich) => executeFunction("createOrder", { uid, domain, sandwich });
export const getUser = (email) => executeFunction("getUser", { email });

export const myDomain = (domain) => doc(firestore, "domains", domain);
export const userDomain = (uid) => doc(firestore, "userDomains", uid);
export const allOrders = (domain) => collection(myDomain(domain), "orders");
export const myOrders = (uid, domain) => query(allOrders(domain), where("uid", "==", uid));
export const orderDoc = (domain, id) => doc(allOrders(domain), id);
export const myUserData = (uid, domain) => doc(myDomain(domain), "userData", uid);
export const myPresets = (uid, domain) => collection(myUserData(uid, domain), "myPresets");
export const presetDoc = (uid, domain, id) => doc(myPresets(uid, domain), id);
export const myAppData = (domain) => collection(myDomain(domain), "appData");

export const getUserDomain = async (uid) => {
  const doc = await getDoc(userDomain(uid));
  if (!doc.exists || !(doc.data()?.domains || doc.data()?.domain)) {
    throw { code: "auth/user-not-found" };
  }
  const domainData = doc.data();
  // TODO: Allow user to select which domain they want to use
  let domainId = domainData.domains ? domainData.domains[0] : domainData.domain;
  let domainDoc = await getDoc(myDomain(domainId));
  if (!domainDoc.exists()) {
    throw { code: "auth/user-not-found" };
  }
  return { id: domainId, ...domainDoc.data() };
};

/**
 * Get domain data from domain code (for registering user)
 */
export const getDomainByCode = async (code) => {
  const cleanCode = code.trim().toUpperCase();
  const snapshot = await getDocs(query(
    collection(firestore, "domains"),
    where("code", "==", cleanCode),
    limit(1)
  ));
  if (snapshot.empty) {
    throw { code: "auth/domain-not-found" };
  }
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

/**
 * Get order options mapped to their corresponding weeks (for dynamic menus)
 */
export const getDynamicOrderOptions = async (domain) => {
  // TODO: Quick fix -- changing to 5 to contain all possible future menus, change later once active is not an array
  const validWeeks = (new Array(5))
    .fill(null)
    .map((_, i) => moment().day(i * 7).format(ISO_FORMAT));
  const snapshot = await getDocs(query(
    collection(myAppData(domain), "orderOptions", "dynamicMenu"),
    where("active", "array-contains-any", validWeeks) // Only include next 3 weeks (including this week)
  ));
  const allOrderOptions = { dynamic: true };
  snapshot.forEach((doc) => {
    const { active, orderOptions } = doc.data();
    // One menu may contain multiple dates, but that date must be unique across all menus
    for (const date of active) {
      allOrderOptions[date] = orderOptions;
    }
  });
  return allOrderOptions;
}

/**
 * Get state constants from Firestore and return in a single object
 */
export const getStateConstants = async (domain) => {
  const snapshot = await getDocs(myAppData(domain));
  let constants = {
    userFields: [],
    orderOptions: {},
    lunchSchedule: {},
    orderSchedule: {}
  };
  for (const doc of snapshot.docs) {
    const data = doc.data();
    switch (doc.id) {
      case "userFields":
        constants[doc.id] = Object.values(data);
        break;
      case "orderOptions":
        constants[doc.id] = data.dynamic ? await getDynamicOrderOptions(domain) : data;
        break;
      case "lunchSchedule":
      case "orderSchedule":
        constants[doc.id] = data;
        break;
      default:
        break;
    }
  }
  return constants;
}

/**
 * Get initial data required upon authenticating
 */
export const getInitialData = async (domain, uid) => (
  Promise.all([
    getDocs(myOrders(uid, domain)),
    getDoc(myUserData(uid, domain)),
    getStateConstants(domain),
    getDocs(myPresets(uid, domain))
  ])
);

export const snapshotToSerializable = (snapshot) => snapshot.docs.map((doc) => ({ ...doc.data(), key: doc.id }));

const customErrorMessage = (error) => {
  switch (error.code) {
    case "domain-not-found":
      return {
        title: "Invalid Organization Code",
        message: "We can't find any organization with that code. Try again with a valid code."
      }
    default:
      return null;
  }
};

/**
 * Gets an error message for Firebase authentication
 */
const authErrorMessage = (error) => {
  switch (error.code) {
    case "auth/invalid-user-token":
      return {
        title: "Invalid User Credential",
        message: "The current user's credential is no longer valid. Please sign in again."
      };
    case "auth/network-request-failed":
      return {
        title: "No Internet Connection",
        message: "Could not connect to server. Please ensure you are connected to a network."
      };
    case "auth/wrong-password":
      return {
        title: "Incorrect Password",
        message: "The password you entered was incorrect."
      };
    case "auth/user-not-found":
      return {
        title: "Invalid Email",
        message: "There is no user with that email address. You may need to create an account."
      };
    case "auth/email-already-in-use":
      return {
        title: "Email Already In Use",
        message: "The email you have chosen is already in use. Please choose a different email or contact an app admin."
      }
    default:
      return null;
  }
};

/**
 * Gets an error message for Firebase Firestore
 */
const firestoreErrorMessage = (error) => {
  switch (error.code) {
    case "not-found":
      return {
        title: "Not Found",
        message: "Couldn't find the requested document."
      };
    case "already-exists":
      return {
        title: "Document Already Exists",
        message: "The document you tried to create already exists."
      };
    case "permission-denied":
      return {
        title: "Permission Denied",
        message: "You do not have permission to execute this action."
      };
    case "cancelled":
      return {
        title: "Cancelled",
        message: "The operation was cancelled."
      };
    case "unimplemented":
      return {
        title: "Not Allowed",
        message: "This action is not allowed."
      };
    case "data-loss":
      return {
        title: "Data Loss",
        message: "Some data may have been lost or corrupted when executing this action."
      };
    case "unauthenticated":
      return {
        title: "Invalid Authentication",
        message: "Your authentication credentials are invalid. Try logging out and back in again."
      };
    default:
      return null;
  }
};

export const firebaseErrorMessage = (error) => {
  const message = firestoreErrorMessage(error) || authErrorMessage(error) || customErrorMessage(error);
  if (!message) {
    reportToSentry(error);
    return {
      title: "Error",
      message: "Something went wrong. Please try again later."
    };
  }
  return message;
}