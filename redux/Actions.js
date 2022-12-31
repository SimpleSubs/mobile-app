import "react-native-get-random-values";
import Alert from "../constants/Alert";
import {
  firestore,
  auth,
  authErrorMessage,
  firestoreErrorMessage,
  deleteFailedUser,
  getUser,
  createOrder as orderSandwich
} from "../constants/Firebase";
import moment from "moment";
import { toISO, ISO_FORMAT, parseISO } from "../constants/Date";
import {
  OrderScheduleTypes,
  getLunchSchedule,
  getScheduleGroups,
  getCutoffDate
} from "../constants/Schedule";

// All possible actions to edit state
const Actions = {
  UPDATE_ORDERS: "UPDATE_ORDERS",
  UPDATE_USER_DATA: "UPDATE_USER_DATA",
  UPDATE_CONSTANTS: "UPDATE_CONSTANTS",
  UPDATE_PRESETS: "UPDATE_PRESETS",
  FOCUS_ORDER: "FOCUS_ORDER",
  FOCUS_PRESET: "FOCUS_PRESET",
  SET_MODAL_PROPS: "SET_MODAL_PROPS",
  SET_INFO_MESSAGE: "SET_INFO_MESSAGE",
  SET_LOADING: "SET_LOADING",
  SET_DOMAIN: "SET_DOMAIN"
};

export default Actions;

const myDomain = (domain) => firestore.collection("domains").doc(domain);
const allOrders = (domain) => myDomain(domain).collection("orders");
const myOrders = (uid, domain) => allOrders(domain).where("uid", "==", uid);
const myUserData = (uid, domain) => myDomain(domain).collection("userData").doc(uid);
const myPresets = (uid, domain) => (
  myDomain(domain).collection("userData")
    .doc(uid)
    .collection("myPresets")
);
const myAppData = (domain) => myDomain(domain).collection("appData");

const alertAuthError = (dispatch, error) => {
  dispatch(stopLoading());
  console.error(error);
  const { title, message } = authErrorMessage(error);
  Alert(title, message);
};

const alertFirestoreError = (dispatch, error) => {
  dispatch(stopLoading());
  console.error(error);
  const { title, message } = firestoreErrorMessage(error);
  Alert(title, message);
};

const successAction = (message, dispatch) => {
  dispatch(stopLoading());
  dispatch(setInfoMessage(message));
};

/**
 * Creates a new sandwich order
 */
export const createOrder = (dispatch, data, uid, domain, dynamicSchedule) => {
  dispatch(startLoading());
  let dataToPush;
  if (!dynamicSchedule) {
    dataToPush = [{ ...data, date: toISO(data.date), uid }];
  } else {
    dataToPush = Object.keys(data)
      .filter((key) => key !== "date")
      .map((date) => ({ ...data[date], date, uid }));
  }

  orderSandwich(uid, domain, dataToPush[0])
    .then(success => {
      if (success) return successAction("Order created successfully", dispatch)
      else return successAction("Order failed: The daily sandwich order limit has been reached", dispatch)
    })
    .catch((error) => alertFirestoreError(dispatch, error));

  // const batch = firestore.batch();
  // dataToPush.forEach((data) => {
  //   const dataRef = allOrders(domain).doc()
  //   batch.set(dataRef, data)
  // });
  // batch.commit()
  //   .then(() => successAction("Order created successfully", dispatch))
  //   .catch((error) => alertFirestoreError(dispatch, error));
};

// TODO FIXME
/**
 * Edits an existing sandwich order
 */
export const editOrder = (dispatch, data, ids, uid, domain, dynamicSchedule) => {
  dispatch(startLoading());
  let dataToPush;
  if (!dynamicSchedule) {
    dataToPush = [{ ...data, date: toISO(data.date), uid }];
  } else {
    dataToPush = Object.keys(data)
      .filter((key) => key !== "date")
      .map((date) => ({ ...data[date], date, uid }));
  }
  const batch = firestore.batch();
  dataToPush.forEach(({ key, ...data }, i) => {
    const dataRef = allOrders(domain).doc(ids[i]);
    batch.set(dataRef, data);
  });
  batch.commit()
    .then(() => successAction("Order updated successfully", dispatch))
    .catch((error) => alertFirestoreError(dispatch, error));
};

/**
 * Deletes an existing sandwich order
 */
export const deleteOrder = (dispatch, id, domain) => {
  dispatch(startLoading());
  const batch = firestore.batch();
  if (Array.isArray(id)) {
    id.forEach((key) => {
      const dataRef = allOrders(domain).doc(key);
      batch.delete(dataRef);
    });
  } else {
    const dataRef = allOrders(domain).doc(id);
    batch.delete(dataRef);
  }
  batch.commit()
    .then(() => successAction("Order deleted successfully", dispatch))
    .catch((error) => alertFirestoreError(dispatch, error));
};

