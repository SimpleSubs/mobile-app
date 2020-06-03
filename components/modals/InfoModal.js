import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity
} from "react-native";

import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";

const PADDING_HORIZONTAL = 10;
const PADDING_VERTICAL = 40;
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

const InfoModal = ({ message, setInfoMessage }) => {
  const animated = useRef(new Animated.Value(0)).current;
  const [modalHeight, setHeight] = useState(0);

  useEffect(() => toggleAnimation(message.length > 0, animated), [message]);

  return (
    <TouchableAnimated
      onLayout={({ nativeEvent }) => setHeight(nativeEvent.layout.height)}
      onPress={() => setInfoMessage("")}
      style={[styles.container, getModalStyle(animated, modalHeight + PADDING_VERTICAL)]}
      activeOpacity={1}
    >
      <Text style={styles.text}>{message}</Text>
    </TouchableAnimated>
  )
};

export default InfoModal;

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