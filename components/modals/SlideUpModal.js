import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from "react-native";
import Layout from "../../constants/Layout";

const getModalStyle = (animated) => {
  const positionInterpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [-Layout.window.height, 0]
  });
  return { transform: [{ translateY: positionInterpolation }] }
};

const getBackgroundStyle = (animated) => {
  const opacityInterpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.4)"]
  });
  return { backgroundColor: opacityInterpolation }
};

const toggleAnimation = (open, animated) => {
  animated.setValue(open ? 0 : 1);
  Animated.timing(animated, {
    duration: 100,
    toValue: open ? 1 : 0
  }).start();
};

// props: { children, closeModal, style }
const SlideUpModal = (props) => {
  const animated = useRef(new Animated.Value(0)).current;
  const open = !!props;

  useEffect(() => toggleAnimation(open, animated) [open]);

  return (
    <TouchableWithoutFeedback onPress={props.closeModal}>
      <Animated.View
        pointerEvents={open ? "auto": "none"}
        style={[styles.background, getBackgroundStyle(animated)]}
      >
        <Animated.View style={[styles.container, getModalStyle(animated), props.style]}>
          {props.children}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
};

export default SlideUpModal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 100000
  },
  background: {
    position: "absolute",
    backgroundColor: "black",
    height: Layout.window.height,
    width: Layout.window.width
  }
});