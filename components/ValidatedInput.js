import React, { useState, useRef, useEffect } from "react"
import {
  TextInput,
  View,
  Animated,
  StyleSheet
} from "react-native";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

export const NO_ERROR = "   ";

const isValid = (validateFunc, value, required, setError, fixValue, otherInputs = []) => {
  let fixedValue = fixValue(value);
  if (fixedValue.length === 0) {
    setError("Value must not be empty")
    return false
  }
  let valid = validateFunc(fixedValue, ...otherInputs)
  setError(valid)
  return valid === NO_ERROR;
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

const ValidatedInput = ({ setRef, validate, value, required, otherInputs = [], style = {}, errorTextStyle = {}, contentContainerStyle = {}, fixValue, ...props }) => {
  const [errorMessage, setError] = useState(NO_ERROR);
  const animated = useRef(new Animated.Value(0)).current;
  useEffect(() => textAnimation(errorMessage, animated), [errorMessage]);

  return (
    <View style={contentContainerStyle}>
      <TextInput
        {...props}
        value={value}
        ref={setRef}
        onEndEditing={() => isValid(validate, value, required, setError, fixValue, otherInputs)}
        style={[styles.textInput, style]}
      />
      <Animated.Text
        style={[styles.errorText, errorTextStyle, getTransformationStyle(animated)]}
        ellipsizeMode={"tail"}
        numberOfLines={1}
      >
        {errorMessage}
      </Animated.Text>
    </View>
  )
}

export default ValidatedInput;

const styles = StyleSheet.create({
  textInput: {
    padding: 15,
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.primaryText,
    backgroundColor: Colors.textInputColor,
    borderRadius: 10
  },
  errorText: {
    color: Colors.errorText,
    marginTop: 3,
    marginLeft: 5,
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.tiny
  },
});