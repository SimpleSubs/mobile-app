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
import Card from "../other/Card.js";
import Header from "../other/Header.js";
import { Ionicons } from "@expo/vector-icons";
import * as firebase from "firebase";
import Colors from "../constants/Colors";
import Time from "../constants/Time";

function getDayString(date) {
  let timezoneDate = new Date(date);
  timezoneDate.setHours(timezoneDate.getHours() + Time.offset);
  return `${Time.daysOfWeek[timezoneDate.getDay()]}, ${Time.months[timezoneDate.getMonth()]} ${timezoneDate.getDate()}`;
}

function sortByDates(arr) {
  arr.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  })
}

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      refreshing: false,
      loading: false
    };
    this.getOrders = this.getOrders.bind(this);
    this.load = this.load.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  load(isLoading) {
    this.setState({ loading: isLoading });
  }

  getOrders() {
    this.setState({ refreshing: true });
    let orders = [];
    firebase.firestore()
      .collection("orders")
      .doc(firebase.auth().currentUser.uid)
      .collection("myOrders")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let order = this.formatOrder(doc.data(), doc.id);
          if (order.date.getDate() >= (new Date()).getDate()) {
            orders.push(order);
          }
        });
        sortByDates(orders);
        this.setState({ orders, refreshing: false });
      });
  }

  formatOrder(order, id) {
    let ingredients = this.formatIngredients(order);
    let date = getDayString(order.date.toDate());
    return { dateString: date, ingredients, date: order.date.toDate(), key: id };
  }

  formatIngredients(order) {
    let ingredients = [];

    ingredients.push(order.bread.charAt(0).toUpperCase() + order.bread.slice(1));
    order.meat.map((meat) => ingredients.push(meat.toLowerCase()));
    order.cheese.map((cheese) => ingredients.push(cheese.toLowerCase()));
    order.condiments.map((condiment) => ingredients.push(condiment.toLowerCase()));
    order.extras.map((extra) => ingredients.push(extra.toLowerCase()));

    return ingredients;
  }

  signOut() {
    firebase.auth().signOut().then(() => {
      let resetAll = this.props.navigation.getParam("resetAll", null);
      if (resetAll) resetAll();
      this.props.navigation.navigate("Login");
    }).catch(error => this.setState({ errorMessage: error.message }));
  }

  componentDidMount() {
    this.getOrders();
  }

  render() {
    const { width } = Dimensions.get("window");
    let headerMessage = this.state.orders.length === 0 ? "There are no orders to display." : "";
    let loadingStyle = {
      backgroundColor: "transparent",
      paddingBottom: 10
    };
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
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