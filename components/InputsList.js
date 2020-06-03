import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

import ValidatedInput from "./ValidatedInput";

import Layout from "../constants/Layout";
import { RegisterUserFields, TYPE_MAPS } from "../constants/UserFields";
import Colors from "../constants/Colors";

const InputsList = ({ data, state, setInputs, ListHeaderComponent, ListFooterComponent, onSubmit, style, contentContainerStyle }) => {
  const [inputRefs, setInputRefs] = useState([])
  const setState = (newState) => {
    setInputs((prevState) => ({ ...prevState, ...newState }));
  }
  const addRef = (newRef, index) => {
    setInputRefs((prevState) => {
      let newState = prevState;
      newState[index] = newRef;
      return newState;
    })
  }
  const submit = () => {
    let valid = inputRefs.map(({ props }) => props.onEndEditing()).reduce((a, b) => a && b)
    if (valid) {
      onSubmit(state)
    }
  }

  return (
    <KeyboardAwareFlatList
      keyboardOpeningTime={0}
      extraScrollHeight={50}
      scrollEnabled={false}
      keyboardDismissMode={Layout.ios ? "interactive" : "on-drag"}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      style={style}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      data={data}
      extraData={state}
      renderItem={({ item, index }) => (
        <ValidatedInput
          placeholder={item.placeholder}
          placeholderTextColor={Colors.textInputText}
          returnKeyType={inputRefs.length > index + 1 ? "next" : "go"}
          value={state[item.key] || ""}
          fixValue={TYPE_MAPS[item.type].fixValue}
          onChangeText={(text) => setState({ [item.key]: text })}
          onSubmitEditing={() => inputRefs.length > index + 1 ? inputRefs[index + 1].focus() : submit()}
          otherInputs={item.key === "confirmPassword" ? [state.password || ""] : []}
          contentContainerStyle={styles.inputContainer}
          setRef={(ref) => addRef(ref, index)}
          {...TYPE_MAPS[item.type]}
        />
      )}
    />
  )
}

export default InputsList;

const styles = StyleSheet.create({
  contentContainer: {
    flexShrink: 1,
    alignItems: "stretch",
    paddingHorizontal: 50
  }
});