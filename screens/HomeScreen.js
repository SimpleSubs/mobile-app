import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Appearance
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import AnimatedTouchable from "../components/AnimatedTouchable";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

const DATA = [
  { title: "Reuben", date: "Saturday", ingredients: "something, something, something, something, something, something" },
  { date: "Saturday", ingredients: "something, something, something, something, something, something, something, something" },
  { title: "Reuben", date: "Saturday", ingredients: "something, something, something, something" },
  { title: "Reuben", date: "Saturday", ingredients: "something, something, something, something" },
  { title: "Reuben", date: "Saturday", ingredients: "something, something, something, something" },
  { title: "Reuben", date: "Saturday", ingredients: "something, something, something, something" }
];

const HomeScreen = ({ navigation }) => {
  const LOGOUT = () => navigation.navigate("Login");
  const SETTINGS = () => navigation.navigate("Settings");
  const NEW_ORDER = () => navigation.navigate("Order");
  const EDIT_ORDER = () => navigation.navigate("Order");
  const inset = useSafeArea();
  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <View style={styles.header}>
        <AnimatedTouchable style={styles.logOutButton} endSize={0.8} onPress={LOGOUT}>
          <Ionicons name={"md-log-out"} color={Colors.primaryText} size={Layout.fonts.icon} />
        </AnimatedTouchable>
        <Text style={styles.headerText}>Home</Text>
        <AnimatedTouchable style={styles.settingsButton} endSize={0.8} onPress={SETTINGS}>
          <Ionicons name={"md-settings"} color={Colors.primaryText} size={Layout.fonts.icon} />
        </AnimatedTouchable>
        <AnimatedTouchable style={styles.placeOrderButton} endOpacity={1} onPress={NEW_ORDER}>
          <Text style={styles.placeOrderButtonText}>Place an order</Text>
        </AnimatedTouchable>
      </View>
      <FlatList
        data={DATA}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Card {...item} onPress={EDIT_ORDER} />}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: inset.bottom }]}
        style={styles.flatList}
      />
    </View>
  )
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  header: {
    paddingTop: 10,
    paddingBottom: 15 + Layout.placeOrderButton.height / 2,
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
  placeOrderButton: {
    backgroundColor: Colors.accentColor,
    borderRadius: 100,
    width: Layout.window.width - Layout.placeOrderButton.horizontalPadding,
    height: Layout.placeOrderButton.height,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -Layout.placeOrderButton.height / 2,
    left: Layout.placeOrderButton.horizontalPadding / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 2
  },
  placeOrderButtonText: {
    color: Colors.textOnBackground,
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center"
  },
  logOutButton: {
    padding: 10,
    transform: [{ rotate: "180deg" }]
  },
  settingsButton: {
    padding: 10
  },
  flatList: {
    backgroundColor: Colors.scrollViewBackground
  },
  contentContainer: {
    padding: 10,
    paddingTop: Layout.placeOrderButton.height / 2 + 10
  }
});