/**
 * @file Creates submit button to pass to user inputs list.
 * @author Emily Sturman <emily@sturman.org>
 */
import React from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import AnimatedTouchable from "../AnimatedTouchable";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";

/**
 * Renders a submit button for UserInputsList
 *
 * Renders a button that executes a given onPress function and displays
 * activity indicator if loading.
 *
 * @param {string}   title      Text to be displayed within button.
 * @param {Object}   [style={}] Style to apply to button
 * @param {Function} onPress    Function to execute on button press.
 * @param {boolean}  loading    If app is loading
 *
 * @return {React.ReactElement} Submit button.
 * @constructor
 */
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