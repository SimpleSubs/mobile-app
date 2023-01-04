import React from "react";
import {
  Animated,
  TouchableWithoutFeedback,
  View
} from "react-native";
import InputModal from "./InputModal";
import ModalTypes, { ModalAnimationTypes } from "../../constants/ModalTypes";
import Layout from "../../constants/Layout";
import createStyleSheet from "../../constants/Colors";
import { setReturnValue } from "../../redux/features/display/modalOperationsSlice";
import { closeModal } from "../../redux/features/display/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import Picker from "../Picker";

const getModalStyle = (animationType, springAnimated, timingAnimated) => {
  switch (animationType) {
    case ModalAnimationTypes.CENTER_SPRING_MODAL:
      const scaleInterpolation = springAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1]
      });
      return { transform: [{ scale: scaleInterpolation }], opacity: timingAnimated };
    case ModalAnimationTypes.SLIDE_UP_MODAL:
      const positionInterpolation = timingAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [Layout.window.height, 0]
      });
      return { transform: [{ translateY: positionInterpolation }]};
    default:
      return {};
  }
}

const getBackgroundStyle = (animated) => {
  const opacityInterpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.4)"]
  });
  return { backgroundColor: opacityInterpolation }
};

const toggleAnimation = (open, timingAnimated, springAnimated, onClose, animationType) => {
  const startValue = open ? 0 : 1;
  const endValue = open ? 1 : 0;
  const closeHandler = (targetType) => (animationType === targetType && !open) ? onClose : () => {};
  timingAnimated.setValue(startValue);
  springAnimated.setValue(startValue);
  Animated.spring(springAnimated, {
    tension: 120,
    friction: 5,
    restDisplacementThreshold: 0.7,
    toValue: endValue,
    useNativeDriver: false
  }).start(closeHandler(ModalAnimationTypes.CENTER_SPRING_MODAL));
  Animated.timing(timingAnimated, {
    duration: 100,
    toValue: endValue,
    useNativeDriver: false
  }).start(closeHandler(ModalAnimationTypes.SLIDE_UP_MODAL));
}

const ChildComponent = ({ type, ...props }) => {
  const dispatch = useDispatch();
  switch (type) {
    case ModalTypes.INPUT_MODAL:
      return <InputModal {...props} />
    case ModalTypes.PICKER_MODAL:
      return (
        <View style={props.contentContainerStyle}>
          <Picker onValueChange={(value) => dispatch(setReturnValue(value))} {...props} />
        </View>
      );
    default:
      return null;
  }
};

/**
 * Modal overlaid over entire app
 */
const Modal = () => {
  const {
    type,
    animationType = ModalAnimationTypes.CENTER_SPRING_MODAL,
    style = {},
    open = false,
    props = {},
    onClose = () => {}
  } = useSelector(({ modal }) => modal);
  const dispatch = useDispatch();

  const springAnimated = React.useRef(new Animated.Value(0)).current;
  const timingAnimated = React.useRef(new Animated.Value(0)).current;
  const themedStyles = createStyleSheet(styles);

  React.useEffect(() => toggleAnimation(open, timingAnimated, springAnimated, onClose, animationType), [open]);

  return (
    <TouchableWithoutFeedback onPress={() => dispatch(closeModal())}>
      <Animated.View
        pointerEvents={open ? "auto": "none"}
        style={[themedStyles.background, getBackgroundStyle(timingAnimated)]}
      >
        <Animated.View style={[style, getModalStyle(animationType, springAnimated, timingAnimated)]}>
          <ChildComponent type={type} {...props} />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
};

export default Modal;

const styles = () => ({
  background: {
    zIndex: 100000,
    position: "absolute",
    backgroundColor: "black",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  }
});