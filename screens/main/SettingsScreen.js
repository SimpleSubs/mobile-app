import React from "react";
import {
  View,
  StyleSheet
} from "react-native";
import Header from "../../components/Header";
import DualOptionDisplay from "../../components/DualOptionDisplay";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";

const SETTINGS_PAGES = [
  { key: "userSettings", title: "Profile Settings", page: "User Settings" },
  { key: "orderSettings", title: "Order Settings", page: "Order Settings" }
]

const SettingsScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Header title={"Settings"} leftButton={{ name: "ios-arrow-back", onPress: () => navigation.pop() }} />
    <DualOptionDisplay pages={SETTINGS_PAGES} navigation={navigation} />
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