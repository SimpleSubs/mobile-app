import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Appearance
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import AnimatedTouchable from "../components/AnimatedTouchable";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

import { deleteOrder, focusOrder, logOut } from "../redux/Actions";
import { connect } from "react-redux";

export const NEW_ORDER = "NEW_ORDER";

const HomeScreen = ({ orders, user, focusedOrder, logOut, focusOrder, deleteOrder, navigation }) => {
  const inset = useSafeArea();

  const editUser = () => navigation.navigate("Settings");

  const newOrder = () => navigation.navigate("Order");

  const focusOrderNavigate = (id) => {
    focusOrder(id);
    navigation.navigate("Order");
  }

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logOutButton} onPress={logOut}>
          <Ionicons name={"md-log-out"} color={Colors.primaryText} size={Layout.fonts.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Home</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={editUser}>
          <Ionicons name={"md-settings"} color={Colors.primaryText} size={Layout.fonts.icon} />
        </TouchableOpacity>
        <AnimatedTouchable style={styles.placeOrderButton} endOpacity={1} onPress={newOrder}>
          <Text style={styles.placeOrderButtonText}>Place an order</Text>
        </AnimatedTouchable>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Card {...item} onPress={() => focusOrderNavigate(item.id)} />}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: inset.bottom }]}
        style={styles.flatList}
      />
    </View>
  )
};

const getOrdersArr = (orders) => (
  Object.values(orders).sort((orderA, orderB) => orderB.date.diff(orderA.date))
);

const mapStateToProps = ({ user, focusedOrder, orders }) => ({
  user,
  focusedOrder,
  orders: getOrdersArr(orders)
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logOut()),
  focusOrder: (id) => dispatch(focusOrder(id)),
  deleteOrder: (id) => dispatch(deleteOrder(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

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