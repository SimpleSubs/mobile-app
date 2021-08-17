/**
 * @file Manages main settings screen (in-between for user/preset settings)
 * @author Emily Sturman <emily@sturman.org>
 */
import React from "react";
import {
  View,
  StyleSheet
} from "react-native";
import Header from "../../../components/Header";
import MultipleOptionsList from "../../../components/MultipleOptionsList";
import Colors from "../../../constants/Colors";
import Layout from "../../../constants/Layout";

// Data for each settings page (user settings and order/preset settings
const SETTINGS_PAGES = [
  { key: "userSettings", title: "Profile Settings", page: "User Settings" },
  { key: "orderSettings", title: "Order Settings", page: "Order Settings" }
];

/**
 * Renders main settings screen to navigate to either sub-screen
 *
 * @param {Object} navigation Navigation object passed by React Navigation.
 *
 * @return {React.ReactElement} Element to display.
 * @constructor
 */
const SettingsScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Header title={"Settings"} leftButton={{ name: "arrow-back", onPress: () => navigation.pop() }} />
    <MultipleOptionsList pages={SETTINGS_PAGES} navigation={navigation} />
  </View>
);

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.scrollViewBackground,
    flex: 1
  },
  navigateTouchable: {
    flex: 1,
    backgroundColor: Colors.cardColor,
    padding: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.5
  },
  navigateTouchableText: {
    fontSize: Layout.fonts.title,
    fontFamily: "josefin-sans",
    color: Colors.primaryText
  }
});