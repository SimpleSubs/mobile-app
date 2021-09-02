/**
 * @file Creates touchable with an animated dropdown menu.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  NativeModules,
  LayoutAnimation
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { InputTypes } from "../../constants/Inputs";
import Layout from "../../constants/Layout";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);
// Duration of dropdown animation
const DURATION = 100;

/**
 * Generates style for dropdown icon.
 *
 * Rotates icon 90deg (left/down) on open/close.
 *
 * @param {Animated.Value} animated Animated value for rotate animation (should be timing animation).
 * @return {Object} Style object to be passed to icon component
 */
const getTransformationStyle = (animated) => {
  const interpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ["90deg", "0deg"],
  });
  return { transform: [{ rotate: interpolation }] }
};

/**
 * Toggles dropdown animation.
 *
 * Toggles layout animation for dropdown and sets animated value for rotating arrow icon.
 *
 * @param {boolean}        expanded       Whether dropdown starts expanded.
 * @param {Function}       changeExpanded Function to set expanded value.
 * @param {number}         minHeight      Minimum height for dropdown (including touchable).
 * @param {number}         maxHeight      Height of dropdown content.
 * @param {Function}       setHeight      Function to set current height of dropdown.
 * @param {Animated.Value} angleAnimated  Animated value for icon rotate animation.
 */
const toggleAnimation = (expanded, changeExpanded, minHeight, maxHeight, setHeight, angleAnimated) => {
  LayoutAnimation.spring();
  setHeight(expanded ? minHeight : minHeight + maxHeight);
  angleAnimated.setValue(expanded ? 1 : 0);
  Animated.timing(angleAnimated, {
    toValue: expanded ? 0 : 1,
    duration: DURATION,
    useNativeDriver: true
  }).start();
  changeExpanded(!expanded);
};

/**
 * Renders secondary component.
 *
 * Renders secondary component (component on the right) in dropdown touchable; is either
 * a dropdown arrow (for checkbox and text input) or text containing currently selected
 * value (for picker).
 *
 * @param {string} type             Type of input within dropdown.
 * @param {string} [selectedValue=] Currently selected value (for picker input).
 * @param {Object} [style]          Style to apply to dropdown arrow (for checkbox or text input).
 *
 * @return {null|React.ReactElement} Component to render in dropdown touchable.
 * @constructor
 */
const SecondaryTouchableText = ({ type, selectedValue, style }) => {
  switch (type) {
    case InputTypes.PICKER:
      return <Text style={styles.selectedItem} numberOfLines={1}>{selectedValue}</Text>;
    case InputTypes.TEXT_INPUT:
    case InputTypes.CHECKBOX:
      return (
        <View style={styles.arrowContainer}>
          <AnimatedIonicons
            name={"chevron-down"}
            size={Layout.fonts.title}
            color={Colors.primaryText}
            style={[styles.dropdownArrow, style]}
          />
        </View>
    );
    default:
      return null
  }
};

/**
 * Renders touchable and animated dropdown.
 *
 * Uses Animated and LayoutAnimation APIs to animate a touchable that opens/closes a
 * dropdown containing user input components.
 *
 * @param {string}             title                  Text to display on touchable.
 * @param {string}             type                   Type of input content within dropdown.
 * @param {string|number}      [selectedValue=]       Currently selected value (for picker input).
 * @param {Function}           [changeValue=() => {}] Function to change selected value (for picker input).
 * @param {string[]}           [options=[]]           Options for selected value (for picker input).
 * @param {React.ReactElement} children               Element to be rendered as content of dropdown.
 *
 * @return {React.ReactElement} Dropdown element.
 * @constructor
 */
const AnimatedDropdown = ({ title, type, selectedValue = "", changeValue = () => {}, options = [], children }) => {
  const [expanded, changeExpanded] = useState(false);
  const [minHeight, setMinHeight] = useState(57.5);
  const [maxHeight, setMaxHeight] = useState(minHeight);
  const [height, setHeight] = useState();
  const angleAnimated = useRef(new Animated.Value(0)).current;

  const onPressTouchable = () => {
    if (type === InputTypes.PICKER && options.length > 0 && !options.includes(selectedValue)) {
      changeValue(options[0]);
    }
    toggleAnimation(expanded, changeExpanded, minHeight, maxHeight, setHeight, angleAnimated);
  };

  return (
    <View style={[styles.container, height ? { height } : {}]}>
      <TouchableOpacity
        style={styles.touchable}
        onLayout={({ nativeEvent }) => {
          setMinHeight(nativeEvent.layout.height);
          setHeight(nativeEvent.layout.height);
        }}
        onPress={onPressTouchable}
      >
        <Text style={styles.touchableText}>{title}</Text>
        <SecondaryTouchableText
          type={type}
          selectedValue={selectedValue}
          style={getTransformationStyle(angleAnimated)}
        />
      </TouchableOpacity>
      <View
        style={styles.body}
        onLayout={({ nativeEvent }) => setMaxHeight(nativeEvent.layout.height)}
      >
        {children}
      </View>
    </View>
  )
};

export default AnimatedDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    overflow: "hidden"
  },
  touchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20
  },
  touchableText: {
    fontSize: Layout.fonts.title,
    fontFamily: "josefin-sans",
    color: Colors.primaryText,
    flex: 1
  },
  selectedItem: {
    fontSize: Layout.fonts.title,
    fontFamily: "josefin-sans",
    color: Colors.secondaryText,
    textAlign: "right"
  },
  dropdownArrow: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 3
  },
  arrowContainer: {
    paddingLeft: 20
  }
});