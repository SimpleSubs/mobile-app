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
const DURATION = 100;

const getTransformationStyle = (animated) => {
  const interpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ["90deg", "0deg"],
  });
  return { transform: [{ rotate: interpolation }] }
};

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

const SecondaryTouchableText = ({ type, selectedValue, style }) => {
  switch (type) {
    case InputTypes.PICKER:
      return <Text style={styles.selectedItem} numberOfLines={1}>{selectedValue}</Text>;
    case InputTypes.TEXT_INPUT:
    case InputTypes.CHECKBOX:
      return (
        <AnimatedIonicons
          name={"ios-arrow-down"}
          size={Layout.fonts.title}
          color={Colors.primaryText}
          style={[styles.dropdownArrow, style]}
        />
    );
    default:
      return null
  }
};

const AnimatedDropdown = ({ title, type, selectedValue = "", changeValue = () => {}, options = [], children }) => {
  const [expanded, changeExpanded] = useState(false);
  const [minHeight, setMinHeight] = useState(57.5);
  const [maxHeight, setMaxHeight] = useState(minHeight);
  const [height, setHeight] = useState(minHeight);
  const angleAnimated = useRef(new Animated.Value(0)).current;

  const onPressTouchable = () => {
    if (type === InputTypes.PICKER && options.length > 0 && !options.includes(selectedValue)) {
      changeValue(options[0]);
    }
    toggleAnimation(expanded, changeExpanded, minHeight, maxHeight, setHeight, angleAnimated);
  };

  return (
    <View style={[styles.container, { height: height }]}>
      <TouchableOpacity
        style={styles.touchable}
        onLayout={({ nativeEvent }) => setMinHeight(nativeEvent.layout.height)}
        onPress={onPressTouchable}
      >
        <Text style={styles.touchableText}>{title}</Text>
        <SecondaryTouchableText type={type} selectedValue={selectedValue} style={getTransformationStyle(angleAnimated)} />
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
    flex: 1,
    textAlign: "right"
  },
  dropdownArrow: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 3
  }
});