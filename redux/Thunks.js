import { startLoading, stopLoading } from "./features/display/loadingSlice";
import { setInfoMessage } from "./features/display/infoMessageSlice";
import { updateUserData } from "./features/auth/userSlice";
import { setDomain } from "./features/auth/domainSlice";
import { updateConstants } from "./features/auth/stateConstantsSlice";
import { logIn as logInAction, logOut as logOutAction } from "./features/auth/userSlice";
import { authenticate } from "./features/auth/hasAuthenticatedSlice";
import { updatePresets } from "./features/orders/orderPresetsSlice";
import { updateOrders } from "./features/orders/ordersSlice";
import {
  firebaseErrorMessage,
  getUser,
  createOrder as orderSandwich,
  userDomain,
  myOrders,
  orderDoc,
  myUserData,
  myPresets,
  presetDoc,
  getUserDomain,
  getDomainByCode,
  getStateConstants,
  getInitialData,
  snapshotToSerializable
} from "../constants/Firebase";
import {
  getFirestore,
  writeBatch,
  runTransaction,
  onSnapshot,
  setDoc,
  deleteDoc,
  addDoc,
  getDocs
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import store from "./Store";
import { toISO } from "../constants/Date";
import Alert from "../constants/Alert";

const loadWhileExecute = async (dispatch, f) => {
  dispatch(startLoading());
  const result = await f();
  dispatch(stopLoading());
  return result;
}

const alertError = (error) => {
  console.error(error);
  const { title, message } = firebaseErrorMessage(error);
  Alert(title, message);
}

const executeAsyncAction = (dispatch, f, successMessage = null) => (
  loadWhileExecute(dispatch, async () => {
    try {
      const result = await f();
      if (successMessage)
        dispatch(setInfoMessage(successMessage));
      return result || true;
    } catch (e) {
      alertError(e);
      return false;
    }
  })
)

//////////////////////
// Order Operations //
//////////////////////

/**
 * Creates a new order
 */
export const createOrder = (data, dynamicSchedule) => (dispatch, getState) => (
  loadWhileExecute(dispatch, async () => {
    const { user, domain, stateConstants } = getState();
    const date = dynamicSchedule
      ? Object.keys(data).find((key) => key !== "date")
      : toISO(data.date);
    const dataToPush = dynamicSchedule ? data[date] : data;
    try {
      const success = await orderSandwich(
        user.uid,
        domain.id,
        { ...dataToPush, date, uid: user.uid }
      );
      if (success) {
        const ordersSnapshot = await getDocs(myOrders(user.uid, domain.id));
        dispatch(updateOrders({
          user,
          stateConstants,
          snapshot: snapshotToSerializable(ordersSnapshot)
        }));
        dispatch(setInfoMessage("Order created successfully"));
      } else {
        dispatch(setInfoMessage("Order failed: The daily sandwich order limit has been reached"));
      }
    } catch (e) {
      alertError(e);
    }
  })
);

/**
 * Edits an existing order
 */
export const editOrder = (data, ids, dynamicSchedule) => (dispatch, getState) => (
  executeAsyncAction(dispatch, async () => {
    const { user, domain } = getState();
    const dataToPush = dynamicSchedule
      ? Object.keys(data)
        .filter((key) => key !== "date")
        .map((date) => ({ ...data[date], date, uid: user.uid }))
      : [{ ...data, date: toISO(data.date), uid: user.uid }];
    const batch = writeBatch(getFirestore());
    dataToPush.forEach(({ key, ...data }, i) => {
      const dataRef = orderDoc(domain.id, ids[i]);
      batch.set(dataRef, data);
    });
    await batch.commit();
  }, "Order updated successfully")
);

/**
 * Deletes an existing order
 */
export const deleteOrder = (id) => (dispatch, getState) => (
  executeAsyncAction(dispatch, async () => {
    const { domain } = getState();
    const batch = writeBatch(getFirestore());
    if (Array.isArray(id)) {
      id.forEach((key) => {
        const dataRef = orderDoc(domain.id, key);
        batch.delete(dataRef);
      });
    } else {
      const dataRef = orderDoc(domain.id, id);
      batch.delete(dataRef);
    }
    await batch.commit();
  }, "Order deleted successfully")
);

///////////////////////
// Preset Operations //
///////////////////////

/**
 * Creates a new order preset
 */
export const createPreset = (data) => (dispatch, getState) => (
  executeAsyncAction(dispatch, async () => {
    const { domain, user } = getState();
    await addDoc(myPresets(user.uid, domain.id), data);
  }, "Preset created successfully")
);

/**
 * Edits an existing order preset
 */
export const editPreset = (data, id) => (dispatch, getState) => (
  executeAsyncAction(dispatch, async () => {
    const { user, domain } = getState();
    let dataToPush = { ...data };
    delete dataToPush.key;
    await setDoc(presetDoc(user.uid, domain.id, id), dataToPush);
  }, "Preset updated successfully")
);

/**
 * Deletes an existing order preset
 */
export const deletePreset = (id) => (dispatch, getState) => (
  executeAsyncAction(dispatch, async () => {
    const { user, domain } = getState();
    await deleteDoc(presetDoc(user.uid, domain.id, id));
  }, "Preset deleted successfully")
);

/////////////////////
// User Operations //
/////////////////////

/**
 * Logs user in
 */
export const logIn = (email, password) => (dispatch) => (
  executeAsyncAction(dispatch, () => signInWithEmailAndPassword(getAuth(), email, password))
);

/**
 * Logs user out
 */
export const logOut = () => (dispatch) => (
  executeAsyncAction(dispatch, () => signOut(getAuth()))
);

/**
 * Edits user's profile data
 */
export const editUserData = (data) => (dispatch, getState) => (
  executeAsyncAction(dispatch, async () => {
    const { user, domain } = getState();
    let newData = { ...data };
    delete newData.uid;
    delete newData.password;
    delete newData.email;
    delete newData.domain;
    await setDoc(myUserData(user.uid, domain.id), newData);
  }, "User data updated successfully")
);

/**
 * Creates a new user
 */
export const createUser = (email, password, data) => (dispatch, getState) => (
  loadWhileExecute(dispatch, async () => {
    try {
      // Creating a user can either be:
      //   - Creating a new user, adding a domain entry, adding a user data entry
      //   - Add domain to list of domains for existing user, adding a user data entry
      //       - This will fail if there is already an existing user in the provided domain
      const { domain } = getState();
      let uid = await getUser(email);
      let newUser = false;
      // Create new user (if it doesn't exist already)
      if (!uid) {
        const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
        uid = userCredential.user.uid;
        newUser = true;
      }
      await Promise.all([
        await runTransaction(getFirestore(), async (t) => {
          const docRef = userDomain(uid);
          let domains = [];
          if (!newUser) {
            const doc = await t.get(docRef);
            if (doc.exists) {
              domains = doc.data().domains || [doc.data().domain] || [];
              if (domains.includes(domain.id)) {
                throw { code: "auth/email-already-in-use" };
              }
            }
          }
          t.set(docRef, { "domain": domain.id });
          let newData = { ...data };
          delete newData.uid;
          delete newData.password;
          delete newData.email;
          delete newData.domain;
      
          t.set(myUserData(uid, domain.id), newData)
        }),
      ]);
    } catch (e) {
      // Log out if there is a failure to create user or update domains
      alertError(e);
      logOut();
    }
  })
);

/**
 * Resets a user's password
 */
export const resetPassword = (email) => (dispatch) => (
  executeAsyncAction(dispatch, () => sendPasswordResetEmail(getAuth(), email))
);

/**
 * Re-authenticates user and changes user's account password
 */
export const changePassword = (currentPassword, newPassword) => (dispatch) => (
  executeAsyncAction(dispatch, async () => {
    const auth = getAuth();
    const { currentUser } = auth;
    const { email } = currentUser;
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  }, "Password set successfully")
);

///////////////
// Listeners //
///////////////

export const watchOrders = () => {
  const { user, stateConstants, domain } = store.getState();
  return onSnapshot(
    myOrders(user.uid, domain.id),
    (snapshot) => store.dispatch(updateOrders({
      user,
      stateConstants,
      snapshot: snapshotToSerializable(snapshot)
    })),
    alertError
  );
};

export const watchUserData = () => {
  const { user: { uid }, domain } = store.getState();
  return onSnapshot(
    myUserData(uid, domain.id),
    (doc) => store.dispatch(updateUserData(doc.data())),
    alertError
  );
};

export const watchPresets = () => {
  const { user: { uid }, domain } = store.getState();
  return onSnapshot(
    myPresets(uid, domain.id),
    (snapshot) => store.dispatch(updatePresets(snapshotToSerializable(snapshot))),
    alertError
  );
};

export const watchAuthState = () => (
  getAuth().onAuthStateChanged((user) => {
    store.dispatch(user ? logInAction() : logOutAction());
    store.dispatch(authenticate());
  })
);

/////////////////////
// State Constants //
/////////////////////

/**
 * Fetches data for app constants when user is not authenticated (used for register screen)
 */
export const getUnauthData = (code) => (dispatch) => (
  executeAsyncAction(dispatch, async () => {
    const domainData = await getDomainByCode(code);
    dispatch(setDomain(domainData));
    const stateConstants = await getStateConstants(domainData.id);
    dispatch(updateConstants(stateConstants));
  })
);

/**
 * Fetches data for app constants when user is authenticated
 */
export const getAuthData = () => (dispatch) => (
  executeAsyncAction(dispatch, async () => {
    const { uid } = getAuth().currentUser;
    const domainData = await getUserDomain(uid);
    dispatch(setDomain(domainData));
    const { id } = domainData;
    const [ordersSnapshot, userData, stateConstants, presetsSnapshot] = await getInitialData(id, uid);
    dispatch(updateConstants(stateConstants));
    dispatch(updateUserData(userData.data()));
    dispatch(updateOrders({
      user: { uid, ...userData.data() },
      stateConstants: stateConstants,
      snapshot: snapshotToSerializable(ordersSnapshot)
    }));
    dispatch(updatePresets(snapshotToSerializable(presetsSnapshot)));
    return { user: userData.data(), userFields: stateConstants.userFields };
  })
);