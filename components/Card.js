import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import Colors from "../constants/Colors";

// Renders name of sandwich (functionality yet to be implemented)
// TODO: implement name functionality for sandwiches
function renderName(name) {
  if (!name) return null;
  return <Text style={styles.name} numberOfLines={1} ellipsizeMode={"tail"}>"{name}"</Text>
}

// Creates and renders card, which displays sandwich orders
export default class Card extends React.Component {
  // Opens order when card is selected and allows user to edit order
  openOrder = () => {
    this.props.load(true);
    firebase.firestore()
      .collection("orders")
      .doc(firebase.auth().currentUser.uid)
      .collection("myOrders")
      .doc(this.props.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.props.navigate("Order", {getOrders: this.props.getOrders, data: doc.data(), id: this.props.id});
          this.props.load(false);
        }
      });
  };

  // Renders card
  render() {
    return (
      <TouchableOpacity
        onPress={this.openOrder}
        style={styles.cardContainer}
      >
        <View>
          <View style={{flexDirection: "row"}}>
            <View style={{flexDirection: "column"}}>
              <Text style={styles.date} numberOfLines={1} ellipsizeMode="tail">{this.props.date}</Text>
              {renderName(this.props.name)}
            </View>
          </View>
          <Text style={styles.ingredients} numberOfLines={this.props.name ? 1 : 2} ellipsizeMode="tail">
            {this.props.ingredients.join(", ")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

// Styles for card
const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 2
    },
    shadowOpacity: 0.1,
    borderRadius: 4,
    shadowRadius: 4,
    marginBottom: 20,
    elevation: 4
  },
  date: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  },
  name: {
    fontFamily: "open-sans",
    fontSize: 18
  },
  ingredients: {
    fontFamily: "open-sans",
    color: Colors.secondaryText,
    fontSize: 18,
  }
});