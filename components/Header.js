/**
 * @file Creates header component for screens in main stack.
 * @author Emily Sturman <emily@sturman.org>
 */
import React from "react";
import {
  Text,
  View,
  StyleSheet
} from "react-native";
import AnimatedTouchable from "./AnimatedTouchable";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

/**
 * "Blank" icon to render in place of a visible button/icon.
 *
 * Renders a button that is the same color as the header background
 * (for spacing purposes).
 *
 * @return {React.ReactElement} Blank icon to render.
 * @constructor
 */
const Spacer = () => (
  <Ionicons
    style={styles.navigateButtons}
    name={"square-outline"}
    color={Colors.backgroundColor}
    size={Layout.fonts.icon}
  />
)

/**
 * Renders standard header for pages in main stack.
 *
 * @param {string}                                             title           Title of page (to render in header).
 * @param {Object}                                             [style={}]      Style object to apply to header.
 * @param {{name: string, style: Object, onPress: function()}} [rightButton]   Data for icon button to be rendered to the right of the title.
 * @param {{name: string, style: Object, onPress: function()}} [leftButton]    Data for icon button to be rendered to the left of the title.
 * @param {boolean}                                            [includeInsets] Whether vertical inset should be included in header (usually excluded for modal).
 * @param {React.ReactElement}                                      [children]    Other elements to render within header (such as place order button on home screen).
 *
 * @return {React.ReactElement} Header element.
 * @constructor
 */
const Header = ({ title, style = {}, rightButton, leftButton, includeInsets = true, children }) => (
  <View style={[styles.header, { paddingTop: styles.header.paddingVertical + (includeInsets ? useSafeAreaInsets().top : 0) }, style]}>
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