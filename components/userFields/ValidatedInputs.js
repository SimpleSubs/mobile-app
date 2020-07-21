import React, { useState, useRef, useEffect } from "react"
import {
  TextInput,
  View,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import Picker, { getPickerProps } from "../Picker";
import { Ionicons } from "@expo/vector-icons";

import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";
import { NO_ERROR } from "../../constants/Inputs";

import { connect } from "react-redux";
import { openModal, closeModal, setModalProps } from "../../redux/Actions";

const isValidText = (validateFunc, value, setError, fixValue, otherInputs = []) => {
  let fixedValue = fixValue(value);
  if (fixedValue.length === 0) {
    setError("Value must not be empty")
    return false
  }
  let errorMsg = validateFunc(fixedValue, ...otherInputs)
  setError(errorMsg)
  return errorMsg === NO_ERROR;
}

const isValidPicker = (value, options, setError) => {
  const valid = options.includes(value);
  if (!valid) {
    setError("Please select a value");
  } else {
    setError(NO_ERROR);
  }
  return valid;
}

const getTransformationStyle = (animated) => ({ opacity: animated });

const textAnimation = (errorMessage, animated) => {
  animated.setValue(errorMessage.length === 0 ? 1 : 0);
  Animated.timing(animated, {
    duration: 250,
    toValue: errorMessage.length === 0 ? 0 : 1,
    useNativeDriver: true
  }).start();
}

const InputContainer = ({ error, textStyle = {}, contentContainerStyle = {}, children }) => {
  const animated = useRef(new Animated.Value(0)).current;
  useEffect(() => textAnimation(error, animated), [error]);
  return (
    <View style={contentContainerStyle}>
      {children}
      <Animated.Text
        style={[styles.errorText, textStyle, getTransformationStyle(animated)]}
        ellipsizeMode={"tail"}
        numberOfLines={1}
      >
        {error}
      </Animated.Text>
    </View>
  )
}

export const ValidatedTextInput = ({ setRef, validate, value, otherInputs = [], style = {}, errorTextStyle, fixValue,
                                     contentContainerStyle, ...props }) => {
  const [errorMessage, setError] = useState(NO_ERROR);
  return (
    <InputContainer contentContainerStyle={contentContainerStyle} error={errorMessage} textStyle={errorTextStyle}>
      <TextInput
        {...props}
        value={value}
        ref={setRef}
        onEndEditing={() => isValidText(validate, value, setError, fixValue, otherInputs)}
        style={[styles.input, styles.inputText, style]}
      />
    </InputContainer>
  );
};

const ValidatedPickerComponent = ({ setRef, value, onValueChange, options, style = {}, contentContainerStyle,
                                    errorTextStyle, openModal, closeModal, ...props }) => {
  const [errorMessage, setError] = useState(NO_ERROR);
  const prevValueRef = useRef();

  const myPicker = (
    <Picker closeModal={closeModal} selectedValue={value} onValueChange={onValueChange} options={options} />
  );

  useEffect(() => {
    if (prevValueRef.current) {
      isValidPicker(value, options, setError);
    }
    prevValueRef.current = value;
  }, [value]);

  return (
    <InputContainer contentContainerStyle={contentContainerStyle} error={errorMessage} textStyle={errorTextStyle}>
      <TouchableOpacity
        {...props}
        style={[styles.input, styles.pickerTouchable, style]}
        onLongPress={() => isValidPicker(value, options, setError)}
        onPress={() => openModal(getPickerProps(myPicker))}
        ref={setRef}
      >
        <Text style={styles.inputText}>{value}</Text>
        <Ionicons name={"md-arrow-dropdown"} color={Colors.primaryText} size={Layout.fonts.body}/>
      </TouchableOpacity>
    </InputContainer>
  )
}

const mapDispatchToProps = (dispatch) => ({
  openModal: (props) => dispatch(openModal(props)),
  closeModal: () => dispatch(closeModal())
});

export const ValidatedPicker = connect(null, mapDispatchToProps)(ValidatedPickerComponent);

const styles = StyleSheet.create({
  input: {
    padding: 15,
    backgroundColor: Colors.textInputColor,
    borderRadius: 10
  },
  inputText: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.primaryText
  },
  pickerTouchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  errorText: {
    color: Colors.errorText,
    marginTop: 3,
    marginLeft: 5,
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.tiny
  }
});