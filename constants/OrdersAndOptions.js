import { groupToSimple, ISO_FORMAT, parseISO, READABLE_FORMAT, toReadable, toSimple } from "./Date";
import { DynamicOrderOptions, getDateOptions } from "./DataActions";
import { InputTypes } from "./Inputs";
import moment from "moment";
import alert from "./Alert";
import { DateField } from "./RequiredFields";
import { isDynamic } from "./Schedule";

/**
 * Convert placeholders options (i.e. dates and presets) into static options (to be displayed) for static schedules
 */
const getStaticOptions = (options = [], orders, focusedOrder, orderPresets, lunchSchedule, orderSchedule) => {
  const mapping = {};
  switch (options) {
    case DynamicOrderOptions.DATE_OPTIONS:
      return getDateOptions(orders, focusedOrder, lunchSchedule, orderSchedule);
    case DynamicOrderOptions.PRESET_OPTIONS:
      const values = [];
      for (const { title } of Object.values(orderPresets)) {
        mapping[title] = title;
        values.push(title);
      }
      return {
        options: values,
        mapping
      };
    default:
      for (const option of options) {
        mapping[option] = option;
      }
      return { options, mapping };
  }
};

const getDynamicOptions = (dynamicOptions, options, orders, focusedOrder, orderPresets, lunchSchedule, orderSchedule) => {
  if (dynamicOptions) {
    return {
      // If the day is empty (should NEVER happen), return an array of no options
      options: dynamicOptions.map((option) => option ? Object.values(option) : []),
      // Indicates whether the options will be one array (false), or a 7-element array each containing options for a
      // day of the week (true)
      dynamicDay: true
    };
  } else {
    return {
      ...getStaticOptions(options, orders, focusedOrder, orderPresets, lunchSchedule, orderSchedule),
      dynamicDay: false
    };
  }
};

/**
 * Get default order state
 */
export const getDefault = (focusedOrder, orderOptions) => {
  // Existing order should just use values already in order
  if (focusedOrder) {
    return {
      ...focusedOrder,
      date: focusedOrder.multipleOrders ? groupToSimple(focusedOrder.date) : toReadable(focusedOrder.date)
    };
  }
  let newState = {};
  for (let option of orderOptions) {
    newState[option.key] = option.defaultValue;
  }
  return newState;
};

/**
 * Validates state of OrderInputsList for submission
 */
export const validateOrderState = (state, orderOptions, hasDynamicSchedule) => {
  const validateFields = (subState, checkDate = true, checkOnlyDate = false, stateName = null, dateIndex = null) => {
    const invalidInputs = [];
    const finalStateName =  stateName ? ` (${stateName})` : "";
    for (const orderOption of orderOptions) {
      if (
        (!checkDate && orderOption.key === "date") ||
        (checkOnlyDate && orderOption.key !== "date") ||
        !orderOption.required
      ) {
        continue;
      }
      switch (orderOption.type) {
        case InputTypes.CHECKBOX:
        case InputTypes.TEXT_INPUT:
          if (subState[orderOption.key].length === 0) {
            invalidInputs.push(orderOption.title + finalStateName);
          }
          break;
        case InputTypes.PICKER:
          const options = orderOption.dynamicDay && dateIndex ? orderOption.options[dateIndex] : orderOption.options;
          if (!options.includes(subState[orderOption.key])) {
            invalidInputs.push(orderOption.title + finalStateName);
          }
          break;
        default:
          break;
      }
    }
    return invalidInputs;
  }
  if (!hasDynamicSchedule) {
    return validateFields(state);
  } else {
    let invalidInputs = validateFields({ date: state.date }, true, true);
    if (invalidInputs.length > 0) {
      return invalidInputs;
    }
    for (const key of Object.keys(state)) {
      // If key isn't date field, then it is a date mapping to order substate
      if (key !== "date") {
        invalidInputs = [
          ...invalidInputs,
          ...validateFields(state[key], false, false, toSimple(key), parseISO(key).day())
        ];
      }
    }
    return invalidInputs;
  }
};

/**
 * Whether a provided date is after the cutoff time for the current day
 */
export const isAfterCutoff = (readableDate, cutoffTime) => {
  const date = moment(readableDate, READABLE_FORMAT);
  const now = moment();
  if (now.isAfter(cutoffTime) && date.isSameOrBefore(now)) {
    alert(
      "Invalid date",
      "The date you have selected is no longer valid. This could mean that the order cutoff has passed " +
      "since you began your order. Please try again later."
    );
    return true;
  }
  return false;
};

/**
 * Whether a title is already the title of another order preset
 */
