/**
 * @file Manages various pre-set actions for user/order data (such as changing password, getting date options, etc.)
 * @author Emily Sturman <emily@sturman.org>
 */
import {groupToSimple, toReadable, toSimple} from "./Date";
import inputModalProps from "../components/modals/InputModal";
import { InputTypes, TextTypes } from "./Inputs";
import { getValidOrderDates, isBeforeCutoff, OrderScheduleTypes } from "./Schedule";

// Options for dynamic order actions (on order screen)
export const DynamicOrderOptions = {
  DATE_OPTIONS: "DATE_OPTIONS", // see getDateOptions (below)
  PRESET_OPTIONS: "PRESET_OPTIONS" // gets user's order presets
}

// Options for custom editing actions (on settings screen)
export const EditActions = {
  CHANGE_PASSWORD: "CHANGE_PASSWORD"
}

/**
 * Gets all days on which user may place an order.
 *
 * Filters out non-school days (weekends) and days on which user
 * has already placed an order; searches within 14 days (including
 * weekends).
 *
 * @param {Object<string, Object>} orders         Object containing all of user's orders.
 * @param {Object}                 [focusedOrder] Order that is currently being edited.
 * @param {Object}                 orderSchedule  Contains data for ordering days.
 * @param {Object}                 lunchSchedule  Contains data for lunch days.
 *
 * @return {{options: string[], mapping: Object}} Options to render dates for order.
 */
export const getDateOptions = (orders, focusedOrder, lunchSchedule, orderSchedule) => {
  const options = getValidOrderDates(
    orders,
    focusedOrder?.date,
    orderSchedule,
    lunchSchedule
  );
  const mapping = {};
  const values = [];
  switch (orderSchedule.scheduleType) {
    case OrderScheduleTypes.DAY_OF:
    case OrderScheduleTypes.DAY_BEFORE:
      for (const date of options) {
        const readableDate = toReadable(date);
        mapping[readableDate] = date;
        values.push(readableDate);
      }
      break;
    case OrderScheduleTypes.CUSTOM:
      for (const group of options) {
        const readableGroup = groupToSimple(group);
        mapping[readableGroup] = group;
        values.push(readableGroup);
      }
      break;
    default:
      for (const option of options) {
        mapping[option] = option;
        values.push(option);
      }
      break;
  }
  return { options: values, mapping };
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