import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Layout from "../constants/Layout";
import createStyleSheet, { getColors } from "../constants/Colors";
import AnimatedTouchable from "./AnimatedTouchable";

const TopIconButton = ({ iconName, onPress, style = {} }) => {
  const themedStyles = createStyleSheet(styles);
  return (
    <AnimatedTouchable style={[themedStyles.button, style]} onPress={onPress} endSize={0.8}>
      <Ionicons name={iconName} size={Layout.fonts.icon} color={getColors().primaryText} />
    </AnimatedTouchable>
  );
};

export default TopIconButton;

const styles = () => ({
  button: {
    position: "absolute",
    top: 0
  },
});