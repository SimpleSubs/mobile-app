import React from "react";
import {
  View,
  Text,
  StyleSheet
} from "react-native";
import AnimatedTouchable from "./AnimatedTouchable";

const Card = ({ title, date, ingredients, onPress }) => (
  <AnimatedTouchable onPress={onPress}>
    <View style={styles.cardContainer}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.ingredients} numberOfLines={title ? 1 : 2} >{ingredients}</Text>
    </View>
  </AnimatedTouchable>
);

export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 5,
    backgroundColor: "#fff",
    padding: 15,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: 16,
    marginBottom: 5
  },
  date: {
    fontFamily: "josefin-sans-bold",
    fontSize: 14
  },
  ingredients: {
    fontFamily: "josefin-sans",
    fontSize: 14
  }
});