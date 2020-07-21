import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { useSafeArea } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "../AnimatedTouchable";
import OrderField from "./OrderField";
import moment from "moment";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { READABLE_FORMAT } from "../../constants/Date";
import { InputTypes } from "../../constants/Inputs";

import { connect } from "react-redux";

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

const isAfterCutoff = (readableDate, cutoffTime) => {
  const date = moment(readableDate, READABLE_FORMAT);
  const now = moment();
  if (now.isAfter(cutoffTime) && date.isSameOrBefore(now)) {
    Alert.alert(
      "Invalid date",
      "The date you have selected is no longer valid. This could mean that the order cutoff has passed " +
      "since you began your order. Please try again later."
    );
    return true;
  }
  return false;
};

const isUniqueTitle = (title, key = "", orderPresets) => {
  if (key !== title && orderPresets.hasOwnProperty(title)) {
    Alert.alert(
      "Invalid title",
      "The current title is already in use. Please choose a unique title."
    );
    return false;
  }
  return true;
}

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

const CancelDoneButtons = ({ cancelOnPress, doneOnPress }) => (
  <View style={styles.cancelDoneButtonsContainer}>
    <TouchableOpacity style={styles.cancelButton} onPress={cancelOnPress}>
      {Layout.isSmallDevice ?
        <Ionicons name={"md-close"} color={Colors.secondaryText} size={Layout.fonts.icon} /> :
        <Text style={styles.cancelButtonText}>Cancel</Text>}
    </TouchableOpacity>
    <AnimatedTouchable style={styles.doneButton} endSize={0.9} onPress={doneOnPress}>
      {Layout.isSmallDevice ?
        <Ionicons name={"md-checkmark"} color={Colors.secondaryText} size={Layout.fonts.icon} /> :
        <Text style={styles.doneButtonText}>Done</Text>}
    </AnimatedTouchable>
  </View>
);

const DeleteButton = ({ onPress, message }) => (
  <TouchableOpacity style={styles.deleteButton} onPress={onPress}>
    <Text style={styles.deleteButtonText}>{message}</Text>
  </TouchableOpacity>
)

const OrderInputsList = ({ title, focusedData, orderOptions, cancel, createNew, editExisting, deleteExisting, uid,
                           cutoffTime, deleteMessage, orderPresets }) => {
  const [state, setFullState] = useState(getDefault(focusedData, orderOptions));
  const inset = useSafeArea();

  const submit = () => {
    const invalidInputs = validateState(state, orderOptions);
    if (invalidInputs.length > 0) {
      Alert.alert(
        "Fill out required fields",
        "The following fields need to be filled out before submission: " + invalidInputs.join(", ")
      );
      return;
    }
    if (state.date && isAfterCutoff(state.date, cutoffTime)) {
      cancel();
      return;
    }
    if (state.title && !isUniqueTitle(state.title, focusedData?.key, orderPresets)) {
      return;
    }
    let newState;
    if (state.preset) {
      newState = { ...orderPresets[state.preset], date: state.date };
    } else {
      newState = resetPickerVals(state, orderOptions);
    }
    if (focusedData) {
      editExisting(newState, focusedData.key, uid);
    } else {
      createNew(newState, uid);
    }
    cancel();
  };

  const deleteAndNavigate = () => {
    if (focusedData) {
      deleteExisting(focusedData.key, uid);
    }
    cancel();
  }

  const setState = (newState) => {
    setFullState((prevState) => ({ ...prevState, ...newState }));
  };

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
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

const mapStateToProps = ({ stateConstants, orderPresets, user }) => ({
  cutoffTime: stateConstants.cutoffTime,
  orderPresets,
  uid: user.uid
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