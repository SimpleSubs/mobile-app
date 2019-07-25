import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import Card from "../components/Card.js";
import Header from "../components/Header.js";
import { Ionicons } from "@expo/vector-icons";
import * as firebase from "firebase";
import Colors from "../constants/Colors";
import Time from "../constants/Time";

// Converts timestamp date into "[day of week], [month] [date]" (e.g. "Monday, February 1")
function getDayString(date) {
  let timezoneDate = new Date(date);
  timezoneDate.setHours(timezoneDate.getHours() + Time.offset);
  return `${Time.daysOfWeek[timezoneDate.getDay()]}, ${Time.months[timezoneDate.getMonth()]} ${timezoneDate.getDate()}`;
}

// Sorts array of objects with date parameter by date
function sortByDates(arr) {
  arr.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  })
}

// Creates and renders the home screen, which contains all current and future orders and buttons to navigate to the
// order and settings screens
export default class HomeScreen extends React.Component {
  // Page is re-rendered when state is changed
  state = {
    orders: [], // Will contain objects representing sandwich orders, sorted by date (ascending) -- to be populated by Firebase data
    refreshing: false, // Whether or not page is refreshing (reloading orders)
    loading: false // Whether or not page is loading (navigating to different page or completing an action)
  };

  // Sets this.state.loading to isLoading
  load = (isLoading) => this.setState({ loading: isLoading });

  // Queries orders from Firebase and stores them in this.state.orders
  getOrders = () => {
    this.setState({ refreshing: true });
    let orders = []; // Initializes empty array to add valid orders to
    // Queries orders from Firebase
    firebase.firestore()
      .collection("orders")
      .doc(firebase.auth().currentUser.uid)
      .collection("myOrders")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let order = this.formatOrder(doc.data(), doc.id);
          // If order is today or later, adds order to orders array
          if (order.date.getDate() >= (new Date()).getDate()) {
            orders.push(order);
          }
        });
        sortByDates(orders);
        this.setState({ orders, refreshing: false }); // Stores orders in this.state.order
      });
  };

  // Formats order (Firebase doc) into object containing strings to display in Cards
  formatOrder(order, id) {
    let ingredients = this.formatIngredients(order);
    let date = getDayString(order.date.toDate());
    return { dateString: date, ingredients, date: order.date.toDate(), key: id };
  }

  // Combines separate ingredient fields into array containing print-ready ingredients
  formatIngredients(order) {
    let ingredients = [];

    ingredients.push(order.bread.charAt(0).toUpperCase() + order.bread.slice(1)); // Capitalize first character of first element
    order.meat.map((meat) => ingredients.push(meat.toLowerCase()));
    order.cheese.map((cheese) => ingredients.push(cheese.toLowerCase()));
    order.condiments.map((condiment) => ingredients.push(condiment.toLowerCase()));
    order.extras.map((extra) => ingredients.push(extra.toLowerCase()));

    return ingredients;
  }

  // Signs user out and returns to Login screen
  signOut = () => firebase.auth().signOut().then(() => {
    let resetAll = this.props.navigation.getParam("resetAll", null);
    if (resetAll) resetAll();
    this.props.navigation.navigate("Login");
  }).catch(error => this.setState({ errorMessage: error.message }));

  // Loads orders when page is first rendered
  componentDidMount() {
    this.getOrders();
  }

  // Renders home screen
  render() {
    const { width } = Dimensions.get("window");
    let headerMessage = this.state.orders.length === 0 ? "There are no orders to display." : ""; // Displays message if there are no orders
    let loadingStyle = {
      backgroundColor: "transparent",
      paddingBottom: 10
    };
    // Collapses loading container if page is not loading
    if (!this.state.loading) {
      loadingStyle.height = 0;
      loadingStyle.paddingBottom = 0;
    }
    return (
      <SafeAreaView style={{ alignContent: "center" }}>
        <Header title={"My Orders"} bigButton={true} buttons={[
          (
            <TouchableOpacity
              key={"logOut"}
              onPress={this.signOut}
              style={styles.logOut}
            >
              <Ionicons name={`${Platform.OS === "ios" ? "ios" : "md" }-log-out`} size={35} color={"#000"} />
            </TouchableOpacity>
          ),
          (
            <TouchableOpacity
              key={"settings"}
              style={styles.settingsCog}
              onPress={() => this.props.navigation.navigate("Settings")}
            >
              <Ionicons name={`${Platform.OS === "ios" ? "ios" : "md"}-settings`} size={35} color={"#000"} />
            </TouchableOpacity>
          )
        ]} />
        <View style={Platform.OS === "ios" ? { zIndex: 1000 } : {}}>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate(
              "Order",
              { getOrders: this.getOrders, data: null, prevOrders: this.state.orders }
            )
          }} activeOpacity={0.5} style={[styles.placeOrderButton, { width: width - 110 }]}>
            <Text style={styles.placeOrderButtonText}>
              Place an order
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getOrders}
            />
          }
          ListHeaderComponent={
            <View>
              <ActivityIndicator size={"large"} style={loadingStyle} animating={this.state.loading} />
              <Text style={headerMessage.length > 0 ? styles.text : { height: 0 }}>{headerMessage}</Text>
            </View>
          }
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={this.state.orders}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card
              date={item.dateString}
              id={item.key}
              navigate={this.props.navigation.navigate}
              prevOrders={this.state.orders}
              name={item.name}
              ingredients={item.ingredients}
              getOrders={this.getOrders}
              load={this.load}
            />
          )}
        />
      </SafeAreaView>
    );
  }
}

// Styles for home screen
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.containerBackground,
    height: "100%"
  },
  contentContainer: {
    paddingTop: 65.0 / 2 + 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 80 : 115
  },
  placeOrderButton: {
    backgroundColor: Colors.accentColor,
    width: 100,
    height: 65,
    borderRadius: 75 / 2,
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
    top: -65.0 / 2,
    left: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 8,
    zIndex: 1000
  },
  placeOrderButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontFamily: "open-sans-extra-bold",
  },
  text: {
    fontFamily: "open-sans",
    fontSize: 18,
    textAlign: "center"
  },
  settingsCog: {
    position: "absolute",
    top: 5,
    right: 20
  },
  logOut: {
    position: "absolute",
    top: 5,
    left: 20,
    transform: [
      { scaleX: -1 }
    ]
  }
});