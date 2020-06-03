import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from "react-native";
import Layout from "../../constants/Layout";

const getModalStyle = (scaleAnimated, opacityAnimated) => {
  const scaleInterpolation = scaleAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1]
  });
  return { transform: [{ scale: scaleInterpolation }], opacity: opacityAnimated }
};

const getBackgroundStyle = (opacityAnimated) => {
  const opacityInterpolation = opacityAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.4)"]
  });
  return { backgroundColor: opacityInterpolation }
};

const toggleAnimation = (open, opacityAnimated, scaleAnimated) => {
  opacityAnimated.setValue(open ? 0 : 1);
  scaleAnimated.setValue(open ? 0 : 1);
  Animated.spring(scaleAnimated, {
    tension: 120,
    friction: 5,
    restDisplacementThreshold: 0.7,
    toValue: open ? 1 : 0
  }).start();
  Animated.timing(opacityAnimated, {
    duration: 100,
    toValue: open ? 1 : 0
  }).start();
};

const CenterSpringModal = ({ children, open, toggleModal, style }) => {
  const opacityAnimated = useRef(new Animated.Value(0)).current;
  const scaleAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => toggleAnimation(open, opacityAnimated, scaleAnimated), [open]);

  return (
    <TouchableWithoutFeedback onPress={() => toggleModal(false)}>
      <Animated.View
        pointerEvents={open ? "auto": "none"}
        style={[styles.background, getBackgroundStyle(opacityAnimated)]}
      >
        <Animated.View style={[styles.container, getModalStyle(scaleAnimated, opacityAnimated), style]}>
          {children}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
};

export default CenterSpringModal;

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