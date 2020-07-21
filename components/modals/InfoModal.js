import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity
} from "react-native";

import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";

import { setInfoMessage } from "../../redux/Actions";
import { connect } from "react-redux";

const PADDING_HORIZONTAL = 10;
const PADDING_VERTICAL = 40;
const CLOSE_MODAL_TIMEOUT = 10;
export const CLOSED_INFO_MODAL = "    ";

const TouchableAnimated = Animated.createAnimatedComponent(TouchableOpacity);

const getModalStyle = (animated, distToTravel) => {
  const interpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [distToTravel, 0]
  });
  return { transform: [{ translateY: interpolation }] };
};

const toggleAnimation = (open, animated) => {
  animated.setValue(open ? 0 : 1);
  Animated.timing(animated, {
    duration: 100,
    toValue: open ? 1 : 0,
    useNativeDriver: true
  }).start();
};

const InfoModal = ({ infoMessage, closeModal }) => {
  const animated = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef();
  const [modalHeight, setHeight] = useState(0);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    toggleAnimation(infoMessage !== CLOSED_INFO_MODAL, animated);
    timeoutRef.current = setTimeout(closeModal, CLOSE_MODAL_TIMEOUT * 1000);
  }, [infoMessage]);

  return (
    <TouchableAnimated
      onLayout={({ nativeEvent }) => setHeight(nativeEvent.layout.height)}
      onPress={closeModal}
      style={[styles.container, getModalStyle(animated, modalHeight + PADDING_VERTICAL)]}
      activeOpacity={1}
    >
      <Text style={styles.text}>{infoMessage}</Text>
    </TouchableAnimated>
  )
};

const mapStateToProps = ({ infoMessage }) => ({
  infoMessage
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(setInfoMessage(CLOSED_INFO_MODAL))
})

export default connect(mapStateToProps, mapDispatchToProps)(InfoModal);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000000,
    width: Layout.window.width - PADDING_HORIZONTAL * 2,
    left: PADDING_HORIZONTAL,
    bottom: PADDING_VERTICAL,
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