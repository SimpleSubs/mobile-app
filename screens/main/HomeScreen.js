import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import AnimatedTouchable from "../../components/AnimatedTouchable";
import Card from "../../components/orders/Card";
import Header from "../../components/Header";

import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";
import { READABLE_FORMAT } from "../../constants/Date";

import { deleteOrder, focusOrder, unfocusOrder, logOut, watchOrders } from "../../redux/Actions";
import { connect } from "react-redux";
import moment from "moment";

const HomeScreen = ({ orders = [], orderPresets = {}, uid, logOut, focusOrder, unfocusOrder, deleteOrder, watchOrders,
                      navigation }) => {
  const editUser = () => navigation.navigate("Settings");

  const newOrder = () => {
    if (Object.keys(orderPresets).length === 0) {
      navigation.navigate("Order", { screen: "Custom Order"});
    } else {
      navigation.navigate("Order")
    }
  };

  const focusOrderNavigate = (id, hasTitle) => {
    focusOrder(id);
    if (hasTitle) {
      navigation.navigate("Order", { screen: "Preset Order" });
    } else {
      navigation.navigate("Order", { screen: "Custom Order" });
    }
  };

  useEffect(() => {
    const unsubscribeFromWatchOrders = watchOrders(uid);
    const unsubscribeFromListener = navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type === "POP") {
        unsubscribeFromWatchOrders();
        logOut();
      }
    });
    return () => {
      unsubscribeFromWatchOrders();
      unsubscribeFromListener();
    }
  }, [navigation]);
  useEffect(() => navigation.addListener("focus", () => unfocusOrder()), [navigation]);

  return (
    <View style={styles.container}>
      <Header
        title={"Home"}
        style={styles.header}
        leftButton={{ name: "md-log-out", style: styles.logOutIcon, onPress: () => navigation.pop() }}
        rightButton={{ name: "md-settings", onPress: editUser }}
      >
        <AnimatedTouchable style={styles.placeOrderButton} endOpacity={1} onPress={newOrder}>
          <Text style={styles.placeOrderButtonText}>Place an order</Text>
        </AnimatedTouchable>
      </Header>
      <FlatList
        ListEmptyComponent={() => <Text style={styles.emptyText}>No orders to display</Text>}
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          <Card
            title={item.title}
            date={item.date}
            onPress={() => focusOrderNavigate(item.key, !!item.title)}
            onDelete={() => deleteOrder(item.key, uid)}
            {...item}
          />
        }
        contentContainerStyle={[styles.contentContainer, { paddingBottom: useSafeArea().bottom }]}
        style={styles.flatList}
      />
    </View>
  )
};

const getOrdersArr = (orders, cutoffTime) => (
  Object.values(orders)
    .filter(({ date }) => {
      // date will be at midnight; if it's not yet cutoff time, we want to include today's order, so set now to today at midnight
      let now = moment();
      if (now.isBefore(cutoffTime)) {
        now.startOf("day");
      }
      return date.isSameOrAfter(now);
    })
    .sort((orderA, orderB) => orderA.date.diff(orderB.date))
    .map((order) => ({ ...order, date: order.date.format(READABLE_FORMAT) }))
);

const mapStateToProps = ({ orders, orderPresets, stateConstants, user }) => ({
  orders: getOrdersArr(orders, stateConstants.cutoffTime),
  orderPresets,
  uid: user?.uid
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => logOut(dispatch),
  focusOrder: (id) => dispatch(focusOrder(id)),
  unfocusOrder: () => dispatch(unfocusOrder()),
  deleteOrder: (id) => deleteOrder(dispatch, id),
  watchOrders: (uid) => watchOrders(dispatch, uid)
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  header: {
    paddingBottom: 15 + Layout.placeOrderButton.height / 2
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
  logOutIcon: {
    transform: [{ rotate: "180deg" }]
  },
  flatList: {
    backgroundColor: Colors.scrollViewBackground
  },
  contentContainer: {
    padding: 10,
    paddingTop: Layout.placeOrderButton.height / 2 + 10
  },
  emptyText: {
    color: Colors.primaryText,
    fontSize: Layout.fonts.body,
    textAlign: "center",
    fontFamily: "josefin-sans",
    marginTop: 20
  }
});