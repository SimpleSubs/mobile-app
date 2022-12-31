import React, { useRef } from "react";
import {
  TouchableOpacity,
  Animated
} from "react-native";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const getScaleTransformationStyle = (animated, endSize, transform = []) => {
  const interpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [1, endSize],
  });
  let transformNew = transform;
  transformNew.push({ scale: interpolation });
  return { transform: transformNew }
};

/**
 * Triggers animation when button is pressed in/out.
 */
const pressAnimation = (animated, toValue) => {
  animated.setValue(toValue === 1 ? 0 : 1);
  Animated.spring(animated, {
    toValue,
    tension: 100,
    useNativeDriver: true
  }).start();
};

/**
 * Touchable with custom scaling animation
 */
const AnimatedTouchable = ({ children, style = {}, endOpacity = 0.8, endSize = 0.95, onPress }) => {
  const animated = useRef(new Animated.Value(0)).current;
  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onPressIn={() => pressAnimation(animated, 1)}
      onPressOut={() => pressAnimation(animated, 0)}
      style={[style, getScaleTransformationStyle(animated, endSize, style.transform)]}
      activeOpacity={endOpacity}
    >
      {children}
    </AnimatedTouchableOpacity>
  )
};

export default AnimatedTouchable;