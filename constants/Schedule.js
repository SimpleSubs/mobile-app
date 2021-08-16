import moment from "moment";
import { ISO_FORMAT, parseISO } from "./Date";

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
const getCustomOrderSchedule = (defaultTime, schedule, start, end, includeCurrent) => {
  let orderCutoffs = [];
  let currentDate = includeCurrent ? parseISO(getPrevScheduledDate(schedule, defaultTime, start)) : parseISO(start);
  while (currentDate.isSameOrBefore(end, "day")) {
    let nextDate = getNextScheduledDate(schedule, defaultTime, currentDate.format(ISO_FORMAT));
    orderCutoffs.push(nextDate);
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
export const getLunchSchedule = (orderSchedule, lunchSchedule, start = moment().format(ISO_FORMAT), end = moment().add(14, "days").format(ISO_FORMAT), includeCurrent = false) => {
  let lunchDays = [];
  let beforeCutoff = moment().isBefore(orderSchedule.defaultTime, "minute");
  let excludedLunchDates = lunchSchedule.schedule.map((_, i) => i).filter((i) => !lunchSchedule.schedule[i]);
  switch (orderSchedule.scheduleType) {
    case OrderScheduleTypes.DAY_OF:
    case OrderScheduleTypes.DAY_BEFORE:
      let rangeStart = parseISO(start);
      if (includeCurrent) {
        rangeStart.subtract(1, "days");
      }
      if (
        (!beforeCutoff && orderSchedule.scheduleType === OrderScheduleTypes.DAY_OF) ||
        (beforeCutoff && orderSchedule.scheduleType === OrderScheduleTypes.DAY_BEFORE)
      ) {
        rangeStart.add(1, "days");
      } else if (orderSchedule.scheduleType === OrderScheduleTypes.DAY_BEFORE) {
        rangeStart.add(2, "days");
      }
      lunchDays = getDateRange(rangeStart, parseISO(end).diff(parseISO(start)), 1, excludedLunchDates);
      break;
    case OrderScheduleTypes.CUSTOM:
      let orderDays = getCustomOrderSchedule(orderSchedule.defaultTime, orderSchedule.schedule, start, end, includeCurrent);
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
 * @param {string[]}                                            dates    Array of ISO dates at the start of each lunch group (including an excluded ending date).
 * @param {Array<{hours: number, minutes: number}|string|null>} schedule Schedule containing school/lunch days.
 *
 * @return {string[][]} 2D array of ISO dates that the length of `dates` - 1 (excludes last date on `dates`).
 */
export const getScheduleGroups = (dates, schedule) => {
  const scheduleGroups = [];
  for (let i = 0; i < dates.length - 1; i++) {
    const group = [];
    const thisDate = parseISO(dates[i]);
    while (thisDate.isBefore(parseISO(dates[i + 1]))) {
      if (schedule[thisDate.day()]) {
        group.push(thisDate.format(ISO_FORMAT));
      }
      thisDate.add(1, "day");
    }
    scheduleGroups.push(group);
  }
  return scheduleGroups;
};

// export const getDateIndex = (date, orderSchedule, lunchSc)