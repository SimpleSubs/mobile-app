/**
 * @file Creates full page for order/preset screens.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { KeyboardAwareSectionList } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "../AnimatedTouchable";
import OrderField from "./OrderField";
import moment from "moment";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import {ISO_FORMAT, parseISO, READABLE_FORMAT, toReadable, toSimple} from "../../constants/Date";
import { InputTypes } from "../../constants/Inputs";
import { connect } from "react-redux";
import alert from "../../constants/Alert";
import { DynamicOrderOptions, getDateOptions } from "../../constants/DataActions";
import {getUserLunchSchedule, OrderScheduleTypes} from "../../constants/Schedule";
import { DateField } from "../../constants/RequiredFields";

/**
 * Gets default state.
 *
 * Returns focused order if an order is focused, otherwise returns default values
 * for all order options.
 *
 * @param {Object|null} focusedOrder Order currently being edited (null if it is a new order).
 * @param {Object[]}    orderOptions Array of order options.
 *
 * @return {Object} Initial, pre-edited order state.
 */
const getDefault = (focusedOrder, orderOptions) => {
  if (focusedOrder) {
    return {
      ...focusedOrder,
      date: focusedOrder.index || focusedOrder.date
    };
  }
  let newState = {};
  for (let option of orderOptions) {
    newState[option.key] = option.defaultValue;
  }
  return newState;
};

/**
 * Computes options if they are dynamic.
 *
 * Uses preset dynamic order options to get options; if options are constant,
 * then the function returns those options.
 *
 * @param {string|string[]}        options       Either a key representing dynamic order options or an array of options.
 * @param {Object<string, Object>} orders        All of the user's orders.
 * @param {Object|null}            focusedOrder  Object representing currently focused order (null if no object is focused).
 * @param {Object}                 orderPresets  Object containing all of the user's preset orders.
 * @param {Object}                 orderSchedule Contains data for ordering days.
 * @param {Object}                 lunchSchedule Contains data for lunch days.
 *
 * @return {{keys?: string[]|string[][], values: string[], useIndexValue: boolean}} Options to render in picker/checkboxes.
 */
const getStaticOptions = (options, orders, focusedOrder, orderPresets, lunchSchedule, orderSchedule) => {
  switch (options) {
    case DynamicOrderOptions.DATE_OPTIONS:
      return getDateOptions(orders, focusedOrder, lunchSchedule, orderSchedule);
    case DynamicOrderOptions.PRESET_OPTIONS:
      return {
        keys: Object.keys(orderPresets),
        values: Object.values(orderPresets).map(({ title }) => title),
        useIndexValue: false
      };
    default:
      return { values: options, useIndexValue: false };
  }
};

const getDynamicOptions = (dynamicOptions, options, orders, focusedOrder, orderPresets, lunchSchedule, orderSchedule) => {
  if (dynamicOptions) {
    return {
      options: dynamicOptions.map((option) => option ? {
        values: Object.values(option),
        useIndexValue: false
      } : { // If the day is empty (should NEVER happen), return an array of no options
        values: [],
        useIndexValue: false
      }),
      // Indicates whether the options will be one array (false), or a 7-element array each containing options for a
      // day of the week (true)
      dynamicDay: true
    };
  } else {
    return {
      options: getStaticOptions(options, orders, focusedOrder, orderPresets, lunchSchedule, orderSchedule),
      dynamicDay: false
    };
  }
}

const isDynamic = (orderSchedule) => orderSchedule.scheduleType === OrderScheduleTypes.CUSTOM;

/**
 * Checks if state is valid.
 *
 * Ensures that all required inputs are filled out: required inputs that
 * are checkboxes must have at least one value selected, required text inputs
 * must contain a value, and required pickers must have a selected value
 * within options (instead of, say, "Please select").
 *
 * @param {Object}   state              Current selected values in order.
 * @param {Object[]} orderOptions       Array of order options.
 * @param {boolean}  hasDynamicSchedule Whether order schedule is dynamic or simple (daily).
 *
 * @return {string[]} Array containing titles of invalid inputs
 */
