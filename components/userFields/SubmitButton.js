import AnimatedTouchable from "../AnimatedTouchable";
import {
  Text,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import React from "react";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";

const SubmitButton = ({ title, style = {}, onPress, loading }) => (
  <AnimatedTouchable style={[styles.button, style]} onPress={onPress}>
    {loading
      ? <ActivityIndicator size={"small"} color={Colors.textOnBackground} />
      : <Text style={styles.buttonText}>{title}</Text>
    }
  </AnimatedTouchable>
);

export default SubmitButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    backgroundColor: Colors.accentColor,
    padding: 20,
    marginVertical: 20
  },
  buttonText: {
    color: Colors.textOnBackground,
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center"
  }
})