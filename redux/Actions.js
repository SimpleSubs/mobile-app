import "react-native-get-random-values";
import { Alert } from "react-native";
import { firestore, auth, authErrorMessage, firestoreErrorMessage } from "../constants/Firebase";
import moment from "moment";
import { toISO } from "../constants/Date";

// TODO: customize error handling to error codes

const Actions = {
  UPDATE_ORDERS: "UPDATE_ORDERS",
  UPDATE_USER_DATA: "UPDATE_USER_DATA",
  UPDATE_CONSTANTS: "UPDATE_CONSTANTS",
  UPDATE_PRESETS: "UPDATE_PRESETS",
  FOCUS_ORDER: "FOCUS_ORDER",
  FOCUS_PRESET: "FOCUS_PRESET",
  SET_MODAL_PROPS: "SET_MODAL_PROPS",
  SET_INFO_MESSAGE: "SET_INFO_MESSAGE",
  SET_LOADING: "SET_LOADING"
};

export default Actions;

const myOrders = (uid) => (
  firestore.collection("orders")
    .doc(uid)
    .collection("myOrders")
);

const myUserData = (uid) => firestore.collection("userData").doc(uid);

const myPresets = (uid) => (
  firestore.collection("orderPresets")
    .doc(uid)
    .collection("myPresets")
);

const alertAuthError = (dispatch, error) => {
  dispatch(stopLoading());
  const { title, message } = authErrorMessage(error);
  Alert.alert(title, message);
};

const alertFirestoreError = (dispatch, error) => {
  dispatch(stopLoading());
  const { title, message } = firestoreErrorMessage(error);
  Alert.alert(title, message);
}

const successAction = (message, dispatch) => {
  dispatch(stopLoading());
  dispatch(setInfoMessage(message));
}

export const createOrder = (dispatch, data, uid) => {
  dispatch(startLoading());
  let newDate = toISO(data.date);
  let dataToPush = { ...data };
  delete dataToPush.date;
  return (
    myOrders(uid).doc(newDate)
      .set(dataToPush)
      .then(() => successAction("Order created successfully", dispatch))
      .catch((error) => alertFirestoreError(dispatch, error))
  );
};

export const editOrder = (dispatch, data, id, uid) => {
  dispatch(startLoading());
  let newDate = toISO(data.date);
  let dataToPush = { ...data };
  delete dataToPush.date;
  if (newDate !== id) {
    return Promise.all([
      myOrders(uid).doc(id).delete(),
      myOrders(uid).doc(newDate).set(dataToPush)
    ]).then(() => successAction("Order updated successfully", dispatch))
      .catch((error) => alertFirestoreError(dispatch, error));
  } else {
    return (
      myOrders(uid).doc(id)
        .set(dataToPush)
        .then(() => successAction("Order updated successfully", dispatch))
        .catch((error) => alertFirestoreError(dispatch, error))
    );
  }
};

export const deleteOrder = (dispatch, id, uid) => {
  dispatch(startLoading());
  return (
    myOrders(uid).doc(id)
      .delete()
      .then(() => successAction("Order deleted successfully", dispatch))
      .catch((error) => alertFirestoreError(dispatch, error))
  );
};

export const createPreset = (dispatch, data, uid) => {
  dispatch(startLoading());
  return (
    myPresets(uid).doc(data.title)
      .set(data)
      .then(() => successAction("Preset created successfully", dispatch))
      .catch((error) => alertFirestoreError(dispatch, error))
  );
};

export const editPreset = (dispatch, data, id, uid) => {
  dispatch(startLoading());
  let dataToPush = { ...data };
  delete dataToPush.key;
  return (
    myPresets(uid).doc(id)
      .set(dataToPush)
      .then(() => successAction("Preset updated successfully", dispatch))
      .catch((error) => alertFirestoreError(dispatch, error))
  );
};

