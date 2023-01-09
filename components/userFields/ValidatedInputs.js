import React from "react"
import {
  TextInput,
  View,
  Animated,
  Text,
  TouchableOpacity
} from "react-native";
import uuid from 'react-native-uuid';
import { getPickerProps } from "../Picker";
import { Ionicons } from "@expo/vector-icons";
import Layout from "../../constants/Layout";
import createStyleSheet, { getColors }  from "../../constants/Colors";
import { NO_ERROR } from "../../constants/Inputs";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../redux/features/display/modalSlice";
import { setKey } from "../../redux/features/display/modalOperationsSlice";

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

const InputContainer = ({ error, textStyle = {}, contentContainerStyle = {}, children }) => {
  const [displayedError, setDisplayedError] = React.useState(error);
  const prevError = React.useRef();
  const animated = React.useRef(new Animated.Value(0)).current;
  const themedStyles = createStyleSheet(styles);

  React.useEffect(() => textAnimation(error, animated, setDisplayedError, prevError), [error]);
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
  const [errorMessage, setError] = React.useState(NO_ERROR);
  const themedStyles = createStyleSheet(styles);
  return (
    <InputContainer contentContainerStyle={contentContainerStyle} error={errorMessage} textStyle={errorTextStyle}>
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
export const ValidatedPicker = ({ setRef, value, onValueChange, options, style = {}, contentContainerStyle, errorTextStyle, required, ...props }) => {
  const { key, returnValue } = useSelector(({ modalOperations }) => modalOperations);
  const dispatch = useDispatch();

  const [errorMessage, setError] = React.useState(NO_ERROR);
  const [modalId, setModalId] = React.useState();
  const prevValueRef = React.useRef();
  const themedStyles = createStyleSheet(styles);

  const openPicker = () => {
    dispatch(setKey(modalId));
    dispatch(openModal(getPickerProps({ selectedValue: value, options })));
  };

  React.useEffect(() => {
    if (key === modalId && returnValue) {
      onValueChange(returnValue);
    }
  }, [returnValue]);

  React.useEffect(() => {
    if (prevValueRef.current) {
      isValidPicker(value, options, setError, required);
    }
    prevValueRef.current = value;
  }, [value]);

  React.useEffect(() => {
    setModalId(uuid.v4());
  }, []);

  return (
    <InputContainer contentContainerStyle={contentContainerStyle} error={errorMessage} textStyle={errorTextStyle}>
      <TouchableOpacity
        {...props}
        style={[themedStyles.input, themedStyles.pickerTouchable, style]}
        onPress={openPicker}
        ref={(ref) => setRef(ref, (val) => isValidPicker(val, options, setError, required))}
      >
        <Text style={themedStyles.inputText}>{value}</Text>
        <Ionicons name={"chevron-down"} color={getColors().primaryText} size={Layout.fonts.body}/>
      </TouchableOpacity>
    </InputContainer>
  )
};

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