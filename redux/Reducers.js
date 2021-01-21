/**
 * @file Processes actions and reduces them into a single app state.
 * @author Emily Sturman <emily@sturman.org>
 */
import Actions from "./Actions";
import { combineReducers } from "redux";
import { CLOSED_INFO_MODAL } from "../components/modals/InfoModal";

/**
 * Gets user's order state.
 *
 * @param {Object} [state={}] Current order state.
 * @param {Object} action     Action object passed through dispatch.
 *
 * @return {Object} New order state.
 */
const orders = (state = {}, action) => (
  action.type === Actions.UPDATE_ORDERS
    ? action.orders
    : state
);

/**
 * Gets app's focused order state.
 *
 * @param {string|null} [state=null] Currently focused order.
 * @param {Object}      action       Action object passed through dispatch.
 *
 * @return {string|null} New focused order state.
 */
const focusedOrder = (state = null, action) => (
  action.type === Actions.FOCUS_ORDER
    ? action.id
    : state
);

/**
 * Gets user's profile state.
 *
 * @param {Object|null} [state=null] Current profile state.
 * @param {Object}      action       Action object passed through dispatch.
 *
 * @return {Object} New profile state.
 */
const user = (state = null, action) => (
  action.type === Actions.UPDATE_USER_DATA
    ? action.data
    : state
);

const hasAuthenticated = (state = false, action) => (
  action.type === Actions.UPDATE_USER_DATA
    ? true
    : state
)

/**
 * Gets app's modal state.
 *
 * @param {Object} [state={}] Current modal state.
 * @param {Object} action     Action object passed through dispatch.
 *
 * @return {Object} New modal state.
 */
const modal = (state = {}, action) => (
  action.type === Actions.SET_MODAL_PROPS
    ? { ...state, ...action.props }
    : state
);

/**
 * Gets app's info message state.
 *
 * @param {string} [state=    ] Current order state.
 * @param {Object} action       Action object passed through dispatch.
 *
 * @return {Object} New info message state.
 */
const infoMessage = (state = CLOSED_INFO_MODAL, action) => (
  action.type === Actions.SET_INFO_MESSAGE
    ? action.message
    : state
);

/**
 * Gets app constants state.
 *
 * @param {Object} [state={}] Current constants state.
 * @param {Object} action     Action object passed through dispatch.
 *
 * @return {Object} New app constants state.
 */
const stateConstants = (state = {}, action) => (
  action.type === Actions.UPDATE_CONSTANTS
    ? action.data
    : state
);

const domain = (state = null, action) => (
  action.type === Actions.SET_DOMAIN
    ? action.domain
    : state
);

/**
 * Gets app loading state.
 *
 * @param {boolean} [state=false] Current loading state.
 * @param {Object}  action        Action object passed through dispatch.
 *
 * @return {Object} New loading state.
 */
const loading = (state = false, action) => (
  action.type === Actions.SET_LOADING
    ? action.loading
    : state
);

/**
 * Gets user's order presets.
 *
 * @param {Object} [state={}] Current presets state.
 * @param {Object} action     Action object passed through dispatch.
 *
 * @return {Object} New presets state.
 */
const orderPresets = (state = {}, action) => (
  action.type === Actions.UPDATE_PRESETS
    ? action.presets
    : state
);

/**
 * Gets app's focused preset state.
 *
 * @param {string|null} [state=null] Current focused preset state.
 * @param {Object}      action       Action object passed through dispatch.
 *
 * @return {Object} New focused preset state.
 */
const focusedPreset = (state = null, action) => (
  action.type === Actions.FOCUS_PRESET
    ? action.id
    : state
)

/**
 * Complete app state (derived from above sub-states).
 */
const sandwichApp = combineReducers({
  orders,
  focusedOrder,
  focusedPreset,
  user,
  hasAuthenticated,
  orderPresets,
  modal,
  infoMessage,
  stateConstants,
  domain,
  loading
})

export default sandwichApp;