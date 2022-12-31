import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { KeyboardAwareSectionList } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "../AnimatedTouchable";
import OrderField from "./OrderField";
import moment from "moment";
import createStyleSheet, { getColors } from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { groupToSimple, ISO_FORMAT, parseISO, READABLE_FORMAT, toReadable, toSimple } from "../../constants/Date";
import { InputTypes } from "../../constants/Inputs";
import { connect } from "react-redux";
import alert from "../../constants/Alert";
import { DynamicOrderOptions, getDateOptions } from "../../constants/DataActions";
import { getUserLunchSchedule, OrderScheduleTypes } from "../../constants/Schedule";
import { DateField } from "../../constants/RequiredFields";

const getDefault = (focusedOrder, orderOptions) => {
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
}

const isDynamic = (orderSchedule) => orderSchedule.scheduleType === OrderScheduleTypes.CUSTOM;

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

const resetOptionValues = (state, orderOptions) => {
  let newState = { ...state };
  for (let option of orderOptions) {
    if (option.type === InputTypes.PICKER && !option.dynamic && !option.required
      && !option.options.includes(state[option.key])) {
      newState[option.key] = "";
    } else if (option.type === InputTypes.CHECKBOX && !newState[option.key]) {
      newState[option.key] = [];
    }
  }
  return newState;
}

const CancelDoneButtons = ({ cancelOnPress, doneOnPress, themedStyles }) => (
  <View style={themedStyles.cancelDoneButtonsContainer}>
    <TouchableOpacity
      style={Layout.isSmallDevice ? themedStyles.cancelButtonMobile : themedStyles.cancelButton}
      onPress={cancelOnPress}
    >
      {Layout.isSmallDevice ?
        <Ionicons name={"close"} color={getColors().primaryText} size={50} /> :
        <Text style={themedStyles.cancelButtonText}>Cancel</Text>}
    </TouchableOpacity>
    <AnimatedTouchable
      style={Layout.isSmallDevice ? themedStyles.doneButtonMobile : themedStyles.doneButton}
      endSize={0.9}
      onPress={doneOnPress}
    >
      {Layout.isSmallDevice ?
        <Ionicons name={"checkbox"} color={getColors().accentColor} size={50} /> :
        <Text style={themedStyles.doneButtonText}>Done</Text>}
    </AnimatedTouchable>
  </View>
);

const DeleteButton = ({ onPress, message, themedStyles }) => (
  <TouchableOpacity style={themedStyles.deleteButton} onPress={onPress}>
    <Text style={themedStyles.deleteButtonText}>{message}</Text>
  </TouchableOpacity>
);

const getDynamicOrderOptions = (orderOptions, orderSchedule, orders, focusedData, orderPresets, lunchSchedule, state) => {
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
    const dateOptions = dateField.options;
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
}

const getDisplayOrderFields = (orderOptions, orderSchedule, focusedData, state, setFullState) => {
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
}

/**
 * Displays order-type fields
 */
const OrderInputsList = ({ title, focusedData, orderOptions, cancel, createNew, editExisting, deleteExisting, uid, domain, deleteMessage, orderPresets, orders, lunchSchedule, orderSchedule }) => {
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [state, setFullState] = useState(getDefault(focusedData, dynamicOptions));
  const [displayOptions, setDisplayOptions] = useState([]);
  const themedStyles = createStyleSheet(styles);
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
      newState = resetOptionValues(stateWithContent, dynamicOptions);
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
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.headerText}>{title}</Text>
        <CancelDoneButtons cancelOnPress={cancel} doneOnPress={submit} themedStyles={themedStyles} />
      </View>
      <KeyboardAwareSectionList
        keyboardOpeningTime={0}
        extraScrollHeight={50}
        alwaysBounceVertical={false}
        keyboardDismissMode={Layout.ios ? "interactive" : "on-drag"}
        contentContainerStyle={{ paddingBottom: inset.bottom + 100 }}
        ListFooterComponent={focusedData && (
          <DeleteButton onPress={deleteAndNavigate} message={deleteMessage} themedStyles={themedStyles} />
        )}
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
            <Text style={themedStyles.sectionHeader}>{section.title}</Text> :
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

const styles = (Colors) => ({
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