/**
 * Creates a new order preset
 */
export const createPreset = (dispatch, data, uid, domain) => {
  dispatch(startLoading());
  return (
    myPresets(uid, domain)
      .add(data)
      .then(() => successAction("Preset created successfully", dispatch))
      .catch((error) => alertFirestoreError(dispatch, error))
  );
};

/**
 * Edits an existing order preset
 */
export const editPreset = (dispatch, data, id, uid, domain) => {
  dispatch(startLoading());
  let dataToPush = { ...data };
  delete dataToPush.key;
  return myPresets(uid, domain).doc(id)
    .set(dataToPush)
    .then(() => successAction("Preset updated successfully", dispatch))
    .catch((error) => alertFirestoreError(dispatch, error))
};

/**
 * Deletes an existing order preset
 */
export const deletePreset = (dispatch, id, uid, domain) => {
  dispatch(startLoading());
  return (
    myPresets(uid, domain).doc(id)
      .delete()
      .then(() => successAction("Preset deleted successfully", dispatch))
      .catch((error) => alertFirestoreError(dispatch, error))
  );
};

export const startLoading = () => ({
  type: Actions.SET_LOADING,
  loading: true
})

export const stopLoading = () => ({
  type: Actions.SET_LOADING,
  loading: false
})

export const focusOrder = (id) => ({
  type: Actions.FOCUS_ORDER,
  id: id.toString()
});

export const unfocusOrder = () => ({
  type: Actions.FOCUS_ORDER,
  id: null
});

export const focusPreset = (id) => ({
  type: Actions.FOCUS_PRESET,
  id
});

export const unfocusPreset = () => ({
  type: Actions.FOCUS_PRESET,
  id: null
})

export const logIn = (dispatch, email, password) => {
  dispatch(startLoading());
  auth().signInWithEmailAndPassword(email, password)
    .then(() => dispatch(stopLoading()))
    .catch((error) => alertAuthError(dispatch, error));
};

export const logOut = (dispatch) => {
  dispatch(startLoading());
  auth().signOut()
    .then(() => dispatch(stopLoading()))
    .catch((error) => alertAuthError(dispatch, error))
};

/**
 * Edits user's profile data
 */
export const editUserData = (dispatch, data, uid, domain) => {
  dispatch(startLoading());
  let newData = { ...data };
  delete newData.uid;
  delete newData.password;
  delete newData.email;
  delete newData.domain;
  return myUserData(uid, domain)
    .set(newData)
    .then(() => successAction("User data updated successfully", dispatch))
    .catch((error) => alertFirestoreError(dispatch, error));
};

const createUserDomain = async (domain, uid, dispatch) => {
  try {
    const docRef = firestore.collection("userDomains").doc(uid);
    await firestore.runTransaction(async (t) => {
      const doc = await t.get(docRef);
      let domains = [];
      if (doc.exists) {
        domains = doc.data().domains || [doc.data().domain] || [];
      }
      const newDomains = [...domains, domain];
      t.set(docRef, { domains: newDomains });
    })
    await firestore.collection("userDomains").doc(uid).set({ domain });
  } catch (e) {
    await deleteFailedUser(uid, domain);
    alertFirestoreError(dispatch, e);
    logOut(dispatch);
  }
}

/**
 * Creates a new user
 */
export const createUser = async (dispatch, email, password, data, domain) => {
  dispatch(startLoading());
  let uid;
  const catchFirestoreError = (e) => {
    deleteFailedUser(uid, domain);
    alertFirestoreError(dispatch, e);
    logOut(dispatch);
  }
  try {
    const existingUid = await getUser(email);
    if (existingUid) {
      uid = existingUid;
      const docRef = firestore.collection("userDomains").doc(existingUid);
      try {
        await firestore.runTransaction(async (t) => {
          const doc = await t.get(docRef);
          let domains = [];
          if (doc.exists) {
            domains = doc.data().domains || [doc.data().domain] || [];
          }
          if (domains.includes(domain)) {
            throw { code: "auth/email-already-in-use" };
          } else {
            const newDomains = [...domains, domain];
            t.set(docRef, { domains: newDomains });
          }
        })
        await editUserData(dispatch, data, uid, domain);
      } catch (e) {
        catchFirestoreError(e)
      }
      await auth().signInWithEmailAndPassword(email, password);
    } else {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      uid = userCredential.user.uid;
      await Promise.all([
        firestore.collection("userDomains").doc(uid)
          .set({ domains: [domain] }),
        editUserData(dispatch, data, uid, domain)
      ]).catch(catchFirestoreError)
    }
  } catch (e) {
    alertAuthError(dispatch, e);
    logOut(dispatch);
  }
}