export const isUniqueTitle = (title, prevTitle = "", orderPresets) => {
  const isUnique = Object.keys(orderPresets).filter((id) => orderPresets[id].title === title).length === 0;
  // Ignore if preset title has not changed
  if (prevTitle !== title && !isUnique) {
    alert(
      "Invalid title",
      "The current title is already in use. Please choose a unique title."
    );
    return false;
  }
  return true;
}

/**
 * Provides state with picker and checkbox values set to empty strings/arrays (rather than null)
 */
export const resetOptionValues = (state, orderOptions) => {
  let newState = { ...state };
  for (let option of orderOptions) {
    if (
      option.type === InputTypes.PICKER &&
      !option.dynamic &&
      !option.required &&
      !option.options.includes(state[option.key])
    ) {
      newState[option.key] = "";
    } else if (option.type === InputTypes.CHECKBOX && !newState[option.key]) {
      newState[option.key] = [];
    }
  }
  return newState;
}

/**
 * Convert state order options into usable order options (for validation, etc.)
 */
export const getAllOrderOptions = (orderOptions, orderSchedule, orders, focusedData, orderPresets, lunchSchedule, state) => {
  const optionsWithDynamic = (orderOptions) => (
    orderOptions.map(({ dynamicOptions, ...orderOption }) => ({
      ...orderOption,
      ...getDynamicOptions(
        dynamicOptions,
        orderOption.options,
        orders,
        focusedData,
        orderPresets,
        lunchSchedule,
        orderSchedule
      )
    }))
  );
  if (!orderOptions.requireDate) {
    return optionsWithDynamic(orderOptions.orderOptions, false);
  }
  const dateField = {
    ...DateField,
    ...getDateOptions(orders, focusedData, lunchSchedule, orderSchedule)
  };
  if (!isDynamic(orderSchedule)) {
    return [
      dateField,
      ...optionsWithDynamic(orderOptions.orderOptions, false)
    ];
  }
  if (!state.date || !dateField.options.includes(state.date)) {
    return [dateField];
  }
  let optionsToMap;
  if (!orderOptions.dynamic) {
    optionsToMap = orderOptions.orderOptions;
  } else {
    if (dateField.options.includes(state.date)) {
      const selectedDate = dateField.mapping[state.date][0];
      const sunday = parseISO(selectedDate).day(0).format(ISO_FORMAT);
      optionsToMap = orderOptions[sunday] || [];
    } else {
      optionsToMap = [];
    }
  }
  return [
    dateField,
    ...optionsWithDynamic(optionsToMap)
  ];
};

/**
 * Convert dynamic order options into display-able order options
 */
export const getDisplayOrderFields = (orderOptions, orderSchedule, focusedData, state, setFullState) => {
  const dateIndex = orderOptions.findIndex(({ key }) => key === "date");
  if (!isDynamic(orderSchedule) || dateIndex === -1) {
    setFullState({ ...getDefault(focusedData, orderOptions), ...state });
    return [{ data: orderOptions, isNested: false }];
  } else if (!state.date || !orderOptions[dateIndex].options.includes(state.date)) {
    setFullState({ date: orderOptions[dateIndex].defaultValue, ...state });
    return [{ data: [orderOptions[dateIndex]], isNested: false }];
  } else {
    const dateField = orderOptions.splice(dateIndex, 1)[0];
    const selectedDateGroup = dateField.mapping[state.date] || [];
    let newState = {};
    selectedDateGroup.forEach((date) => {
      const existsInState = state[date] && Object.keys(state[date]).length > 0;
      newState[date] = existsInState ? state[date] : getDefault(focusedData && focusedData[date], orderOptions);
    });
    setFullState({ date: state.date, ...newState });
    return [
      { data: [dateField], isNested: false },
      ...selectedDateGroup.map((date) => ({
        key: date,
        dateIndex: parseISO(date).day(),
        title: toReadable(date),
        data: orderOptions,
        isNested: true
      }))
    ];
  }
};

/**
 * Gets array of user's future orders sorted chronologically.
 */
export const getOrdersArr = (orders, dynamicSchedule) => {
  if (!dynamicSchedule) {
    return Object.values(orders)
      .sort((orderA, orderB) => parseISO(orderA.date).diff(orderB.date))
      .map((order) => ({ ...order, date: toReadable(order.date) }));
  }
  return Object.values(orders)
    .sort((orderA, orderB) => parseISO(orderA.date[0]).diff(orderB.date[0]))
    .map(({ date, key, keys, multipleOrders, ...orderGroups }) => ({
      date: `${toSimple(date[0])} to ${toSimple(date[date.length - 1])}`,
      key,
      keys,
      multipleOrders,
      data: Object.values(orderGroups)
        .sort((orderA, orderB) => parseISO(orderA.date).diff(orderB.date))
        .map((order) => ({ ...order, date: toReadable(order.date) }))
    }));
};