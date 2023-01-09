import React from "react";
import {
  View,
  Text,
  FlatList, ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedTouchable from "../../../components/AnimatedTouchable";
import Card from "../../../components/orders/Card";
import Header from "../../../components/Header";
import Layout from "../../../constants/Layout";
import createStyleSheet, {getColors} from "../../../constants/Colors";
import { focusOrder, unfocusOrder } from "../../../redux/features/orders/focusedOrderSlice";
import { deleteOrder, logOut, watchOrders } from "../../../redux/Thunks";
import { useSelector, useDispatch } from "react-redux";
import Alert from "../../../constants/Alert";
import { isDynamic } from "../../../constants/Schedule";
import { getOrdersArr } from "../../../constants/OrdersAndOptions";

const HomeScreen = ({ navigation }) => {
  const orders = useSelector(({ orders, stateConstants }) => (
    getOrdersArr(orders, isDynamic(stateConstants.orderSchedule))
  ));
  const orderPresets = useSelector(({ orderPresets }) => orderPresets);
  const dynamicMenu = useSelector(({ stateConstants }) => stateConstants.orderOptions.dynamic);
  const loading = useSelector(({ loading }) => loading.value);
  const dispatch = useDispatch();
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
    dispatch(focusOrder(id));
    if (hasTitle && !dynamicMenu) {
      navigation.navigate("Order", { screen: "Preset Order" });
    } else {
      navigation.navigate("Order", { screen: "Custom Order" });
    }
  };

  // Creates listeners for user's orders collection, popping screen (for log out), and focusing screen (for unfocusing an order).
  React.useEffect(() => {
    const unsubscribeFromWatchOrders = watchOrders();
    const unsubscribeFromListener = navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type === "POP") {
        unsubscribeFromWatchOrders();
        dispatch(logOut());
      }
    });
    return () => {
      unsubscribeFromWatchOrders();
      unsubscribeFromListener();
    }
  }, [navigation]);

  // Unfocuses orders when page loads
  React.useEffect(() => navigation.addListener("focus", () => dispatch(unfocusOrder())), [navigation]);

  return (
    <View style={themedStyles.container}>
      <Header
        title={"Home"}
        style={themedStyles.header}
        leftButton={{ name: "log-out-outline", style: themedStyles.logOutIcon, onPress: () => navigation.pop() }}
        rightButton={{ name: "settings-outline", onPress: editUser }}
      >
        <AnimatedTouchable style={themedStyles.placeOrderButton} endOpacity={1} onPress={newOrder}>
          {loading
            ? <ActivityIndicator size={"small"} color={getColors().textOnBackground} />
            : <Text style={themedStyles.placeOrderButtonText}>Place an order</Text>
          }
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
            onDelete={() => dispatch(deleteOrder(item.keys || item.key))}
            {...item}
          />
        }
        contentContainerStyle={[themedStyles.contentContainer, { paddingBottom: useSafeAreaInsets().bottom }]}
        style={themedStyles.flatList}
      />
    </View>
  )
};

export default HomeScreen;

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