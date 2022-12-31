import React, { useState, useRef, useEffect } from "react"
import {
  TextInput,
  View,
  Animated,
  Text,
  TouchableOpacity
} from "react-native";
import Picker, { getPickerProps } from "../Picker";
import { Ionicons } from "@expo/vector-icons";
import Layout from "../../constants/Layout";
import createStyleSheet, { getColors }  from "../../constants/Colors";
import { NO_ERROR } from "../../constants/Inputs";
import { connect } from "react-redux";
import { openModal, closeModal } from "../../redux/Actions";

const isValidText = (validateFunc, value, setError, fixValue, otherInputs = [], required) => {
  let fixedValue = fixValue(value);
  if (required && fixedValue.length === 0) {
    setError("Value must not be empty");
    return false;
  }
  let errorMsg = validateFunc(fixedValue, ...otherInputs);
  setError(errorMsg);
  return errorMsg === NO_ERROR;
}

const isValidPicker = (value, options, setError, required) => {
  const valid = !required || options.includes(value);
  setError(valid ? NO_ERROR : "Please select a value");
  return valid;
}


const getTransformationStyle = (animated) => ({ opacity: animated });

const textAnimation = (errorMessage, animated, setDisplayedError, prevError) => {
  if (!prevError.current) {
    prevError.current = errorMessage;
    return;
}
  let hiding = errorMessage === NO_ERROR;
  animated.setValue(hiding ? 1 : 0);
  if (!hiding) {
    setDisplayedError(errorMessage);
  }
  Animated.timing(animated, {
    duration: 250,
    toValue: hiding ? 0 : 1,
    useNativeDriver: true
  }).start(() => {
    if (hiding) {
      setDisplayedError(errorMessage);
    }
  });
}

const InputContainer = ({ error, textStyle = {}, contentContainerStyle = {}, children, themedStyles }) => {
  const [displayedError, setDisplayedError] = useState(error);
  const prevError = useRef();
  const animated = useRef(new Animated.Value(0)).current;
  useEffect(() => textAnimation(error, animated, setDisplayedError, prevError), [error]);
  return (
    <View style={contentContainerStyle}>
      {children}
      <Animated.Text
        style={[themedStyles.errorText, textStyle, getTransformationStyle(animated)]}
        ellipsizeMode={"tail"}
        numberOfLines={1}
      >
        {displayedError}
      </Animated.Text>
    </View>
  )
}

/**
 * Text input with validation
 */
export const ValidatedTextInput = ({ setRef, validate, value, otherInputs = [], style = {}, errorTextStyle, fixValue, contentContainerStyle, required, ...props }) => {
  const [errorMessage, setError] = useState(NO_ERROR);
  const themedStyles = createStyleSheet(styles);
  return (
    <InputContainer contentContainerStyle={contentContainerStyle} error={errorMessage} textStyle={errorTextStyle} themedStyles={themedStyles}>
      <TextInput
        {...props}
        value={value}
        ref={(ref) => setRef(ref, (val) => isValidText(validate, val, setError, fixValue, otherInputs, required))}
        onEndEditing={() => isValidText(validate, value, setError, fixValue, otherInputs, required)}
        style={[themedStyles.input, themedStyles.inputText, style]}
      />
    </InputContainer>
  );
};

/**
 * Picker touchable with validation
 */
const ValidatedPickerComponent = ({ setRef, value, onValueChange, options, style = {}, contentContainerStyle, errorTextStyle, openModal, closeModal, required, ...props }) => {
  const [errorMessage, setError] = useState(NO_ERROR);
  const prevValueRef = useRef();
  const themedStyles = createStyleSheet(styles);

  const myPicker = (
    <Picker closeModal={closeModal} selectedValue={value} onValueChange={onValueChange} options={options} />
  );

  useEffect(() => {
    if (prevValueRef.current) {
      isValidPicker(value, options, setError, required);
    }
    prevValueRef.current = value;
  }, [value]);

  return (
    <InputContainer contentContainerStyle={contentContainerStyle} error={errorMessage} textStyle={errorTextStyle} themedStyles={themedStyles}>
      <TouchableOpacity
        {...props}
        style={[themedStyles.input, themedStyles.pickerTouchable, style]}
        onPress={() => openModal(getPickerProps(myPicker))}
        ref={(ref) => setRef(ref, (val) => isValidPicker(val, options, setError, required))}
      >
        <Text style={themedStyles.inputText}>{value}</Text>
        <Ionicons name={"chevron-down"} color={getColors().primaryText} size={Layout.fonts.body}/>
      </TouchableOpacity>
    </InputContainer>
  )
}

const mapDispatchToProps = (dispatch) => ({
  openModal: (props) => dispatch(openModal(props)),
  closeModal: () => dispatch(closeModal())
});

export const ValidatedPicker = connect(null, mapDispatchToProps)(ValidatedPickerComponent);

const styles = (Colors) => ({
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