export const openModal = (props) => ({
  type: Actions.SET_MODAL_PROPS,
  props: { ...props, open: true }
});

export const setModalProps = (props) => ({
  type: Actions.SET_MODAL_PROPS,
  props
});

export const closeModal = () => ({
  type: Actions.SET_MODAL_PROPS,
  props: { open: false }
});

export const setInfoMessage = (message) => ({
  type: Actions.SET_INFO_MESSAGE,
  message
});

/**
 * Updates order state from data pulled from Firebase
 */
export const updateOrders = (querySnapshot, orderSchedule, lunchSchedule) => {
  const collectionData = {};
  const cutoffDate = getCutoffDate(orderSchedule);
  querySnapshot.forEach((doc) => {
    let data = { ...doc.data(), key: doc.id };
    delete data.uid;
    if (parseISO(data.date).isSameOrAfter(cutoffDate)) {
      collectionData[doc.id] = data;
    }
  })
  let orders = {};
  if (orderSchedule.scheduleType === OrderScheduleTypes.CUSTOM && Object.keys(collectionData).length > 0) {
    let dates = querySnapshot.docs.map((doc) => moment(doc.data().date));
    const allScheduleGroups = getScheduleGroups(
      getLunchSchedule(
        orderSchedule,
        lunchSchedule,
        moment().format(ISO_FORMAT),
        moment.max(dates).format(ISO_FORMAT)
      ),
      lunchSchedule.schedule
    );
    const collectionDataKeys = Object.keys(collectionData);
    allScheduleGroups.forEach((group) => {
      const relevantKeys = collectionDataKeys.filter((key) => group.includes(collectionData[key].date));
      const key = group[0];
      if (relevantKeys.length > 0) {
        orders[key] = { date: group, multipleOrders: true, key, keys: relevantKeys };
        for (const id of relevantKeys) {
          orders[key][collectionData[id].date] = collectionData[id];
        }
      }
    });
  } else {
    orders = collectionData;
  }
  return {
    type: Actions.UPDATE_ORDERS,
    orders
  };
};

/**
 * Updates preset state from data pulled from Firebase
 */
export const updatePresets = (querySnapshot) => {
  let presets = {};
  querySnapshot.forEach((doc) => {
    presets[doc.id] = {
      ...doc.data(),
      key: doc.id
    }
  });
  return {
    type: Actions.UPDATE_PRESETS,
    presets
  }
}

export const logInAction = () => ({
  type: Actions.UPDATE_USER_DATA,
  data: {}
})

export const updateUserData = (uid, doc) => ({
  type: Actions.UPDATE_USER_DATA,
  data: { uid, email: auth().currentUser.email, ...(doc.data() || {}) }
});

export const logOutAction = () => ({
  type: Actions.UPDATE_USER_DATA,
  data: null
});

export const resetPassword = (dispatch, email) => {
  dispatch(startLoading());
  auth().sendPasswordResetEmail(email)
    .then(() => successAction("Email sent successfully", dispatch))
    .catch((error) => alertAuthError(dispatch, error));
};

/**
 * Re-authenticates user and changes user's account password
 */
export const changePassword = (dispatch, currentPassword, newPassword) => {
  dispatch(startLoading());
  const user = auth().currentUser;
  const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
  user.reauthenticateWithCredential(credential).then(() => (
    user.updatePassword(newPassword)
      .then(() => successAction("Password set successfully", dispatch))
      .catch((error) => alertAuthError(dispatch, error))
  )).catch((error) => alertAuthError(dispatch, error));
};

export const updateConstants = (data) => ({
  type: Actions.UPDATE_CONSTANTS,
  data
});

export const watchOrders = (dispatch, uid, domain, orderSchedule, lunchSchedule) => (
  myOrders(uid, domain).onSnapshot(
    (querySnapshot) => dispatch(updateOrders(querySnapshot, orderSchedule, lunchSchedule)),
    (error) => alertFirestoreError(dispatch, error)
  )
);

export const watchUserData = (dispatch, uid, domain) => (
  myUserData(uid, domain).onSnapshot(
    (doc) => dispatch(updateUserData(uid, doc)),
    (error) => alertFirestoreError(dispatch, error)
  )
);

export const watchPresets = (dispatch, uid, domain) => (
  myPresets(uid, domain).onSnapshot(
    (querySnapshot) => dispatch(updatePresets(querySnapshot)),
    (error) => alertFirestoreError(dispatch, error)
  )
);

const setDomain = (domain) => ({
  type: Actions.SET_DOMAIN,
  domain
})

