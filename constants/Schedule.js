import moment from "moment";
import {ISO_FORMAT, parseISO, toReadable} from "./Date";

export const OrderScheduleTypes = {
  DAY_OF: "DAY_OF",
  DAY_BEFORE: "DAY_BEFORE",
  CUSTOM: "CUSTOM"
};

/**
 * Get an array containing a range of dates as specified by user.
 *
 * @param {moment.Moment} start        Start date (incl).
 * @param {number}        length       Number of dates to include (will subtract excluded weekdays from count).
 * @param {number}        [step=1]     Step between each date.
 * @param {number[]}      [exclude=[]] Weekdays to exclude.
 *
 * @return {string[]} Array of ISO dates starting at start date
 * containing `length` dates, with `step` days between them.
 */
const getDateRange = (start, length, step = 1, exclude = []) => (
  (new Array(length))
    .fill(null)
    .map((_, i) => moment(start).add(i * step, "days"))
    .filter((date) => !exclude.includes(date.day()))
    .map((date) => date.format(ISO_FORMAT))
);

export const getCutoffDate = (orderSchedule) => {
  let cutoffTime = orderSchedule.defaultTime;
  let todayMoment = moment();
  switch (orderSchedule.scheduleType) {
    case OrderScheduleTypes.DAY_OF:
      if (todayMoment.isBefore(moment(cutoffTime), "minute")) {
        todayMoment.subtract(1, "day");
      }
      return todayMoment.format(ISO_FORMAT);
    case OrderScheduleTypes.DAY_BEFORE:
      if (todayMoment.isSameOrAfter(moment(cutoffTime), "minute")) {
        todayMoment.add(1, "day");
      }
      return todayMoment.format(ISO_FORMAT);
    case OrderScheduleTypes.CUSTOM:
      const today = orderSchedule.schedule[moment().day()];
      if (today !== "default") {
        cutoffTime = today;
      }
      if (!cutoffTime) {
        return getPrevScheduledDate(orderSchedule.schedule, orderSchedule.defaultTime, moment().format(ISO_FORMAT));
      } else {
        if (todayMoment.isBefore(moment(cutoffTime), "minute")) {
          todayMoment.subtract(1, "day");
        }
        return todayMoment.format(ISO_FORMAT);
      }
    default:
      return todayMoment.format(ISO_FORMAT);
  }
}

/**
 * Gets the next available (non-null) date in schedule following the provided date.
 *
 * @param {Array<{hours: number, minutes: number}|string|null>} schedule                               7-element array representing custom schedule.
 * @param {{hours: number, minutes: number}}                    [defaultTime={hours: 23, minutes: 59}] Default cutoff time (defaults to end of the day).
 * @param {string}                                              [date=moment().format("YYYY-MM-DD")]   Start date in ISO format (defaults to today).
 *
 * @return {string} An ISO date representing the next available date in schedule.
 */
const getNextScheduledDate = (schedule, defaultTime = { hours: 23, minutes: 59 }, date = moment().format(ISO_FORMAT)) => {
  const currentDate = parseISO(date);
  const day = currentDate.day();
  if (schedule[day]) {
    const cutoffTime = schedule[day] === "default" ? defaultTime : schedule[day];
    if (moment().isAfter(cutoffTime)) {
      currentDate.add(1, "day");
    }
  }
  let iterCount = 0;
  while (!schedule[currentDate.day()]) {
    // If loop goes for more than 7 iterations, schedule is null-filled and therefore invalid
    if (iterCount >= 7) {
      throw new Error("Could not find an available date in provided schedule.");
    }
    currentDate.add(1, "day");
    iterCount++;
  }
  return currentDate.format(ISO_FORMAT);
};

// TODO: This is repetitive with getNextScheduledDate. Can probably condense.
/**
 * Gets the start date of current order session (either for today or for provided date).
 *
 * @param {Array<{hours: number, minutes: number}|string|null>} schedule                               7-element array representing custom schedule.
 * @param {{hours: number, minutes: number}}                    [defaultTime={hours: 23, minutes: 59}] Default cutoff time (defaults to end of the day).
 * @param {string}                                              [date=moment().format("YYYY-MM-DD")]   Start date in ISO format (defaults to today).
 *
 * @return {string} An ISO date representing the order session start date.
 */
