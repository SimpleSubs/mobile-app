import React from "react";
import {
  View,
  Text,
  StyleSheet
} from "react-native";
import AnimatedTouchable from "./AnimatedTouchable";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

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
    backgroundColor: Colors.backgroundColor,
    padding: 15,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    marginBottom: 5,
    color: Colors.primaryText
  },
  date: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.body,
    color: Colors.primaryText
  },
  ingredients: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.primaryText
  }
});