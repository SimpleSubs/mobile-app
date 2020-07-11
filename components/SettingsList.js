import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

import ValidatedInput from "./ValidatedInput";
import pickerProps from "./Picker";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import InputTypes from "../constants/InputTypes";

import { closeModal, openModal, setModalProps, editUserData } from "../redux/Actions";
import { connect } from "react-redux";
import AnimatedTouchable from "./AnimatedTouchable";
import inputModalProps from "./modals/InputModal";

const SettingsTextInput = ({ inputRefs, addRef, item, index, value, setState, inputPresets, openChangePasswordModal }) => (
  <View style={styles.textInputContainer}>
    <ValidatedInput
      placeholder={item.placeholder}
      placeholderTextColor={Colors.textInputText}
      returnKeyType={inputRefs.length > index + 1 ? "next" : "go"}
      value={value}
      fixValue={inputPresets[item.textType].fixValue}
      onChangeText={(text) => setState({ [item.key]: text })}
      onSubmitEditing={() => {
        if (inputRefs[index + 1]) {
          inputRefs[index + 1].focus();
        }
      }}
      editable={item.mutable && item.textType !== "password"}
      setRef={(ref) => addRef(ref, index)}
      style={item.textType === "password" && item.mutable ? styles.passwordInput :
        (item.textType === "password" || !item.mutable) ? styles.nonEditableInput : styles.editableTextInput}
      {...inputPresets[item.textType]}
    />
    {item.textType === "password" && item.mutable ?
      <AnimatedTouchable endSize={0.8} onPress={openChangePasswordModal}>
        <Ionicons name={"md-create"} color={Colors.primaryText} size={Layout.fonts.icon} style={styles.editIcon} />
      </AnimatedTouchable> :
      null
    }
  </View>
);

const SettingsPicker = ({ item, value, setState, openModal, closeModal }) => (
  <TouchableOpacity
    style={[styles.pickerTouchable, !item.mutable && styles.nonEditableInput]}
    onPress={() => openModal(pickerProps(
      closeModal,
      value,
      (newValue) => setState({ [item.key]: newValue }),
      item.options
    ))}
    disabled={!item.mutable}
  >
    <Text style={styles.pickerTouchableText}>{value}</Text>
    <Ionicons name={"md-arrow-dropdown"} color={Colors.primaryText} size={Layout.fonts.body} />
  </TouchableOpacity>
);

const SettingsInput = ({ item, index, inputPresets, inputRefs, addRef, state, setState, openModal, closeModal,
                         openChangePasswordModal }) => {
  let value = "";
  switch (item.inputType) {
    case InputTypes.textInput:
      value = state[item.key] || "";
      return (
        <SettingsTextInput
          inputPresets={inputPresets}
          addRef={addRef}
          index={index}
          item={item}
          inputRefs={inputRefs}
          openChangePasswordModal={openChangePasswordModal}
          value={value}
          setState={setState}
        />
      );
    case InputTypes.picker:
      value = state[item.key] || item.placeholder;
      return (
        <SettingsPicker
          item={item}
          value={value}
          openModal={openModal}
          setState={setState}
          closeModal={closeModal}
        />
      );
    default:
      return null;
  }
};

const SettingsList = ({ userFields, user, inputPresets, openModal, setModalProps, closeModal, editUserData }) => {
  const [inputRefs, setInputRefs] = useState([]);

  const addRef = (newRef, index) => {
    setInputRefs((prevState) => {
      let newState = prevState;
      newState[index] = newRef;
      return newState;
    })
  }

  const changePassword = ({ oldPassword, newPassword }) => {
    closeModal();
  }

  const openChangePasswordModal = () => openModal(inputModalProps(
    "Change password",
    [
      { key: "oldPassword", inputType: InputTypes.textInput, textType: "password", placeholder: "Current password" },
      { key: "newPassword", inputType: InputTypes.textInput, textType: "newPassword", placeholder: "New password" }
    ],
    { title: "Confirm" },
    changePassword,
    setModalProps
  ));

  return (
    <KeyboardAwareFlatList
      keyboardOpeningTime={0}
      extraScrollHeight={50}
      alwaysBounceVertical={false}
      keyboardDismissMode={Layout.ios ? "interactive" : "on-drag"}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={userFields}
      extraData={user}
      renderItem={({ item, index }) => (
        <View style={styles.fieldContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <SettingsInput
            item={item}
            index={index}
            inputPresets={inputPresets}
            inputRefs={inputRefs}
            addRef={addRef}
            state={user}
            setState={editUserData}
            openModal={openModal}
            closeModal={closeModal}
            openChangePasswordModal={openChangePasswordModal}
          />
        </View>
      )}
    />
  )
};

const mapStateToProps = ({ user, stateConstants }) => ({
  inputPresets: stateConstants.inputPresets,
  userFields: stateConstants.userFields,
  user
});

const mapDispatchToProps = (dispatch) => ({
  openModal: (props) => dispatch(openModal(props)),
  setModalProps: (props) => dispatch(setModalProps(props)),
  closeModal: () => dispatch(closeModal()),
  editUserData: (data) => dispatch(editUserData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsList);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: Colors.scrollViewBackground
  },
  fieldContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flexGrow: 1
  },
  title: {
    fontFamily: "josefin-sans-bold",
    color: Colors.primaryText,
    fontSize: Layout.fonts.title,
    flex: 1,
    marginBottom: 18
  },
  pickerTouchable: {
    flex: 2,
    padding: 15,
    backgroundColor: Colors.mode === "LIGHT" ? Colors.textInputColor : Colors.backgroundColor,
    borderRadius: 10,
    marginLeft: 15,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  pickerTouchableText: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.primaryText
  },
  textInputContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  editableTextInput: {
    backgroundColor: Colors.mode === "LIGHT" ? Colors.textInputColor : Colors.backgroundColor,
    width: (Layout.window.width - 40) * 2.0 / 3
  },
  nonEditableInput: {
    backgroundColor: "transparent",
    width: (Layout.window.width - 40) * 2.0 / 3
  },
  passwordInput: {
    backgroundColor: "transparent",
    width: (Layout.window.width - 40) * 2.0 / 3 - Layout.fonts.icon - 15
  },
  editIcon: {
  }
});