const getPrevScheduledDate = (schedule, defaultTime = { hours: 23, minutes: 59 }, date = moment().format(ISO_FORMAT)) => {
  const currentDate = parseISO(date);
  const day = currentDate.day();
  if (schedule[day]) {
    const cutoffTime = schedule[day] === "default" ? defaultTime : schedule[day];
    if (moment().isAfter(cutoffTime)) {
      return currentDate.format(ISO_FORMAT);
    }
  }
  let iterCount = 0;
  while (!schedule[currentDate.day()]) {
    // If loop goes for more than 7 iterations, schedule is null-filled and therefore invalid
    if (iterCount >= 7) {
      throw new Error("Could not find an available date in provided schedule.");
    }
    currentDate.subtract(1, "day");
    iterCount++;
  }
  return currentDate.format(ISO_FORMAT);
}

/**
 * Get order date schedule for next two weeks based on a custom schedule and cutoff time.
 *
 * @param {{hours: number, minutes: number}}                    defaultTime            Default cutoff time.
 * @param {Array<{hours: number, minutes: number}|string|null>} schedule               7-element array containing custom schedule.
 * @param {string}                                              start                  Start of schedule range (incl).
 * @param {string}                                              end                    End of schedule range (incl).
 * @param {boolean}                                             [includeCurrent=false] Whether current order period should be included.
 *
 * @return {string[]} Array containing order dates in ISO format for the following two weeks.
 */
const getCustomOrderSchedule = (defaultTime, schedule, start, end) => {
  let orderCutoffs = [];
  let currentDate = parseISO(getPrevScheduledDate(schedule, defaultTime, start));
  while (currentDate.isSameOrBefore(end, "day")) {
    let nextDate = getNextScheduledDate(schedule, defaultTime, currentDate.format(ISO_FORMAT));
    if (parseISO(nextDate).isSameOrBefore(end, "day")) {
      orderCutoffs.push(nextDate);
    }
    currentDate = parseISO(nextDate).add(1, "days");
  }
  return orderCutoffs.sort();
}

/**
 * Generates an array of starting dates for all possible lunch orders within specified range (defaults to next
 * two weeks).
 *
 * @param {Object}                                              orderSchedule                         Contains data for ordering days.
 * @param {{hours: number, minutes: number}}                    orderSchedule.defaultTime             Default cutoff time for placing orders.
 * @param {string}                                              orderSchedule.scheduleType            Type of ordering schedule.
 * @param {Array<{hours: number, minutes: number}|string|null>} orderSchedule.schedule                (For custom schedule) 7-element array containing custom order schedule.
 * @param {Object}                                              lunchSchedule                         Contains data for lunch days.
 * @param {{hours: number, minutes: number}}                    lunchSchedule.defaultTime             Default print time.
 * @param {Array<{hours: number, minutes: number}|string|null>} lunchSchedule.schedule                7-element array containing custom lunch schedule.
 * @param {string}                                              [start=moment().format("YYYY-MM-DD")] Start of schedule range (incl).
 * @param {string}                                              [end=moment().format("YYYY-MM-DD")]   End of schedule range (incl).
 * @param {boolean}                                             [includeCurrent=false]                Whether current order period should be included.
 *
 * @return {string[]} Array containing ISO dates for possible lunch order dates within the next two weeks.
 */
export const getLunchSchedule = (orderSchedule, lunchSchedule, start, end) => {
  let lunchDays = [];
  let cutoffMoment;
  let rangeStart;
  let excludedLunchDates = lunchSchedule.schedule.map((_, i) => i).filter((i) => !lunchSchedule.schedule[i]);
  switch (orderSchedule.scheduleType) {
    case OrderScheduleTypes.DAY_OF:
      rangeStart = parseISO(start);
      cutoffMoment = rangeStart.set({ ...orderSchedule.defaultTime });
      if (moment().isSameOrAfter(cutoffMoment, "minutes")) {
        rangeStart.add(1, "day");
      }
      lunchDays = getDateRange(rangeStart, parseISO(end).diff(start, "days"), 1, excludedLunchDates);
      break;
    case OrderScheduleTypes.DAY_BEFORE:
      rangeStart = parseISO(start).subtract(1, "day");
      cutoffMoment = rangeStart.set({ ...orderSchedule.defaultTime });
      if (moment().isSameOrAfter(cutoffMoment, "minutes")) {
        rangeStart.add(1, "day");
      }
      lunchDays = getDateRange(rangeStart, parseISO(end).diff(start, "days"), 1, excludedLunchDates);
      break;
    case OrderScheduleTypes.CUSTOM:
      let orderDays = getCustomOrderSchedule(orderSchedule.defaultTime, orderSchedule.schedule, start, end);
      orderDays.forEach((date, i) => {
        const nextLunchDate = getNextScheduledDate(lunchSchedule.schedule, { hours: 11, minutes: 59 }, date);
        if (i === 0 || lunchDays[i - 1] !== nextLunchDate) {
          lunchDays.push(nextLunchDate);
        }
      });
      break;
    default:
      break;
  }
  return lunchDays;
};

