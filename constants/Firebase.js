import firebase from "firebase/app";
import firebaseConfig from "../firebase-config.json";
import "firebase/firestore";
import "firebase/auth";
import reportToSentry from "./Sentry";

firebase.initializeApp(firebaseConfig);

// Firestore object (database)
export const firestore = firebase.firestore();
// Firebase auth object; notice firebaseAuth is not executed (will often need to execute when using)
export const auth = firebase.auth;

const executeFunction = async (name, data = {}) => {
  let authorization = firebase.auth().currentUser ?
    { "Authorization": "Bearer " + await firebase.auth().currentUser.getIdToken(true) } :
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
    let response = await fetch("http://127.0.0.1:5001/sandwich-orders/us-central1/" + name, requestOptions);
    return (await response.json()).result;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const deleteFailedUser = (uid, domain) => executeFunction("deleteFailedUser", { uid, domain });
export const createOrder = (uid, domain, sandwich) => executeFunction("createOrder", { uid, domain, sandwich });
export const getUser = (email) => executeFunction("getUser", { email });

/**
 * Gets an error message for Firebase authentication
 */
export const authErrorMessage = (error) => {
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
      reportToSentry(error);
      return {
        title: "Error",
        message: "Something went wrong. Please try again later."
      };
  }
};

/**
 * Gets an error message for Firebase Firestore
 */
export const firestoreErrorMessage = (error) => {
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
      reportToSentry(error);
      return {
        title: "Error",
        message: "Something went wrong. Please try again later."
      }
  }
}