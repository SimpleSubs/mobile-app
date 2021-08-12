/**
 * @file Creates a list of navigation options (for screens like order, settings).
 * @author Emily Sturman <emily@sturman.org>
 */
import React from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

/**
 * Renders a list of navigation options.
 *
 * Returns a list containing buttons that navigation to provided screens.
 *
 * @param {{ key: string, title: string, page: string }[]} pages Data on options for pages to navigate to.
 * @param {Object} navigation Navigation prop (from React navigation).
 *
 * @return {React.ReactElement} List of buttons that navigate to provided screens.
 * @constructor
 */
const MultipleOptionsList = ({ pages, navigation }) => (
  <FlatList
    alwaysBounceVertical={false}
    style={styles.container}
    data={pages}
    renderItem={({ item }) => (
      <TouchableOpacity activeOpacity={0.5} style={styles.navigateTouchable} onPress={() => navigation.navigate(item.page)}>
        <Text style={styles.navigateTouchableText}>{item.title}</Text>
        <Ionicons name={"chevron-forward"} color={Colors.primaryText} size={Layout.fonts.icon} />
      </TouchableOpacity>
    )}
  />
);

export default MultipleOptionsList;

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