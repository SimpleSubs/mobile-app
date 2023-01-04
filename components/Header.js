import React from "react";
import {
  Text,
  View
} from "react-native";
import AnimatedTouchable from "./AnimatedTouchable";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import createStyleSheet, { getColors } from "../constants/Colors";

const Spacer = () => (
  <Ionicons
    style={createStyleSheet(styles).navigateButtons}
    name={"square-outline"}
    color={getColors().backgroundColor}
    size={Layout.fonts.icon}
  />
);

/**
 * Standard header for pages in main stack
 */
const Header = ({ title, style = {}, rightButton, leftButton, includeInsets = true, children }) => {
  const themedStyles = createStyleSheet(styles);
  const colors = getColors();
  return (
    <View
      style={[
        themedStyles.header,
        { paddingTop: themedStyles.header.paddingVertical + (includeInsets ? useSafeAreaInsets().top : 0) },
        style
      ]}
    >
      {leftButton ? (
        <AnimatedTouchable style={themedStyles.navigateButtons} endSize={0.8} onPress={leftButton.onPress}>
          <Ionicons
            name={leftButton.name}
            color={colors.primaryText}
            size={Layout.fonts.icon}
            style={leftButton.style}
          />
        </AnimatedTouchable>
      ) : <Spacer />}
      <Text style={themedStyles.headerText}>{title}</Text>
      {rightButton ? (
        <AnimatedTouchable style={themedStyles.navigateButtons} endSize={0.8} onPress={rightButton.onPress}>
          <Ionicons
            name={rightButton.name}
            color={colors.primaryText}
            size={Layout.fonts.icon}
            style={rightButton.style}
          />
        </AnimatedTouchable>
      ) : <Spacer />}
      {children}
    </View>
  )
};

export default Header;

const styles = (Colors) => ({
  header: {
    paddingVertical: 10,
    backgroundColor: Colors.backgroundColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10
  },
  headerText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
    textAlign: "center",
    color: Colors.primaryText
  },
  navigateButtons: {
    padding: 10,
  },
});