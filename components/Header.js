import React from "react";
import {
  Text,
  View,
  StyleSheet
} from "react-native";
import AnimatedTouchable from "./AnimatedTouchable";
import { Ionicons } from "@expo/vector-icons";
import { useSafeArea } from "react-native-safe-area-context";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

const Spacer = () => (
  <Ionicons
    style={styles.navigateButtons}
    name={"md-square-outline"}
    color={Colors.backgroundColor}
    size={Layout.fonts.icon}
  />
)

const Header = ({ title, style = {}, rightButton, leftButton, children }) => (
  <View style={[styles.header, { paddingTop: styles.header.paddingVertical + useSafeArea().top }, style]}>
    {leftButton ? (
      <AnimatedTouchable style={styles.navigateButtons} endSize={0.8} onPress={leftButton.onPress}>
        <Ionicons
          name={leftButton.name}
          color={Colors.primaryText}
          size={Layout.fonts.icon}
          style={leftButton.style}
        />
      </AnimatedTouchable>
    ) : <Spacer />}
    <Text style={styles.headerText}>{title}</Text>
    {rightButton ? (
      <AnimatedTouchable style={styles.navigateButtons} endSize={0.8} onPress={rightButton.onPress}>
        <Ionicons
          name={rightButton.name}
          color={Colors.primaryText}
          size={Layout.fonts.icon}
          style={rightButton.style}
        />
      </AnimatedTouchable>
    ) : <Spacer />}
    {children}
  </View>
);

export default Header;

const styles = StyleSheet.create({
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