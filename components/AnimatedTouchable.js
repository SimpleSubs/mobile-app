import React, { useRef } from "react";
import {
  TouchableOpacity,
  Animated
} from "react-native";

const getScaleTransformationStyle = (animated, endSize, transform = []) => {
  const interpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [1, endSize],
  });
  let transformNew = transform;
  transformNew.push({ scale: interpolation });
  return {
    transform: transformNew
  }
};

const pressInAnimation = (animated) => {
  animated.setValue(0);
  Animated.spring(animated, {
    toValue: 1,
    tension: 100,
    useNativeDriver: true,
  }).start();
};

const pressOutAnimation = (animated) => {
  animated.setValue(1);
  Animated.spring(animated, {
    toValue: 0,
    tension: 100,
    useNativeDriver: true,
  }).start();
};

const AnimatedTouchable = ({ children, style = {}, endOpacity = 0.8, endSize = 0.95, onPress }) => {
  const animated = useRef(new Animated.Value(0)).current;
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => pressInAnimation(animated)}
      onPressOut={() => pressOutAnimation(animated)}
      style={[style, getScaleTransformationStyle(animated, endSize, style.transform || [])]}
      activeOpacity={endOpacity}
    >
      {children}
    </TouchableOpacity>
  )
};

export default AnimatedTouchable;