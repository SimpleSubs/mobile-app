import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";

import ModalTypes from "../../constants/ModalTypes";
import Layout from "../../constants/Layout";
import { closeModal } from "../../redux/Actions";
import { connect } from "react-redux";

const getModalStyle = (type, springAnimated, timingAnimated) => {
  switch (type) {
    case ModalTypes.CENTER_SPRING_MODAL:
      const scaleInterpolation = springAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1]
      });
      return { transform: [{ scale: scaleInterpolation }], opacity: timingAnimated };
    case ModalTypes.SLIDE_UP_MODAL:
      const positionInterpolation = timingAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [Layout.window.height, 0]
      });
      return { transform: [{ translateY: positionInterpolation }]};
  }
}

const getBackgroundStyle = (animated) => {
  const opacityInterpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.4)"]
  });
  return { backgroundColor: opacityInterpolation }
};

const toggleAnimation = (open, timingAnimated, springAnimated, onClose, type) => {
  const startValue = open ? 0 : 1;
  const endValue = open ? 1 : 0;
  const closeHandler = (targetType) => (type === targetType && !open) ? onClose : () => {};
  timingAnimated.setValue(startValue);
  springAnimated.setValue(startValue);
  Animated.spring(springAnimated, {
    tension: 120,
    friction: 5,
    restDisplacementThreshold: 0.7,
    toValue: endValue
  }).start(closeHandler(ModalTypes.CENTER_SPRING_MODAL));
  Animated.timing(timingAnimated, {
    duration: 100,
    toValue: endValue
  }).start(closeHandler(ModalTypes.SLIDE_UP_MODAL));
}

// props: children, type, closeModal, style
const Modal = ({ children, type = ModalTypes.CENTER_SPRING_MODAL, closeModal, style = {}, open = false, onClose = () => {} }) => {
  const springAnimated = useRef(new Animated.Value(0)).current;
  const timingAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => toggleAnimation(open, timingAnimated, springAnimated, onClose, type), [open]);

  return (
    <TouchableWithoutFeedback onPress={closeModal}>
      <Animated.View
        pointerEvents={open ? "auto": "none"}
        style={[styles.background, getBackgroundStyle(timingAnimated)]}
      >
        <Animated.View style={[styles.container, getModalStyle(type, springAnimated, timingAnimated), style]}>
          {children}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

const mapStateToProps = ({ modal }) => modal;

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(Modal);

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