export const getUserDomain = async (uid, dispatch) => {
  dispatch(startLoading());
  let myDomainDoc = await firestore.collection("userDomains").doc(uid).get();
  const domainData = myDomainDoc.data();
  if (!myDomainDoc.exists || (!domainData.domains && !domainData.domain)) {
    await deleteFailedUser(uid);
    logOut(dispatch);
    throw new Error("User did not have a domain");
  }
  // TODO: Allow user to select which domain they want to use
  let domainId = domainData.domains ? domainData.domains[0] : domainData.domain;
  let domainDoc = await firestore.collection("domains").doc(domainId).get();
  dispatch(setDomain({ id: domainId, ...domainDoc.data() }));
  dispatch(stopLoading());
  return domainId;
}

export const getDomainByCode = async (dispatch, code) => {
  try {
    let fixedCode = code.trim().toUpperCase();
    let snapshot = await firestore.collection("domains")
      .where("code", "==", fixedCode)
      .limit(1)
      .get();
    if (snapshot.empty) {
      dispatch(setDomain(null));
      return null;
    } else {
      let domainDoc = snapshot.docs[0];
      dispatch(setDomain({ id: domainDoc.id, ...domainDoc.data() }));
      return domainDoc.id;
    }
  } catch (error) {
    alertFirestoreError(dispatch, error);
    throw new Error(error);
  }
}

export const watchAuthState = (dispatch) => (
  auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch(logInAction());
    } else {
      dispatch(logOutAction());
    }
  })
);

/**
 * Fetches data for app constants when user is not authenticated
 */
export const getUnauthData = async (dispatch, code) => {
  dispatch(startLoading());
  let domainId = await getDomainByCode(dispatch, code);
  let success = false;
  if (!domainId) {
    dispatch(stopLoading());
    Alert(
      "Invalid organization code",
      "We can't find any organization with that code. Are you sure you entered it correctly?"
    );
    return success;
  }
  try {
    let stateConstants = await getStateConstants(domainId);
    dispatch(updateConstants(stateConstants));
    success = true;
  } catch (error) {
    alertFirestoreError(dispatch, error);
    throw new Error(error);
  } finally {
    dispatch(stopLoading());
  }
  return success;
};

const getDynamicOrderOptions = async (domain) => {
  // Quick fix (changing to 5 to contain all possible future menus), change later once active is not an array
  const validWeeks = (new Array(5))
    .fill(null)
    .map((_, i) => moment().day(i * 7).format(ISO_FORMAT));
  const querySnapshot = await myAppData(domain)
    .doc("orderOptions")
    .collection("dynamicMenu")
    .where("active", "array-contains-any", validWeeks) // Only include next 3 weeks (including this week)
    .get();
  const allOrderOptions = { dynamic: true };
  querySnapshot.forEach((doc) => {
    const { active, orderOptions } = doc.data();
    // One menu may contain multiple dates, but that date must be unique across all menus
    for (const date of active) {
      allOrderOptions[date] = orderOptions;
    }
  });
  return allOrderOptions;
}

const getStateConstants = async (domain) => {
  let querySnapshot = await myAppData(domain).get();
  let constants = {
    userFields: [],
    orderOptions: {},
    lunchSchedule: {},
    orderSchedule: {}
  };
  for (const doc of querySnapshot.docs) {
    switch (doc.id) {
      case "userFields":
        constants[doc.id] = Object.values(doc.data() || {});
        break;
      case "orderOptions":
        const data = doc.data() || {};
        if (data.dynamic) {
          constants[doc.id] = await getDynamicOrderOptions(domain);
        } else {
          constants[doc.id] = data;
        }
        break;
      case "lunchSchedule":
      case "orderSchedule":
        constants[doc.id] = doc.data() || {};
        break;
      default:
        break;
    }
  }
  return constants;
}

/**
 * Fetches data for app constants when user is authenticated
 */
export const getAuthData = async (dispatch) => {
  const uid = auth().currentUser.uid;
  try {
    let domainId = await getUserDomain(uid, dispatch);
    let results = await Promise.all([
      myOrders(uid, domainId).get(),
      myUserData(uid, domainId).get(),
      getStateConstants(domainId),
      myPresets(uid, domainId).get()
    ]);
    const [ordersSnapshot, userData, stateConstants, presetsSnapshot] = results;
    dispatch(updateOrders(ordersSnapshot, stateConstants.orderSchedule, stateConstants.lunchSchedule));
    dispatch(updateUserData(uid, userData));
    dispatch(updateConstants(stateConstants));
    dispatch(updatePresets(presetsSnapshot));
    return {
      user: userData.data(),
      userFields: stateConstants.userFields
    };
  } catch (e) {
    alertFirestoreError(dispatch, e);
    throw new Error(e);
  }
};