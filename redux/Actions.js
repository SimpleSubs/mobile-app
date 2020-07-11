import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

const Actions = {
  EDIT_ORDER: "EDIT_ORDER",
  DELETE_ORDER: "DELETE_ORDER",
  FOCUS_ORDER: "FOCUS_ORDER",
  LOG_IN: "LOG_IN",
  LOG_OUT: "LOG_OUT",
  EDIT_USER_DATA: "EDIT_USER_DATA",
  CREATE_USER: "CREATE_USER",
  SET_MODAL_PROPS: "SET_MODAL_PROPS",
  SET_INFO_MESSAGE: "SET_INFO_MESSAGE"
};

export default Actions;

export const createOrder = (data) => {
  const id = uuid();
  return {
    type: Actions.EDIT_ORDER,
    id,
    data: {
      ...data,
      id
    }
  }
};

export const editOrder = (id, data) => ({
  type: Actions.EDIT_ORDER,
  id,
  data
});

export const deleteOrder = (id) => ({
  type: Actions.DELETE_ORDER,
  id
});

export const focusOrder = (id) => ({
  type: Actions.FOCUS_ORDER,
  id
})

export const unfocusOrder = () => ({
  type: Actions.FOCUS_ORDER,
  id: null
})

export const logIn = (email, password) => ({
  type: Actions.LOG_IN,
  email,
  password
});

export const logOut = () => ({
  type: Actions.LOG_OUT
});

export const editUserData = (data) => ({
  type: Actions.EDIT_USER_DATA,
  data
});

export const createUser = ({ email, password, ...data }) => ({
  type: Actions.CREATE_USER,
  email,
  password,
  data: {
    email,
    ...data
  }
})

export const openModal = (props) => ({
  type: Actions.SET_MODAL_PROPS,
  props: { ...props, open: true }
});

export const setModalProps = (props) => ({
  type: Actions.SET_MODAL_PROPS,
  props
})

export const closeModal = () => ({
  type: Actions.SET_MODAL_PROPS,
  props: { open: false }
});

export const setInfoMessage = (message) => ({
  type: Actions.SET_INFO_MESSAGE,
  message
})