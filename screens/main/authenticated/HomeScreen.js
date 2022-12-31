import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedTouchable from "../../../components/AnimatedTouchable";
import Card from "../../../components/orders/Card";
import Header from "../../../components/Header";
import Layout from "../../../constants/Layout";
import createStyleSheet from "../../../constants/Colors";
import { deleteOrder, focusOrder, unfocusOrder, logOut, watchOrders } from "../../../redux/Actions";
import { connect } from "react-redux";
import Alert from "../../../constants/Alert";
import { toReadable, toSimple, parseISO } from "../../../constants/Date";
import { getUserLunchSchedule, OrderScheduleTypes } from "../../../constants/Schedule";

const HomeScreen = ({ orders = [], orderPresets = {}, dynamicMenu, orderSchedule, lunchSchedule, uid, logOut, focusOrder, unfocusOrder, deleteOrder, watchOrders, domain, navigation }) => {
  const themedStyles = createStyleSheet(styles);
  
  const editUser = () => {
    if (dynamicMenu) {
      navigation.navigate("User Settings");
    } else {
      navigation.navigate("Settings")
    }
  };

  // Opens the order screen for a new order.
  const newOrder = () => {
    if (dynamicMenu || Object.keys(orderPresets).length === 0) {
      navigation.navigate("Order", { screen: "Custom Order"});
    } else {
      navigation.navigate("Order")
    }
  };

  // Opens the order screen to edit an order.
  const focusOrderNavigate = (id, hasTitle, index) => {
    if (index && index < 0) {
      Alert("Cannot edit order", "It is too late to edit this order.");
      return;
    }
    focusOrder(id);
    if (hasTitle && !dynamicMenu) {
      navigation.navigate("Order", { screen: "Preset Order" });
    } else {
      navigation.navigate("Order", { screen: "Custom Order" });
    }
  };

  // Creates listeners for user's orders collection, popping screen (for log out), and focusing screen (for unfocusing an order).
  useEffect(() => {
    const unsubscribeFromWatchOrders = watchOrders(uid, domain, orderSchedule, lunchSchedule);
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

  // Unfocuses orders when page loads
  useEffect(() => navigation.addListener("focus", () => unfocusOrder()), [navigation]);

  return (
    <View style={themedStyles.container}>
      <Header
        title={"Home"}
        style={themedStyles.header}
        leftButton={{ name: "log-out-outline", style: themedStyles.logOutIcon, onPress: () => navigation.pop() }}
        rightButton={{ name: "settings-outline", onPress: editUser }}
      >
        <AnimatedTouchable style={themedStyles.placeOrderButton} endOpacity={1} onPress={newOrder}>
          <Text style={themedStyles.placeOrderButtonText}>Place an order</Text>
        </AnimatedTouchable>
      </Header>
      <FlatList
        ListEmptyComponent={() => <Text style={themedStyles.emptyText}>No orders to display</Text>}
        data={orders}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) =>
          <Card
            title={item.title}
            date={item.date}
            data={item.data}
            onPress={() => focusOrderNavigate(item.key, !!item.title, item.index)}
            onDelete={() => deleteOrder(item.keys || item.key, domain)}
            {...item}
          />
        }
        contentContainerStyle={[themedStyles.contentContainer, { paddingBottom: useSafeAreaInsets().bottom }]}
        style={themedStyles.flatList}
      />
    </View>
  )
};

/**
 * Gets array of user's future orders sorted chronologically.
 */
const getOrdersArr = (orders, dynamicSchedule) => {
  if (!dynamicSchedule) {
    return Object.values(orders)
      .sort((orderA, orderB) => parseISO(orderA.date).diff(orderB.date))
      .map((order) => ({ ...order, date: toReadable(order.date) }));
  }
  return Object.values(orders)
    .sort((orderA, orderB) => parseISO(orderA.date[0]).diff(orderB.date[0]))
    .map(({ date, key, keys, multipleOrders, ...orderGroups }) => ({
      date: `${toSimple(date[0])} to ${toSimple(date[date.length - 1])}`,
      key,
      keys,
      multipleOrders,
      data: Object.values(orderGroups)
        .sort((orderA, orderB) => parseISO(orderA.date).diff(orderB.date))
        .map((order) => ({ ...order, date: toReadable(order.date) }))
    }));
};

const mapStateToProps = ({ orders, orderPresets, stateConstants, user, domain }) => ({
  orders: getOrdersArr(orders, stateConstants.orderSchedule?.scheduleType === OrderScheduleTypes.CUSTOM),
  orderPresets,
  dynamicMenu: stateConstants.orderOptions.dynamic,
  orderSchedule: stateConstants.orderSchedule,
  lunchSchedule: getUserLunchSchedule(stateConstants.lunchSchedule, user || {}),
  uid: user?.uid,
  domain: domain.id
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => logOut(dispatch),
  focusOrder: (id) => dispatch(focusOrder(id)),
  unfocusOrder: () => dispatch(unfocusOrder()),
  deleteOrder: (id, domain) => deleteOrder(dispatch, id, domain),
  watchOrders: (uid, domain, orderSchedule, lunchSchedule) => watchOrders(dispatch, uid, domain, orderSchedule, lunchSchedule)
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = (Colors) => ({
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