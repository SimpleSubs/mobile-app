/**
 * @file Creates main top-level modal.
 * @author Emily Sturman <emily@sturman.org>
 */
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

/**
 * Gets modal animation style.
 *
 * Generates animation style prop based on specified modal type; may
 * either be a modal that slides up from bottom or springs from center.
 *
 * @param {string}         type Type of modal animation.
 * @param {Animated.Value} springAnimated Animated value for spring animation (used for scale).
 * @param {Animated.Value} timingAnimated Animated value for timing animation (used for slide/fade).
 *
 * @returns {Object} Style object to be applied to modal.
 */
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

/**
 * Computes background color style for modal background.
 *
 * Interpolates opacity animated value (from 0 to 1) to correct values
 * for modal background color (opacity from 0 to 0.4, color black).
 *
 * @param {Animated.Value} animated Animated value for opacity animation (should be timing animated).
 *
 * @returns {Object} Style object to be applied to background component.
 */
const getBackgroundStyle = (animated) => {
  const opacityInterpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.4)"]
  });
  return { backgroundColor: opacityInterpolation }
};

/**
 * Triggers toggle animation for opening/closing modal.
 *
 * Starts spring (scaleAnimated) and timing (opacityAnimated) animations;
 * Closes modal if modal is open, opens modal if modal is closed.
 *
 * @param {boolean}        open            Whether modal is currently being opened.
 * @param {Animated.Value} timingAnimated  Animated value for timing animations (for slide/fade).
 * @param {Animated.Value} springAnimated  Animated value for spring animations (for scale).
 * @param {Function}       onClose         Function to execute when modal is closed.
 * @param {string}         type            Type of modal animation.
 */
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
    toValue: endValue,
    useNativeDriver: false
  }).start(closeHandler(ModalTypes.CENTER_SPRING_MODAL));
  Animated.timing(timingAnimated, {
    duration: 100,
    toValue: endValue,
    useNativeDriver: false
  }).start(closeHandler(ModalTypes.SLIDE_UP_MODAL));
}

/**
 * Implements a modal that springs from center of screen and fades in on open.
 *
 * Uses Animated API to animate both the scale animation (using Animated.spring)
 * and the fade animation (using Animated.timing); background also fades darker,
 * and user may click outside of modal to close it.
 *
 * @param {React.ReactElement} children                   Component to be rendered inside modal.
 * @param {string}             [type=CENTER_SPRING_MODAL] Type of modal animation.
 * @param {Function}           closeModal                 Function to close modal.
 * @param {Object}             [style={}]                 Style for modal container.
 * @param {boolean}            [open=false]               Whether modal is open.
 * @param {Function}           [onClose=() => {}]         Function to execute when modal is closed.
 *
 * @return {React.ReactElement} Modal element to be rendered.
 * @constructor
 */
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
};

const mapStateToProps = ({ modal }) => modal;

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(Modal);

const styles = StyleSheet.create({
  container: {
  },
  background: {
    zIndex: 100000,
    position: "absolute",
    backgroundColor: "black",
    height: Layout.window.height,
    width: Layout.window.width,
    padding: 60,
    alignItems: "center",
    justifyContent: "center"
  }
});