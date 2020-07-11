import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import AnimatedTouchable from "../components/AnimatedTouchable";
import { Ionicons } from "@expo/vector-icons";
import OrderField from "../components/orders/OrderField";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { NEW_ORDER } from "./HomeScreen";

import { createOrder, deleteOrder, editOrder, unfocusOrder } from "../redux/Actions";
import { connect } from "react-redux";
import InputTypes from "../constants/InputTypes";

const getDefault = (focusedOrder, orderOptions) => {
  if (focusedOrder) {
    return focusedOrder;
  }
  let newState = {};
  for (let option of orderOptions) {
    switch (option.type) {
      case InputTypes.picker:
        newState[option.key] = "Please select";
        break;
      case InputTypes.checkbox:
        newState[option.key] = [];
        break;
      default:
        newState[option.key] = null;
    }
  }
  return newState;
}

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

const OrderScreen = ({ focusedOrder, orderOptions, unfocusOrder, createOrder, editOrder, deleteOrder, navigation }) => {
  const [state, setFullState] = useState(getDefault(focusedOrder, orderOptions));
  const inset = useSafeArea();

  const submit = () => {
    if (focusedOrder) {
      editOrder(state, focusedOrder.id);
    } else {
      createOrder(state);
    }
  };

  const cancelOrder = () => {
    unfocusOrder();
    navigation.navigate("Home");
  };

  const setState = (newState) => {
    setFullState((prevState) => ({ ...prevState, ...newState }));
  };

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order</Text>
        <CancelDoneButtons cancelOnPress={cancelOrder} doneOnPress={submit} />
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: inset.bottom }}
        data={orderOptions}
        renderItem={({ item }) => (
          <OrderField
            title={item.title}
            type={item.type}
            options={item.options}
            required={item.required}
            value={state[item.key]}
            setValue={(value) => setState({ [item.key]: value })}
          />
        )}
      />
    </View>
  )
};

const mapStateToProps = ({ focusedOrder, orders, stateConstants }) => ({
  focusedOrder: focusedOrder ? orders[focusedOrder] : null,
  orderOptions: stateConstants.orderOptions
});

const mapDispatchToProps = (dispatch) => ({
  unfocusOrder: () => dispatch(unfocusOrder()),
  createOrder: (data) => dispatch(createOrder(data)),
  editOrder: (data, id) => dispatch(editOrder(data, id)),
  deleteOrder: (id) => dispatch(deleteOrder(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);

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