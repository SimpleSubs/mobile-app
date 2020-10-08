/**
 * @file Manages formatting/parsing dates using Moment.js.
 * @author Emily Sturman <emily@sturman.org>
 */
import moment from "moment";

// Format that date is stored in Firestore; ex: 2020-07-04
export const ISO_FORMAT = "YYYY-MM-DD";
// Format that date is displayed in; ex: Saturday, July 4th
export const READABLE_FORMAT = "dddd, MMMM Do";

/**
 * Converts readable date to ISO date.
 * @param {string} date Date in readable format (ex: Saturday, July 4th).
 * @return {string} Date in ISO format (ex: 2020-07-04).
 */
export const toISO = (date) => moment(date, READABLE_FORMAT).format(ISO_FORMAT);

/**
 * Converts ISO date to readable date.
 * @param {string} date Date in ISO format (ex: 2020-07-04).
 * @return {string} Date in readable format (ex: Saturday, July 4th).
 */
export const toReadable = (date) => moment(date, ISO_FORMAT).format(READABLE_FORMAT);