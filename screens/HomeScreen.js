import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import Card from "../other/Card.js";

const ACCENT_COLOR = "#ffd541";
const ACCENT_COLOR_DARK = "#bb9834";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const screenWidth = Dimensions.get("window").width;
    return (
      <SafeAreaView style={{ alignContent: "center" }}>
        <View
          style={[styles.header, { width: screenWidth, paddingBottom: screenWidth * 0.05 }]}>
          <Text style={styles.title}>My Orders</Text>
        </View>
        <View style={{ zIndex: 1000 }}>
          <View style={[styles.placeOrderButton, {backgroundColor: ACCENT_COLOR_DARK, width: screenWidth - 110}]}>
            <Text style={[styles.placeOrderButtonText, {opacity: 0.5}]}>Place an order</Text>
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Order")}>
            <View style={[styles.placeOrderButton, {width: screenWidth - 110}]}>
              <Text style={styles.placeOrderButtonText}>
                Place an order
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
          <Card date="Monday, February 9th" name="The Usual" ingredients={["Dutch crunch", "ham", "swiss cheese", "lettuce", "tomato"]} />
          <Card date="Tuesday, February 10th" name="The Usual" ingredients={["Dutch crunch", "ham", "swiss cheese", "lettuce", "tomato"]} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// TODO: Add box shadow for android (shadow props only support iOS)
const styles = StyleSheet.create({
  container: {
    paddingTop: 65 / 2 + 20,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    height: "100%",
  },
  header: {
    zIndex: 999,
    backgroundColor: "#fff",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 30,
    marginLeft: "auto",
    marginRight: "auto",
  },
  placeOrderButton: {
    backgroundColor: ACCENT_COLOR,
    width: 100,
    height: 65,
    borderRadius: 75 / 2,
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
    top: -65 / 2,
    left: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  placeOrderButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontFamily: "open-sans-extra-bold",
  },
  date: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  }
});