const validateState = (state, orderOptions, hasDynamicSchedule) => {
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
          const indexIsValid = typeof subState[orderOption.key] === "number" && subState[orderOption.key] >= 0;
          const nonIndexIsValid = options.values.includes(subState[orderOption.key]);
          if (
            (orderOption.options.useIndexValue && !indexIsValid) ||
            (!orderOption.options.useIndexValue && !nonIndexIsValid)
          ) {
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
 * Checks if order is placed today after cutoff time.
 *
 * Important for the specific edge case where a user starts an order before
 * the cutoff time, places the order for today, and finishes the order after
 * the cutoff time.
 *
 * @param {string}        readableDate String version of order date in readable format ("dddd, MMMM Do")
 * @param {moment.Moment} cutoffTime   Time after which orders may not be placed for that day.
 *
 * @return {boolean} Whether order is placed after cutoff time (true if invalid).
 */
const isAfterCutoff = (readableDate, cutoffTime) => {
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
 * Checks if order preset title is unique.
 *
 * All presets must have a unique title; this function compares the current preset's
 * title to all of the other presets.
 *
 * @param {string}              title        Title of current preset.
 * @param {string}              [prevTitle=] Key for current preset (empty string if preset is new).
 * @param {Object<key, Object>} orderPresets Object containing all of the user's order presets.
 *
 * @return {boolean} Whether title is unique (true if valid).
 */
const isUniqueTitle = (title, prevTitle = "", orderPresets) => {
  let otherWithTitle = Object.keys(orderPresets).filter((id) => orderPresets[id].title === title).length > 0;
  if (prevTitle !== title && otherWithTitle) {
    alert(
      "Invalid title",
      "The current title is already in use. Please choose a unique title."
    );
    return false;
  }
  return true;
}

/**
 * Resets picker values if no selection has been made.
 *
 * Sets picker values to empty strings if no selection was made and the default value
 * is not in options for order (e.g. "Please select").
 *
 * @param {Object}   state        Current state of order.
 * @param {Object[]} orderOptions All order fields/options.
 *
 * @return {Object} State with reset picker values.
 */
const resetPickerVals = (state, orderOptions) => {
  let newState = { ...state };
  for (let option of orderOptions) {
    if (option.type === InputTypes.PICKER && !option.dynamic && !option.required
      && !option.options.values.includes(state[option.key])) {
      newState[option.key] = "";
    }
  }
  return newState;
}

/**
 * Renders cancel/done buttons in top right of screen.
 *
 * Renders buttons reading "cancel" and "done" if device is large, otherwise renders
 * ex/check icons.
 *
 * @param {Function} cancelOnPress Function to cancel order.
 * @param {Function} doneOnPress   Function to finish/push order.
 *
 * @return {React.ReactElement} View containing buttons to cancel and finish order.
 * @constructor
 */
const CancelDoneButtons = ({ cancelOnPress, doneOnPress }) => (
  <View style={styles.cancelDoneButtonsContainer}>
    <TouchableOpacity
      style={Layout.isSmallDevice ? styles.cancelButtonMobile : styles.cancelButton}
      onPress={cancelOnPress}
    >
      {Layout.isSmallDevice ?
        <Ionicons name={"close"} color={Colors.primaryText} size={50} /> :
        <Text style={styles.cancelButtonText}>Cancel</Text>}
    </TouchableOpacity>
    <AnimatedTouchable
      style={Layout.isSmallDevice ? styles.doneButtonMobile : styles.doneButton}
      endSize={0.9}
      onPress={doneOnPress}
    >
      {Layout.isSmallDevice ?
        <Ionicons name={"checkbox"} color={Colors.accentColor} size={50} /> :
        <Text style={styles.doneButtonText}>Done</Text>}
    </AnimatedTouchable>
  </View>
);

/**
 * Renders button to delete order/preset.
 *
 * Button is only rendered if order or preset is being edited.
 *
 * @param {Function} onPress Function to delete order/preset.
 * @param {string}   message Message to display in button.
 *
 * @return {React.ReactElement} Button to delete order/preset.
 * @constructor
 */
const DeleteButton = ({ onPress, message }) => (
  <TouchableOpacity style={styles.deleteButton} onPress={onPress}>
    <Text style={styles.deleteButtonText}>{message}</Text>
  </TouchableOpacity>
);

const getDynamicOrderOptions = (orderOptions, orderSchedule, orders, focusedData, orderPresets, lunchSchedule, state) => {
  const optionsWithDynamic = (orderOptions) => (
    orderOptions.map(({ dynamicOptions, ...orderOption }) => ({
      ...orderOption,
      ...getDynamicOptions(
        dynamicOptions,
        orderOption.options,
        orders, focusedData,
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
    options: getDateOptions(orders, focusedData, lunchSchedule, orderSchedule),
  };
  if (!isDynamic(orderSchedule)) {
    return [
      dateField,
      ...optionsWithDynamic(orderOptions.orderOptions, false)
    ];
  }
  if ((!state.date && state.date !== 0) || typeof state.date !== "number") {
    return [dateField];
  }
  let optionsToMap;
  if (!orderOptions.dynamic) {
    optionsToMap = orderOptions.orderOptions;
  } else {
    const dateOptions = dateField.options.keys;
    if (dateOptions && dateOptions.length > state.date) {
      const selectedDate = dateOptions[state.date][0];
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
}

const getDisplayOrderFields = (orderOptions, orderSchedule, focusedData, state, setFullState) => {
  const dateIndex = orderOptions.findIndex(({ key }) => key === "date");
  if (!isDynamic(orderSchedule) || dateIndex === -1) {
    return [{ data: orderOptions, isNested: false }];
  } else if ((!state.date && state.date !== 0) || typeof state.date !== "number") {
    return [{ data: [orderOptions[dateIndex]], isNested: false }];
  } else {
    const dateField = orderOptions.splice(dateIndex, 1)[0];
    const selectedDateGroup = dateField.options.keys[state.date] || [];
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
}

/**
 * Renders a screen that displays order-type fields.
 *
 * Can be used either for orders or user presets.
 *
 * @param {string}                 title          String to display in header.
 * @param {Object|null}            focusedData    Data that user is editing (null if order/preset is being created).
 * @param {Object}                 orderOptions   Order/preset fields.
 * @param {function}               cancel         Function to cancel order.
 * @param {function}               createNew      Function to create order/preset.
 * @param {function}               editExisting   Function to push edits to order/preset.
 * @param {function}               deleteExisting Function to delete order/preset.
 * @param {string}                 uid            Unique user ID (from Firebase Auth).
 * @param {string}                 domain         Domain key for user's domain.
 * @param {string}                 deleteMessage  Message to be displayed on delete button.
 * @param {Object<string, Object>} orderPresets   All of the user's order presets.
 * @param {Object<string, Object>} orders          Object containing all of user's orders.
 * @param {Object}                 orderSchedule   Contains data for ordering days.
 * @param {Object}                 lunchSchedule   Contains data for lunch days.
 *
 * @return {React.ReactElement} Screen element displaying order or preset fields.
 * @constructor
 */
const OrderInputsList = ({ title, focusedData, orderOptions, cancel, createNew, editExisting, deleteExisting, uid, domain, deleteMessage, orderPresets, orders, lunchSchedule, orderSchedule }) => {
  const [dynamicOptions, setDynamicOptions] = useState(
    getDynamicOrderOptions(
      orderOptions,
      orderSchedule,
      orders,
      focusedData,
      orderPresets,
      lunchSchedule,
      {}
    )
  );
  const [state, setFullState] = useState(getDefault(focusedData, dynamicOptions));
  const [displayOptions, setDisplayOptions] = useState([]);
  const inset = useSafeAreaInsets();

  const submit = () => {
    // Ensure all required fields are filled out
    const hasDynamicSchedule = isDynamic(orderSchedule);
    const invalidInputs = validateState(state, dynamicOptions, hasDynamicSchedule);
    if (invalidInputs.length > 0) {
      alert(
        "Fill out required fields",
        "The following fields need to be filled out before submission: " + invalidInputs.join(", ")
      );
      return;
    }
    // TODO: Ensure order isn't placed after cutoff time
    // TODO: Add compatibility with order presets
    // Ensure title of preset isn't already taken
    if (state.title && !isUniqueTitle(state.title, focusedData?.title, orderPresets)) {
      return;
    }
    let newState;

    if (state.preset) {
      // Fills state with preset fields
      let presetKey = Object.keys(orderPresets).filter((id) => orderPresets[id].title === state.preset);
      newState = {...orderPresets[presetKey], date: state.date};
    } else {
      // Filter out possible "empty" order dates (such as if a date did not have any possible options)
      let stateKeysWithContent = Object.keys(state).filter((key) => Object.keys(state[key]).length > 0);
      if (hasDynamicSchedule) {
        stateKeysWithContent = stateKeysWithContent.filter((key) => key !== "date");
      }
      let stateWithContent = {}
      stateKeysWithContent.forEach((key) => stateWithContent[key] = state[key]);
      newState = resetPickerVals(stateWithContent, dynamicOptions);
    }
    // Pushes to existing doc if editing, otherwise creates new doc
    if (Object.keys(newState).length > 0) {
      if (focusedData) {
        editExisting(newState, focusedData.keys || [focusedData.key], uid, domain, hasDynamicSchedule);
      } else {
        createNew(newState, uid, domain, hasDynamicSchedule);
      }
    }
    cancel();
  };

  const deleteAndNavigate = () => {
    if (focusedData) {
      deleteExisting(focusedData.keys || focusedData.key, domain, uid);
    }
    cancel();
  }

  const setState = (newState, sectionKey) => {
    if (sectionKey) {
      setFullState({
        ...state,
        [sectionKey]: {
          ...(state[sectionKey] || {}),
          ...newState
        }
      });
    } else {
      setFullState({ ...state, ...newState });
    }
  };

  useEffect(() => {
    const newOptions = getDynamicOrderOptions(
      orderOptions,
      orderSchedule,
      orders,
      focusedData,
      orderPresets,
      lunchSchedule,
      state
    );
    const newDisplayOptions = getDisplayOrderFields(
      newOptions,
      orderSchedule,
      focusedData,
      state,
      setFullState
    );
    setDynamicOptions(newOptions);
    setDisplayOptions(newDisplayOptions);
  }, [orderOptions, orderSchedule, orders, focusedData, orderPresets, lunchSchedule, state.date]);

  // May need to reinsert insets for Android (depends on how modal renders)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <CancelDoneButtons cancelOnPress={cancel} doneOnPress={submit} />
      </View>
      <KeyboardAwareSectionList
        keyboardOpeningTime={0}
        extraScrollHeight={50}
        alwaysBounceVertical={false}
        keyboardDismissMode={Layout.ios ? "interactive" : "on-drag"}
        contentContainerStyle={{ paddingBottom: inset.bottom }}
        ListFooterComponent={focusedData && <DeleteButton onPress={deleteAndNavigate} message={deleteMessage} />}
        sections={displayOptions}
        renderItem={({ item, section }) => (
          <OrderField
            {...item}
            options={item.options && item.dynamicDay ? item.options[section.dateIndex] : item.options}
            focusedOrder={focusedData}
            value={section.isNested ? state[section.key][item.key] : state[item.key]}
            setValue={(value) => {
              if (section.isNested) {
                setState({ [item.key]: value }, section.key);
              } else {
                setState({ [item.key]: value });
              }
            }}
          />
        )}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          section.isNested && section.data.length > 0 ?
            <Text style={styles.sectionHeader}>{section.title}</Text> :
            null
        )}
      />
    </View>
  )
};

const mapStateToProps = ({ stateConstants, orderPresets, user, domain, orders }) => ({
  orderPresets,
  uid: user.uid,
  domain: domain.id,
  orders,
  lunchSchedule: getUserLunchSchedule(stateConstants.lunchSchedule, user),
  orderSchedule: stateConstants.orderSchedule
});

export default connect(mapStateToProps, null)(OrderInputsList);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  header: {
    padding: 20,
    backgroundColor: Colors.backgroundColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    zIndex: 100,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  headerText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
    textAlign: "left",
    color: Colors.primaryText
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelButtonMobile: {
    alignItems: "center",
    justifyContent: "center"
  },
  cancelButtonText: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.title,
    textAlign: "center",
    color: Colors.secondaryText
  },
  doneButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: Colors.accentColor
  },
  doneButtonMobile: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  doneButtonText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center",
    color: Colors.textOnBackground
  },
  cancelDoneButtonsContainer: {
    flexDirection: "row"
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.errorText,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    color: Colors.textOnBackground
  },
  sectionHeader: {
    fontSize: Layout.fonts.title,
    fontFamily: "josefin-sans-bold",
    color: Colors.primaryText,
    flex: 1,
    padding: 20,
    paddingBottom: 10
  }
});