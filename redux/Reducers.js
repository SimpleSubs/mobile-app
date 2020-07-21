import Actions from "./Actions";
import { combineReducers } from "redux";
import { CLOSED_INFO_MODAL } from "../components/modals/InfoModal";

const orders = (state = {}, action) => (
  action.type === Actions.UPDATE_ORDERS
    ? action.orders
    : state
);

const focusedOrder = (state = null, action) => (
  action.type === Actions.FOCUS_ORDER
    ? action.id
    : state
);

const user = (state = null, action) => (
  action.type === Actions.UPDATE_USER_DATA
    ? action.data
    : state
);

const modal = (state = {}, action) => (
  action.type === Actions.SET_MODAL_PROPS
    ? { ...state, ...action.props }
    : state
);

const infoMessage = (state = CLOSED_INFO_MODAL, action) => (
  action.type === Actions.SET_INFO_MESSAGE
    ? action.message
    : state
);

const stateConstants = (state = {}, action) => (
  action.type === Actions.UPDATE_CONSTANTS
    ? action.data
    : state
);

const loading = (state = false, action) => (
  action.type === Actions.SET_LOADING
    ? action.loading
    : state
);

const orderPresets = (state = {}, action) => (
  action.type === Actions.UPDATE_PRESETS
    ? action.presets
    : state
);

const focusedPreset = (state = null, action) => (
  action.type === Actions.FOCUS_PRESET
    ? action.id
    : state
)

const sandwichApp = combineReducers({
  orders,
  focusedOrder,
  focusedPreset,
  user,
  orderPresets,
  modal,
  infoMessage,
  stateConstants,
  loading
})

export default sandwichApp;