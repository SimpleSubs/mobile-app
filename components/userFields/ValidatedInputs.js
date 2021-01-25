/**
 * @file Creates a validated input (displays an error message if invalid) for user inputs list.
 * @author Emily Sturman <emily@sturman.org>
 */
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
import { openModal, closeModal } from "../../redux/Actions";

/**
 * Validates contents of text input.
 *
 * Ensures that value is not empty, then checks value with input's
 * custom validation function (e.g., could ensure text is a valid
 * email address). As a side effect, the function also sets the
 * error message of the input (or clears it if there is no error).
 *
 * @param {function(string,...string):string} validateFunc      Function to validate input contents; returns error message or NO_ERROR string.
 * @param {string}                             value            Text value in text input.
 * @param {function(string)}                   setError         Function that sets error message for text input.
 * @param {function(string):string}            fixValue         Adjusts text value before validating and passing to state (e.g. trims whitespace).
 * @param {string[]}                           [otherInputs=[]] Other inputs to consider while validating (e.g. comparing confirm password to password field).
 * @param {boolean}                            required         Whether input field is required.
 *
 * @return {boolean} Whether text is valid for submission.
 */
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

/**
 * Validates contents of picker input.
 *
 * Ensures that a value has been selected (i.e. value is not placeholder
 * like "Please select"). If nothing has been selected, the function also
 * updates the picker's error message (or clears it, if selection is valid).
 *
 * @param {string}           value    Selected value in picker.
 * @param {string[]}         options  All options for picker.
 * @param {function(string)} setError Function that sets error message for text input.
 * @param {boolean}          required Whether picker field is required.
 *
 * @return {boolean} Whether picker value is valid for submission.
 */
const isValidPicker = (value, options, setError, required) => {
  const valid = options.includes(value);
  if (required && !valid) {
    setError("Please select a value");
  } else {
    setError(NO_ERROR);
  }
  return valid;
}

/**
 * Gets animation style for error message.
 *
 * Adjusts opacity of error text based on provided animated value.
 *
 * @param {Animated.Value} animated Animated value for opacity animation (should be timing animated).
 * @return {Object} Style object to apply to text.
 */
const getTransformationStyle = (animated) => ({ opacity: animated });

/**
 * Toggles animation for error text.
 *
 * Fades out message if it is set to NO_ERROR, otherwise fades in message.
 *
 * @param {string}           errorMessage      Error message to be displayed
 * @param {Animated.Value}   animated          Animated value for opacity animation.
 * @param {function(string)} setDisplayedError Function to set displayed error message after hiding/before showing.
 * @param {React.Ref}        prevError         Ref containing previous error (or nothing, if page is first loading).
 */
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

/**
 * Renders container for input.
 *
 * Returns view containing provided input with an animated error message below it.
 *
 * @param {string}             error                      Message to display in error text (NO_ERROR const for no error).
 * @param {Object}             [textStyle={}]             Style to apply to error text.
 * @param {Object}             [contentContainerStyle={}] Style to apply to container.
 * @param {React.ReactElement} children                   Input to render within container.
 *
 * @return {React.ReactElement} View containing input and error message.
 * @constructor
 */
const InputContainer = ({ error, textStyle = {}, contentContainerStyle = {}, children }) => {
  const [displayedError, setDisplayedError] = useState(error);
  const prevError = useRef();
  const animated = useRef(new Animated.Value(0)).current;
  useEffect(() => textAnimation(error, animated, setDisplayedError, prevError), [error]);
  return (
    <View style={contentContainerStyle}>
      {children}
      <Animated.Text
        style={[styles.errorText, textStyle, getTransformationStyle(animated)]}
        ellipsizeMode={"tail"}
        numberOfLines={1}
      >
        {displayedError}
      </Animated.Text>
    </View>
  )
}

/**
 * Renders a text input with validation.
 *
 * Returns a view containing a text input and an animated error message (for
 * when input content is invalid).
 *
 * @param {function}                    setRef                  Assigns text input ref to array of refs in parent element (for jumping to next input).
 * @param {function(string, ...string)} validate                Function to validate input contents; returns error message or NO_ERROR string.
 * @param {string}                      value                   Current value in text input.
 * @param {string[]}                    [otherInputs=[]]        Other inputs to be referenced in validation.
 * @param {Object}                      [style={}]              Style object to apply to text input.
 * @param {Object}                      errorTextStyle          Style object o apply to error text.
 * @param {function(string):string}     fixValue                Adjusts text value before validating and passing to state (e.g. trims whitespace).
 * @param {Object}                      [contentContainerStyle] Style object to apply to input container.
 * @param {boolean}                     required                Whether input is required/must have a value.
 * @param {Object}                      props                   Any other properties to pass to text input.
 *
 * @return {React.ReactElement} View containing text input and error message.
 * @constructor
 */
export const ValidatedTextInput = ({ setRef, validate, value, otherInputs = [], style = {}, errorTextStyle, fixValue, contentContainerStyle, required, ...props }) => {
  const [errorMessage, setError] = useState(NO_ERROR);
  return (
    <InputContainer contentContainerStyle={contentContainerStyle} error={errorMessage} textStyle={errorTextStyle}>
      <TextInput
        {...props}
        value={value}
        ref={(ref) => setRef(ref, (val) => isValidText(validate, val, setError, fixValue, otherInputs, required))}
        onEndEditing={() => isValidText(validate, value, setError, fixValue, otherInputs, required)}
        style={[styles.input, styles.inputText, style]}
      />
    </InputContainer>
  );
};

/**
 * Renders a picker touchable with validation.
 *
 * Returns a view containing a touchable that opens a picker
 * and an animated error message (for when input content is invalid).
 *
 * @param {function}         setRef                  Assigns text input ref to array of refs in parent element (for jumping to next input).
 * @param {string}           value                   Value currently selected in picker.
 * @param {function(string)} onValueChange           Function that sets selected value for picker.
 * @param {string[]}         options                 All picker options.
 * @param {Object}           [style={}]              Style object to apply to text input.
 * @param {Object}           [contentContainerStyle] Style object to apply to input container.
 * @param {Object}           errorTextStyle          Style object o apply to error text.
 * @param {function(Object)} openModal               Opens top-level modal.
 * @param {function()}       closeModal              Closes top-level modal.
 * @param {boolean}          required
 * @param {Object}           props                   Any other properties to pass to picker touchable.
 *
 * @return {React.ReactElement} View containing picker and error message.
 * @constructor
 */
const ValidatedPickerComponent = ({ setRef, value, onValueChange, options, style = {}, contentContainerStyle, errorTextStyle, openModal, closeModal, required, ...props }) => {
  const [errorMessage, setError] = useState(NO_ERROR);
  const prevValueRef = useRef();

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
    <InputContainer contentContainerStyle={contentContainerStyle} error={errorMessage} textStyle={errorTextStyle}>
      <TouchableOpacity
        {...props}
        style={[styles.input, styles.pickerTouchable, style]}
        onPress={() => openModal(getPickerProps(myPicker))}
        ref={(ref) => setRef(ref, (val) => isValidPicker(val, options, setError, required))}
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