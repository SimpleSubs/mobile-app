import React from "react";
import {
  Animated,
  Text,
  TouchableHighlight,
} from "react-native";
import Layout from "../../constants/Layout";
import createStyleSheet, { getColors } from "../../constants/Colors";
import { setInfoMessage } from "../../redux/features/display/infoMessageSlice";
import { CLOSED_INFO_MODAL } from "../../redux/features/display/infoMessageSlice";
import { useSelector, useDispatch } from "react-redux";

// Constants for horizontal/vertical margin
const MARGIN_HORIZONTAL = 10;
const MARGIN_VERTICAL = 40;
// Time in seconds until modal automatically closes
const CLOSE_MODAL_TIMEOUT = 10;
// String that represents a closed modal

const TouchableAnimated = Animated.createAnimatedComponent(TouchableHighlight);

const getModalStyle = (animated) => {
  const scaleInterpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1]
  });
  return { transform: [{ scale: scaleInterpolation }], opacity: animated };
};

const toggleAnimation = (open, animated, displayMessage) => {
  animated.setValue(open ? 0 : 1);
  if (open) displayMessage();
  Animated.timing(animated, {
    duration: 100,
    toValue: open ? 1 : 0,
    useNativeDriver: true
  }).start(() => {
    if (!open) displayMessage();
  });
};

/**
 * Overlaid popup to display important info
 */
const InfoModal = () => {
  const infoMessage = useSelector(({ infoMessage }) => infoMessage.value);
  const dispatch = useDispatch();

  const [displayedMessage, displayMessage] = React.useState(infoMessage);
  const animated = React.useRef(new Animated.Value(0)).current;
  const timeoutRef = React.useRef(null);
  const themedStyles = createStyleSheet(styles);

  const closeModal = () => dispatch(setInfoMessage(CLOSED_INFO_MODAL));

  // Closes info modal after 10 seconds if new message does not appear
  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    toggleAnimation(infoMessage !== CLOSED_INFO_MODAL, animated, () => displayMessage(infoMessage));
    timeoutRef.current = setTimeout(closeModal, CLOSE_MODAL_TIMEOUT * 1000);
  }, [infoMessage]);

  // render nothing if closed (so you can click through the hidden modal)
  if (displayedMessage === CLOSED_INFO_MODAL && infoMessage === CLOSED_INFO_MODAL) {
    return null;
  } else {
    return (
      <TouchableAnimated
        onPress={closeModal}
        style={[themedStyles.container, getModalStyle(animated)]}
        underlayColor={getColors().infoModal}
        delayPressIn={0}
        activeOpacity={0.5}
      >
        <Text style={themedStyles.text}>{displayedMessage}</Text>
      </TouchableAnimated>
    );
  }
};

export default InfoModal;

const styles = (Colors) => ({
  container: {
    position: "absolute",
    zIndex: 1000000,
    width: Layout.window.width - MARGIN_HORIZONTAL * 2,
    left: MARGIN_HORIZONTAL,
    bottom: MARGIN_VERTICAL,
    backgroundColor: Colors.infoModal,
    padding: 15,
    paddingTop: 17,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOpacity: 0.5
  },
  text: {
    fontFamily: "josefin-sans",
    color: Colors.textOnBackground,
    fontSize: Layout.fonts.body
  }
});