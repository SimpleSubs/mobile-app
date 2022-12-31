import moment from "moment";

// Format that date is stored in Firestore; ex: 2020-07-04
export const ISO_FORMAT = "YYYY-MM-DD";
// Format that date is displayed in; ex: Saturday, July 4th
export const READABLE_FORMAT = "dddd, MMMM Do";
// Simple format for displaying date in abbreviated instances; ex: 7/04
export const SIMPLE_FORMAT = "M/DD";

/**
 * Converts ISO date to Moment.js date
 */
export const parseISO = (date) => moment(date, ISO_FORMAT);

/**
 * Converts readable date to ISO date
 */
export const toISO = (date) => moment(date, READABLE_FORMAT).format(ISO_FORMAT);

/**
 * Converts ISO date to readable date
 */
export const toReadable = (date) => parseISO(date).format(READABLE_FORMAT);

/**
 * Converts ISO date to simple date
 */
export const toSimple = (date) => parseISO(date).format(SIMPLE_FORMAT);

export const groupToSimple = (group) => `${toSimple(group[0])} to ${toSimple(group[group.length - 1])}`;