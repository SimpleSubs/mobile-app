import React from "react";
import {
  Text,
  ActivityIndicator
} from "react-native";
import AnimatedTouchable from "../AnimatedTouchable";
import createStyleSheet, { getColors } from "../../constants/Colors";
import Layout from "../../constants/Layout";

const SubmitButton = ({ title, style = {}, onPress, loading }) => {
  const themedStyles = createStyleSheet(styles);
  return (
    <AnimatedTouchable style={[themedStyles.button, style]} onPress={onPress}>
      {loading
        ? <ActivityIndicator size={"small"} color={getColors().textOnBackground}/>
        : <Text style={themedStyles.buttonText}>{title}</Text>
      }
    </AnimatedTouchable>
  )
};

export default SubmitButton;

const styles = (Colors) => ({
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
});