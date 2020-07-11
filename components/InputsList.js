import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import ValidatedInput from "./ValidatedInput";
import pickerProps from "./Picker";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import InputTypes from "../constants/InputTypes";

import { closeModal, openModal } from "../redux/Actions";
import { connect } from "react-redux";

const Input = ({ item, index, inputPresets, inputRefs, addRef, submit, state, setState, openModal, closeModal }) => {
  let value = "";
  switch (item.inputType) {
    case InputTypes.textInput:
      value = state[item.key] || "";
      return (
        <ValidatedInput
          placeholder={item.placeholder}
          placeholderTextColor={Colors.textInputText}
          returnKeyType={inputRefs.length > index + 1 ? "next" : "go"}
          value={value}
          fixValue={inputPresets[item.textType].fixValue}
          onChangeText={(text) => setState({ [item.key]: text })}
          onSubmitEditing={() => {
            if (inputRefs.length > index + 1) {
              if (inputRefs[index + 1]) { inputRefs[index + 1].focus() }
            } else {
              submit();
            }
          }}
          otherInputs={item.key === "confirmPassword" ? [state.password || ""] : []}
          setRef={(ref) => addRef(ref, index)}
          {...inputPresets[item.textType]}
        />
      );
    case InputTypes.picker:
      value = state[item.key] || item.placeholder;
      return (
        <TouchableOpacity style={styles.pickerTouchable} onPress={() => openModal(pickerProps(
          closeModal,
          value,
          (newValue) => setState({ [item.key]: newValue }),
          item.options
        ))}>
          <Text style={styles.pickerTouchableText}>{value}</Text>
          <Ionicons name={"md-arrow-dropdown"} color={Colors.primaryText} size={Layout.fonts.body} />
        </TouchableOpacity>
      )
    default:
      return null;
  }
};

const InputsList = ({ data, state, setInputs, inputPresets, onSubmit, openModal, closeModal, SubmitButton = () => null,
                      ListFooterComponent = () => null, ListFooterComponentStyle = {}, ...props }) => {
  const [inputRefs, setInputRefs] = useState([]);

  const setState = (newState) => {
    setInputs((prevState) => ({ ...prevState, ...newState }));
  };

  const addRef = (newRef, index) => {
    setInputRefs((prevState) => {
      let newState = prevState;
      newState[index] = newRef;
      return newState;
    })
  }

  const submit = () => {
    let valid = inputRefs.map(({ props }) => props.onEndEditing()).reduce((a, b) => a && b);
    if (valid) {
      onSubmit(state);
    }
  };

  // useFocusEffect(React.useCallback(() => () => setInputs({}), []));

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
          <SubmitButton onPress={submit} />
        </View>
      )}
      ListFooterComponentStyle={styles.footerContainer}
      renderItem={({ item, index }) => (
        <Input
          item={item}
          index={index}
          inputPresets={inputPresets}
          inputRefs={inputRefs}
          addRef={addRef}
          submit={submit}
          state={state}
          setState={setState}
          openModal={openModal}
          closeModal={closeModal}
        />
      )}
    />
  )
};

const mapStateToProps = ({ stateConstants }) => ({
  inputPresets: stateConstants.inputPresets
});

const mapDispatchToProps = (dispatch) => ({
  openModal: (props) => dispatch(openModal(props)),
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(InputsList);

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
  }
});