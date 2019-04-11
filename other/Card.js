import React from "react";
import {
  View,
  StyleSheet,
  Text,
} from "react-native";
import Touchable from "react-native-platform-touchable";

export default class Card extends React.Component {
  render() {
    return (
      <Touchable background={Touchable.Ripple("#bb9834", true)}
                 onPress={() => console.log("Touchable pressed")}
                 style={styles.cardContainer}>
        <View>
          <View style={{flexDirection: "row"}}>
            <View style={{flexDirection: "column"}}>
              <Text style={styles.date} numberOfLines={1} ellipsizeMode="tail">{this.props.date}</Text>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">"{this.props.name}"</Text>
            </View>
          </View>
          <Text style={styles.ingredients} numberOfLines={1} ellipsizeMode="tail">{this.props.ingredients.join(", ")}</Text>
        </View>
      </Touchable>
    );
  }
}

// TODO: Add box shadow for android (shadow props only support iOS)
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
    marginBottom: 20
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
    color: "#7c7c7c",
    fontSize: 18,
  }
});