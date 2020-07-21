import moment from "moment";

export const ISO_FORMAT = "YYYY-MM-DD";
export const READABLE_FORMAT = "dddd, MMMM Do";

export const toISO = (date) => moment(date, READABLE_FORMAT).format(ISO_FORMAT);
export const toReadable = (date) => moment(date, ISO_FORMAT).format(READABLE_FORMAT);