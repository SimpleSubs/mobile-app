/**
 * @file Manages various pre-set actions for user/order data (such as changing password, getting date options, etc.)
 * @author Emily Sturman <emily@sturman.org>
 */
import {ISO_FORMAT, toReadable, toSimple} from "./Date";
import inputModalProps from "../components/modals/InputModal";
import { InputTypes, TextTypes } from "./Inputs";
import { getValidOrderDates, isBeforeCutoff, OrderScheduleTypes } from "./Schedule";
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

/**
 * Gets the index of a given date on the provided school schedule.
 *
 * Calculates the difference between the schedule start date and
 * the provided date, then calculates the remainder when that is
 * divided by the schedule length (schedule repeats).
 *
 * @param {moment.Moment} date           Date to get the index of.
 * @param {string}        startDate      Start date of schedule.
 * @param {number}        scheduleLength Length of provided schedule.
 *
 * @return {number} The index of the date on the schedule.
 */
const getScheduleIndex = (date, startDate, scheduleLength) => date.diff(startDate, "days") % scheduleLength;

/**
 * Whether a given date is a school day (determined by given school schedule).
 *
 * @param {moment.Moment} date     The date in question.
 * @param {Object}        schedule An object representing a repeating school schedule.
 *
 * @return {boolean} Whether date is a school day.
 */
const isSchoolDay = (date, schedule) => {
  let scheduleIndex = getScheduleIndex(date, schedule.startDate, schedule.values.length);
  return schedule.values[scheduleIndex];
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
 * @return {{keys?: string[][], values: string[], useIndexValue: boolean}} Options to render dates for order.
 */
export const getDateOptions = (orders, focusedOrder, lunchSchedule, orderSchedule) => {
  let end = orderSchedule.scheduleType === OrderScheduleTypes.CUSTOM ? 21 : 14;
  const options = getValidOrderDates(
    orders,
    (focusedOrder?.index || focusedOrder?.index === 0) ? focusedOrder?.index : focusedOrder?.date,
    orderSchedule,
    lunchSchedule,
    moment().format(ISO_FORMAT),
    moment().add(end, "days").format(ISO_FORMAT)
  );
  if (
    orderSchedule.scheduleType === OrderScheduleTypes.CUSTOM &&
    options.length > 0 &&
    !isBeforeCutoff(options[0], orderSchedule, lunchSchedule)
  ) {
    options.shift();
  }
  switch (orderSchedule.scheduleType) {
    case OrderScheduleTypes.DAY_OF:
    case OrderScheduleTypes.DAY_BEFORE:
      return {
        values: options.map((date) => toReadable(date)),
        useIndexValue: false
      };
    case OrderScheduleTypes.CUSTOM:
      return {
        keys: options,
        values: options.map((group) => `${toSimple(group[0])} to ${toSimple(group[group.length - 1])}`),
        useIndexValue: true
      };
    default:
      return {
        values: options,
        useIndexValue: false
      }
  }
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