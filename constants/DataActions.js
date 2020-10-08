/**
 * @file Manages various pre-set actions for user/order data (such as changing password, getting date options, etc.)
 * @author Emily Sturman <emily@sturman.org>
 */
import { ISO_FORMAT, toReadable, toISO } from "./Date";
import inputModalProps from "../components/modals/InputModal";
import { InputTypes, TextTypes } from "./Inputs";
import moment from "moment";

// Options for dynamic order actions (on order screen)
export const DynamicOrderOptions = {
  DATE_OPTIONS: "DATE_OPTIONS", // see getDateOptions (below)
  PRESET_OPTIONS: "PRESET_OPTIONS" // gets user's order presets
}

// Options for custom editing actions (on settings screen)
export const EditActions = {
  CHANGE_PASSWORD: "CHANGE_PASSWORD"
}

// TODO: integrate actual school schedule (for days off, etc.)

/**
 * Whether a given date is a school day (Mon-Fri)
 *
 * @param {moment.Moment} date The date in question.
 *
 * @return {boolean} Whether date is a school day.
 */
const isSchoolDay = (date) => date.day() > 0 && date.day() < 6;

/**
 * Gets all days on which user may place an order.
 *
 * Filters out non-school days (weekends) and days on which user
 * has already placed an order; searches within 14 days (including
 * weekends).
 *
 * @param {Object<string, Object>} orders         Object containing all of user's orders.
 * @param {Object}                 [focusedOrder] Order that is currently being edited.
 * @param {moment.Moment}          cutoffTime     Time after which user may not place an order for today.
 *
 * @return {string[]} Options for dates for orders in readable format.
 */
export const getDateOptions = (orders, focusedOrder, cutoffTime) => {
  const orderDates = Object.keys(orders).map((id) => orders[id].date.format(ISO_FORMAT));
  let dateOptions = [];
  let date = moment();
  if (date.isAfter(cutoffTime)) {
    date.add(1, "days");
  }
  for (let i = 0; i < 14; i++) {
    let isoDate = date.format(ISO_FORMAT);
    // date must be a school day (Mon-Fri) and there must be no other order on that date
    if (isSchoolDay(date) && (!orderDates.includes(isoDate) || (focusedOrder && toISO(focusedOrder.date) === isoDate))) {
      dateOptions.push(toReadable(isoDate));
    }
    date.add(1, "days");
  }
  return dateOptions;
}

/**
 * Opens a modal to change user's password.
 *
 * Uses input modal for user input; takes old and new password
 * and executes change password action.
 *
 * @param {function}         openModal      Opens modal with given props.
 * @param {function(Object)} setModalProps  Sets top-level modal props.
 * @param {function}         changePassword Changes user's password.
 */
export const openChangePasswordModal = (openModal, setModalProps, changePassword) => {
  openModal(inputModalProps(
    "Change Password",
    [
      {
        key: "oldPassword",
        inputType: InputTypes.TEXT_INPUT,
        textType: TextTypes.PASSWORD,
        placeholder: "Current password"
      },
      {
        key: "newPassword",
        inputType: InputTypes.TEXT_INPUT,
        textType: TextTypes.NEW_PASSWORD,
        placeholder: "New password"
      }
    ],
    "Confirm",
    changePassword,
    setModalProps
  ));
};