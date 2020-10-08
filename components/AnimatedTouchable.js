/**
 * @file Creates custom animated button.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useRef } from "react";
import {
  TouchableOpacity,
  Animated
} from "react-native";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

/**
 * Gets transformation style for touchable spring animation.
 *
 * Interpolates a spring animated value for the scale animation
 * on the animated touchable.
 *
 * @param {Animated.Value} animated       Animated value to interpolate for scale animation (should be spring animation).
 * @param {number}         endSize        Size of pressed-in button (1 being no change).
 * @param {Object[]}       [transform=[]] Transform style prop for button.
 *
 * @return {Object} Style object to pass to button.
 */
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
 *
 * Triggers spring animation in/pressed value when user presses button in;
 * triggers spring animation out/unpressed value when user releases button.
 *
 * @param {Animated.Value} animated Animated value to interpolate for scale animation.
 * @param {number}         toValue  Value to animate to; 1 if pressed, 0 if not.
 */
const pressAnimation = (animated, toValue) => {
  animated.setValue(toValue === 1 ? 0 : 1);
  Animated.spring(animated, {
    toValue,
    tension: 100,
    useNativeDriver: true
  }).start();
};

// TODO: add animation for cancel press
/**
 * Renders touchable with custom animation.
 *
 * Renders button that springs to a different size and fades out slightly
 * when pressed by the user.
 *
 * @param {React.ReactElement} children         Button to be animated.
 * @param {Object}        [style={}]       Style object to be passed to button container
 * @param {number}        [endOpacity=0.8] Opacity of button when pressed.
 * @param {number}        [endSize=0.95]   Size of button when pressed (1 being default size of button).
 * @param {function()}    onPress          Action to execute when button is pressed.
 *
 * @return {React.ReactElement} Animated button.
 * @constructor
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