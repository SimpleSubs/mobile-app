/**
 * @file Creates full page for order/preset screens.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "../AnimatedTouchable";
import OrderField from "./OrderField";
import moment from "moment";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { READABLE_FORMAT } from "../../constants/Date";
import { InputTypes } from "../../constants/Inputs";
import { connect } from "react-redux";
import alert from "../../constants/Alert";

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
    return focusedOrder;
  }
  let newState = {};
  for (let option of orderOptions) {
    newState[option.key] = option.defaultValue;
  }
  return newState;
};

/**
 * Checks if state is valid.
 *
 * Ensures that all required inputs are filled out: required inputs that
 * are checkboxes must have at least one value selected, required text inputs
 * must contain a value, and required pickers must have a selected value
 * within options (instead of, say, "Please select").
 *
 * @param {Object}   state        Current selected values in order.
 * @param {Object[]} orderOptions Array of order options.
 *
 * @return {string[]} Array containing titles of invalid inputs
 */
const validateState = (state, orderOptions) => {
  let invalidInputs = [];
  for (let option of orderOptions) {
    if (option.required) {
      switch (option.type) {
        case InputTypes.CHECKBOX:
        case InputTypes.TEXT_INPUT:
          if (state[option.key].length === 0) {
            invalidInputs.push(option.title);
          }
          break;
        case InputTypes.PICKER:
          if (option.dynamic) {
            if (state[option.key] === option.defaultValue) {
              invalidInputs.push(option.title);
            }
          } else if (!option.options.includes(state[option.key])) {
            invalidInputs.push(option.title);
          }
          break;
        default:
          break;
      }
    }
  }
  return invalidInputs;
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
      && !option.options.includes(state[option.key])) {
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
)

/**
 * Renders a screen that displays order-type fields.
 *
 * Can be used either for orders or user presets.
 *
 * @param {string}              title          String to display in header.
 * @param {Object|null}         focusedData    Data that user is editing (null if order/preset is being created).
 * @param {Object[]}            orderOptions   Order/preset fields.
 * @param {function}            cancel         Function to cancel order.
 * @param {function}            createNew      Function to create order/preset.
 * @param {function}            editExisting   Function to push edits to order/preset.
 * @param {function}            deleteExisting Function to delete order/preset.
 * @param {string}              uid            Unique user ID (from Firebase Auth).
 * @param {moment.Moment}       cutoffTime     Time after which orders may not be placed for that day.
 * @param {string}              domain         Domain key for user's domain.
 * @param {string}              deleteMessage  Message to be displayed on delete button.
 * @param {Object<key, Object>} orderPresets   All of the user's order presets.
 *
 * @return {React.ReactElement} Screen element displaying order or preset fields.
 * @constructor
 */
const OrderInputsList = ({ title, focusedData, orderOptions, cancel, createNew, editExisting, deleteExisting, uid, cutoffTime, domain, deleteMessage, orderPresets }) => {
  const [state, setFullState] = useState(getDefault(focusedData, orderOptions));
  const inset = useSafeAreaInsets();

  const submit = () => {
    // Ensure all required fields are filled out
    const invalidInputs = validateState(state, orderOptions);
    if (invalidInputs.length > 0) {
      alert(
        "Fill out required fields",
        "The following fields need to be filled out before submission: " + invalidInputs.join(", ")
      );
      return;
    }
    // Ensure date isn't set before cutoff
    if (state.date && isAfterCutoff(state.date, cutoffTime)) {
      cancel();
      return;
    }
    // Ensure title of preset isn't already taken
    if (state.title && !isUniqueTitle(state.title, focusedData?.title, orderPresets)) {
      return;
    }
    let newState;
    if (state.preset) {
      // Fills state with preset fields
      let presetKey = Object.keys(orderPresets).filter((id) => orderPresets[id].title === state.preset);
      newState = { ...orderPresets[presetKey], date: state.date };
    } else {
      newState = resetPickerVals(state, orderOptions);
    }
    // Pushes to existing doc if editing, otherwise creates new doc
    if (focusedData) {
      editExisting(newState, focusedData.key, uid, domain);
    } else {
      createNew(newState, uid, domain);
    }
    cancel();
  };

  const deleteAndNavigate = () => {
    if (focusedData) {
      deleteExisting(focusedData.key, domain, uid);
    }
    cancel();
  }

  const setState = (newState) => {
    setFullState((prevState) => ({ ...prevState, ...newState }));
  };

  // May need to reinsert insets for Android (depends on how modal renders)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <CancelDoneButtons cancelOnPress={cancel} doneOnPress={submit} />
      </View>
      <KeyboardAwareFlatList
        keyboardOpeningTime={0}
        extraScrollHeight={50}
        alwaysBounceVertical={false}
        keyboardDismissMode={Layout.ios ? "interactive" : "on-drag"}
        contentContainerStyle={{ paddingBottom: inset.bottom }}
        ListFooterComponent={focusedData && <DeleteButton onPress={deleteAndNavigate} message={deleteMessage} />}
        data={orderOptions}
        renderItem={({ item }) => (
          <OrderField
            {...item}
            focusedOrder={focusedData}
            value={state[item.key]}
            setValue={(value) => setState({ [item.key]: value })}
          />
        )}
      />
    </View>
  )
};

const mapStateToProps = ({ stateConstants, orderPresets, user, domain }) => ({
  cutoffTime: stateConstants.cutoffTime,
  orderPresets,
  uid: user.uid,
  domain: domain.id
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
  }
});