export const deletePreset = (dispatch, id, uid) => {
  dispatch(startLoading());
  return (
    myPresets(uid).doc(id)
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
  id
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
  return (
    auth().signInWithEmailAndPassword(email, password)
      .then(() => dispatch(stopLoading()))
      .catch((error) => alertAuthError(dispatch, error))
  );
};

export const logOut = (dispatch) => {
  dispatch(startLoading());
  return (
    auth().signOut()
      .then(() => dispatch(stopLoading()))
      .catch((error) => alertAuthError(dispatch, error))
  );
};

export const editUserData = (dispatch, data, uid) => {
  dispatch(startLoading());
  let newData = { ...data };
  delete newData.uid;
  return (
    firestore.collection("userData")
      .doc(uid)
      .set(newData)
      .then(() => successAction("User data updated successfully", dispatch))
      .catch((error) => alertFirestoreError(dispatch, error))
  );
};

export const createUser = (dispatch, email, password, data) => {
  dispatch(startLoading());
  return (
    auth().createUserWithEmailAndPassword(email, password)
      .then(() => editUserData(dispatch, { email, ...data }, auth().currentUser.uid))
      .catch((error) => alertAuthError(dispatch, error))
  );
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

export const updateOrders = (querySnapshot) => {
  let orders = {};
  querySnapshot.forEach((doc) => {
    orders[doc.id] = {
      ...doc.data(),
      date: moment(doc.id),
      key: doc.id
    };
  });
  return {
    type: Actions.UPDATE_ORDERS,
    orders
  };
};

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
  data: { uid, ...doc.data() }
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

export const changePassword = (dispatch, currentPassword, newPassword) => {
  dispatch(startLoading());
  const user = auth().currentUser;
  const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
  user.reauthenticateWithCredential(credential).then(() => (
    user.updatePassword(newPassword)
      .then(() => successAction("Password set successfully", dispatch))
      .catch((error) => alertAuthError(dispatch, error))
  )).catch((error) => alertAuthError(dispatch, error));
}

export const updateConstants = (data) => ({
  type: Actions.UPDATE_CONSTANTS,
  data: {
    ...data,
    cutoffTime: moment(data.cutoffTime)
  }
});

export const watchOrders = (dispatch, uid) => (
  myOrders(uid).onSnapshot(
    (querySnapshot) => dispatch(updateOrders(querySnapshot)),
    (error) => {
      console.log("this is the problem");
      alertFirestoreError(dispatch, error)
    }
  )
);

export const watchUserData = (dispatch, uid) => (
  myUserData(uid).onSnapshot(
    (doc) => dispatch(updateUserData(uid, doc)),
    (error) => alertFirestoreError(dispatch, error)
  )
);

export const watchPresets = (dispatch, uid) => (
  myPresets(uid).onSnapshot(
    (querySnapshot) => dispatch(updatePresets(querySnapshot)),
    (error) => alertFirestoreError(dispatch, error)
  )
);

export const watchAuthState = (dispatch) => (
  auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch(logInAction());
    } else {
      dispatch(logOutAction());
    }
  })
);

export const getUnauthData = (dispatch, onSuccess, onError) => (
  firestore.collection("appData")
    .doc("appConstants")
    .get()
    .then((doc) => {
      dispatch(updateConstants(doc.data()));
      onSuccess();
    }).catch((error) => {
      alertFirestoreError(dispatch, error);
      onError();
    })
);

export const getAuthData = (dispatch, onSuccess, onError) => {
  const uid = auth().currentUser.uid;
  return (
    Promise.all([
      myOrders(uid).get(),
      myUserData(uid).get(),
      firestore.collection("appData").doc("appConstants").get(),
      myPresets(uid).get()
    ]).then((results) => {
      const [ordersSnapshot, userData, stateConstants, presetsSnapshot] = results;
      dispatch(updateOrders(ordersSnapshot));
      dispatch(updateUserData(uid, userData));
      dispatch(updateConstants(stateConstants.data()));
      dispatch(updatePresets(presetsSnapshot))
      onSuccess();
    }).catch((error) => {
      alertFirestoreError(dispatch, error);
      onError();
    })
  )
}