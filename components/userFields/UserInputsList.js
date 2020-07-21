import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Keyboard
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

import { ValidatedPicker, ValidatedTextInput } from "./ValidatedInputs";
import AnimatedTouchable from "../AnimatedTouchable";

import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";
import { TextTypes, InputPresets, InputTypes } from "../../constants/Inputs";
import { EditActions, openChangePasswordModal } from "../../constants/DataActions";

import { closeModal, openModal, setModalProps, changePassword } from "../../redux/Actions";
import { connect } from "react-redux";

const PASSWORD_PLACEHOLDER = "********";

const EditButton = ({ editAction, openModal, closeModal, setModalProps, changePassword }) => {
  let action;
  switch (editAction) {
    case (EditActions.CHANGE_PASSWORD):
      const changePasswordAndClose = ({ oldPassword, newPassword }) => {
        closeModal();
        changePassword(oldPassword, newPassword);
      }
      action = () => openChangePasswordModal(openModal, setModalProps, changePasswordAndClose);
      break;
    default:
      return null;
  }
  return (
    <AnimatedTouchable endSize={0.8} onPress={action}>
      <Ionicons name={"md-create"} color={Colors.primaryText} size={Layout.fonts.icon} style={styles.editIcon}/>
    </AnimatedTouchable>
  )
}

const CustomTextInput = ({ editing, value = "", item, inputRefs, addRef, submit, index, state, setState, openModal,
                           closeModal, setModalProps, changePassword }) => {
  const thisInput = (
    <ValidatedTextInput
      placeholder={item.placeholder}
      placeholderTextColor={Colors.textInputText}
      returnKeyType={inputRefs.length > index + 1 ? "next" : "go"}
      value={editing && item.textType === TextTypes.PASSWORD ? PASSWORD_PLACEHOLDER : value}
      fixValue={InputPresets[item.textType].fixValue}
      onChangeText={(text) => setState({ [item.key]: text })}
      onSubmitEditing={() => {
        if (inputRefs.length > index + 1) {
          if (inputRefs[index + 1].focus) { inputRefs[index + 1].focus() }
        } else {
          submit();
        }
      }}
      editable={editing && item.mutable && item.textType !== TextTypes.PASSWORD}
      otherInputs={item.key === "confirmPassword" ? [state.password || ""] : []}
      setRef={(ref) => addRef(ref, index)}
      contentContainerStyle={editing && styles.inputContentContainer}
      style={editing && (
        item.editAction || !item.mutable
          ? styles.nonEditableInput
          : styles.editableTextInput
      )}
      {...InputPresets[item.textType]}
    />
  );
  return (
    editing ? (
      <View style={styles.fieldContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.textInputButtonContainer}>
          {thisInput}
          <EditButton
            editAction={item.editAction}
            openModal={openModal}
            closeModal={closeModal}
            setModalProps={setModalProps}
            changePassword={changePassword}
          />
        </View>
      </View>
    ) : thisInput
  );
}

const CustomPickerTouchable = ({ editing, value, item, setState, addRef, index }) => {
  const thisPicker = (
    <ValidatedPicker
      setRef={(ref) => addRef(ref, index)}
      value={value}
      onValueChange={(value) => setState({ [item.key]: value })}
      options={item.options}
      style={editing && !item.mutable
        ? { ...styles.editableTextInput, ...styles.nonEditableInput }
        : (editing ? styles.editableTextInput : {})
      }
      contentContainerStyle={editing && styles.inputContentContainer}
      disabled={editing && !item.mutable}
    />
  );

  return (
    editing ? (
      <View style={styles.fieldContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.textInputButtonContainer}>{thisPicker}</View>
      </View>
    ) : thisPicker
  );
}

const Input = ({ editing, item, index, inputRefs, addRef, submit, state, setState, openModal, closeModal, setModalProps,
                 changePassword }) => {
  switch (item.inputType) {
    case InputTypes.TEXT_INPUT:
      return (
        <CustomTextInput
          editing={editing}
          value={state[item.key]}
          item={item}
          inputRefs={inputRefs}
          addRef={addRef}
          submit={submit}
          index={index}
          state={state}
          setState={setState}
          openModal={openModal}
          closeModal={closeModal}
          setModalProps={setModalProps}
          changePassword={changePassword}
        />
      );
    case InputTypes.PICKER:
      return (
        <CustomPickerTouchable
          editing={editing}
          value={state[item.key] || item.placeholder}
          item={item}
          setState={setState}
          addRef={addRef}
          index={index}
        />
      );
    default:
      return null;
  }
};

const UserInputsList = ({ data, state, setInputs, onSubmit, openModal, closeModal, setModalProps, editing, changePassword,
                      loading, SubmitButton = () => null, ListFooterComponent = () => null,
                      ListFooterComponentStyle = {}, ...props }) => {
  const [inputRefs, setInputRefs] = useState([]);

  const setState = (newState) => setInputs((prevState) => ({ ...prevState, ...newState }));

  const addRef = (newRef, index) => {
    setInputRefs((prevState) => {
      let newState = prevState;
      newState[index] = newRef;
      return newState;
    })
  };

  const submit = () => {
    let valid = inputRefs.map(({ props }, index) => {
      const field = data[index];
      switch (field.inputType) {
        case InputTypes.TEXT_INPUT:
          return props.onEndEditing();
        case InputTypes.PICKER:
          return props.onLongPress();
        default:
          return true;
      }
    }).reduce((a, b) => a && b);
    if (valid) {
      Keyboard.dismiss();
      onSubmit(state);
    }
  };

  return (
    <KeyboardAwareFlatList
      {...props}
      keyboardOpeningTime={0}
      extraScrollHeight={50}
      alwaysBounceVertical={false}
      keyboardDismissMode={Layout.ios ? "interactive" : "on-drag"}
      contentContainerStyle={[styles.contentContainer, props.contentContainerStyle || {}]}
      data={data}
      extraData={state}
      ListFooterComponent={() => (
        <View style={[styles.footer, ListFooterComponentStyle]}>
          <ListFooterComponent />
          <SubmitButton onPress={submit} loading={loading} />
        </View>
      )}
      ListFooterComponentStyle={styles.footerContainer}
      renderItem={({ item, index }) => (
        <Input
          editing={editing}
          item={item}
          index={index}
          inputRefs={inputRefs}
          addRef={addRef}
          submit={submit}
          state={state}
          setState={setState}
          openModal={openModal}
          closeModal={closeModal}
          setModalProps={setModalProps}
          changePassword={changePassword}
        />
      )}
    />
  )
};

const mapStateToProps = ({ loading }) => ({
  loading
})

const mapDispatchToProps = (dispatch) => ({
  openModal: (props) => dispatch(openModal(props)),
  closeModal: () => dispatch(closeModal()),
  setModalProps: (props) => dispatch(setModalProps(props)),
  changePassword: (oldPassword, newPassword) => changePassword(dispatch, oldPassword, newPassword)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInputsList);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "stretch",
    paddingHorizontal: 50
  },
  pickerTouchable: {
    padding: 15,
    backgroundColor: Colors.textInputColor,
    borderRadius: 10,
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
  footerContainer: {
    flexGrow: 1
  },
  footer: {
    alignItems: "stretch",
    justifyContent: "space-between",
    flexGrow: 1
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
  textInputButtonContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  inputContentContainer: {
    flex: 1
  },
  editableTextInput: {
    backgroundColor: Colors.mode === "LIGHT" ? Colors.textInputColor : Colors.backgroundColor
  },
  nonEditableInput: {
    backgroundColor: "transparent"
  }
});