/**
 * Generates 2D array of ISO dates representing order groups (for placing orders with dynamic order scheduling).
 *
 * @param {string[]}                                            dates    Array of ISO dates at the start of each lunch group.
 * @param {Array<{hours: number, minutes: number}|string|null>} schedule Schedule containing school/lunch days.
 *
 * @return {string[][]} 2D array of ISO dates that orders can be placed on.
 */
export const getScheduleGroups = (dates, schedule) => {
  const scheduleGroups = [];
  for (const isoDate of dates) {
    const group = [];
    const date = parseISO(isoDate).day(7);
    if (date.day() !== 0) {
      // Set start date to next Sunday if it's not already on this Sunday
      date.day(7);
    }
    for (let i = 0; i < 7; i++) {
      if (schedule[i]) {
        group.push(moment(date).day(i).format(ISO_FORMAT));
      }
    }
    scheduleGroups.push(group);
  }
  return scheduleGroups;
};

export const getValidOrderDates = (orders, focusedOrder, orderSchedule, lunchSchedule, start = moment().format(ISO_FORMAT), end = moment().add(14, "days").format(ISO_FORMAT)) => {
  const allOptions = getLunchSchedule(orderSchedule, lunchSchedule, start, end);
  let orderDates = Object.values(orders).map(({ date }) => date);
  switch (orderSchedule.scheduleType) {
    case OrderScheduleTypes.CUSTOM:
      const optionGroups = getScheduleGroups(allOptions, lunchSchedule.schedule);
      if (Array.isArray(orderDates[0])) {
        orderDates = orderDates.reduce((prev, current) => [...prev, ...current], []);
      }
      // Exclude option groups where order dates includes a date within the group and that order is not currently focused
      return optionGroups.filter((group, i) => (
        !group.some((date) => orderDates.includes(date)) || (focusedOrder && group[0] === focusedOrder[0])
      ));
    case OrderScheduleTypes.DAY_OF:
    case OrderScheduleTypes.DAY_BEFORE:
      return allOptions.filter((date) => !orderDates.includes(date) || focusedOrder === date);
    default:
      return [];
  }
};

export const isBeforeCutoff = (date, orderSchedule, lunchSchedule) => {
  let cutoffMoment = moment(orderSchedule.defaultTime);
  let dateMoment;
  switch (orderSchedule.scheduleType) {
    case OrderScheduleTypes.CUSTOM:
      dateMoment = parseISO(date[0]);
      let cutoffTime = orderSchedule.schedule[dateMoment.day()];
      let printTime = lunchSchedule.schedule[dateMoment.day()];
      let nextOrderDay = getNextScheduledDate(orderSchedule.schedule, orderSchedule.defaultTime);

      if (cutoffTime === "default") {
        cutoffTime = orderSchedule.defaultTime;
      } else if (!cutoffTime) {
        cutoffTime = { hours: 0, minutes: 0 };
      }
      if (printTime === "default") {
        printTime = lunchSchedule.defaultTime;
      } else if (!printTime) {
        printTime = { hours: 11, minutes: 59 };
      }

      return dateMoment.isAfter(nextOrderDay, "day") || (
        dateMoment.isSame(nextOrderDay, "day") &&
        moment(cutoffTime).isBefore(moment(printTime), "minutes")
      );
    case OrderScheduleTypes.DAY_OF:
      dateMoment = parseISO(date);
      return dateMoment.isBefore(cutoffMoment, "minutes");
    case OrderScheduleTypes.DAY_BEFORE:
      dateMoment = parseISO(date);
      cutoffMoment.subtract(1, "day");
      return dateMoment.isBefore(cutoffMoment, "minutes");
    default:
      return true;
  }
}

export const getUserLunchSchedule = (lunchSchedule, userData = {}) => {
  const userSchedule = lunchSchedule.schedule.map((daySchedule) => {
    if (!daySchedule) {
      return null;
      // if validFields is null, then all fields apply
    } else if (!lunchSchedule.dependent || !userData[lunchSchedule.dependent] || !daySchedule.validFields) {
      return daySchedule.time;
    } else if (daySchedule.validFields.includes(userData[lunchSchedule.dependent])) {
      return daySchedule.time;
    } else {
      return null;
    }
  });
  return {
    ...lunchSchedule,
    schedule: userSchedule
  };
}