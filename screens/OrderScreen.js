import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Appearance
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import AnimatedTouchable from "../components/AnimatedTouchable";
import AnimatedDropdown from "../components/orders/AnimatedDropdown";
import { Ionicons } from "@expo/vector-icons";
import OrderField from "../components/orders/OrderField";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import OrderInputTypes from "../constants/OrderInputTypes";

const DATA = [
  {
    title: "Bread",
    type: OrderInputTypes.PICKER.title,
    key: "bread",
    options: ["Dutch crunch", "Sourdough roll", "Ciabatta roll", "Sliced wheat", "Sliced sourdough", "Gluten free"],
    required: true
  },
  {
    title: "Meat",
    type: OrderInputTypes.CHECKBOX.title,
    key: "meat",
    options: ["Turkey", "Roast beef", "Pastrami", "Salami", "Ham", "Tuna salad", "Egg salad"]
  },
  {
    title: "Cheese",
    type: OrderInputTypes.CHECKBOX.title,
    key: "cheese",
    options: ["Provolone", "Swiss", "Cheddar", "Fresh mozzarella"]
  },
  {
    title: "Condiments",
    type: OrderInputTypes.CHECKBOX.title,
    key: "condiments",
    options: ["Mayo", "Mustard", "Pesto", "Red vin/olive oil", "Balsamic vin/olive oil", "Roasted red peppers",
      "Pepperoncini", "Pickles", "Basil", "Lettuce", "Tomatoes", "Hummus", "Red onions", "Jalapenos",
      "Artichoke hearts"],
  }
];

const CANCEL = ({ navigate }) => navigate("Home");
const DONE = ({ navigate }) => navigate("Home");

const CancelDoneButtons = ({ cancelOnPress, doneOnPress }) => (
  <View style={styles.cancelDoneButtonsContainer}>
    <TouchableOpacity style={styles.cancelButton} onPress={cancelOnPress}>
      {Layout.isSmallDevice ?
        <Ionicons name={"md-close"} color={Colors.secondaryText} size={Layout.fonts.icon} /> :
        <Text style={styles.cancelButtonText}>Cancel</Text>}
    </TouchableOpacity>
    <AnimatedTouchable style={styles.doneButton} endSize={0.9} onPress={doneOnPress}>
      {Layout.isSmallDevice ?
        <Ionicons name={"md-checkmark"} color={Colors.secondaryText} size={Layout.fonts.icon} /> :
        <Text style={styles.doneButtonText}>Done</Text>}
    </AnimatedTouchable>
  </View>
);

const OrderScreen = ({ navigation }) => {
  const inset = useSafeArea();
  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order</Text>
        <CancelDoneButtons cancelOnPress={() => CANCEL(navigation)} doneOnPress={() => DONE(navigation)} />
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: inset.bottom }}
        data={DATA}
        renderItem={({ item }) => <OrderField {...item} />}
      />
    </View>
  )
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  header: {
    padding: 20,
    backgroundColor: Colors.backgroundColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    zIndex: 100,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  headerText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
    textAlign: "left",
    color: Colors.primaryText
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelButtonText: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.title,
    textAlign: "center",
    color: Colors.secondaryText
  },
  doneButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: Colors.accentColor
  },
  doneButtonText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center",
    color: Colors.textOnBackground
  },
  cancelDoneButtonsContainer: {
    flexDirection: "row"
  }
});