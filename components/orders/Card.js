/**
 * @file Creates card to display an order on home screen.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "../AnimatedTouchable";
import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

/**
 * Determines if provided input is a string.
 *
 * @param {*} val Input to be checked.
 * @return {boolean} Whether input is a string.
 */
const isString = (val) => typeof val === "string";

/**
 * Combines all ingredients into one string.
 *
 * Combines string and array ingredient values into one comma-separated
 * string with a capital first character.
 *
 * @param {Object<string, string|string[]>} ingredients Ingredient category mapped to selected value(s).
 *
 * @return {string} Comma-separated string containing all ingredients in order.
 */
export const getIngredientStr = (ingredients) => {
  let allIngredients = []
  for (let category in ingredients) {
    if (ingredients.hasOwnProperty(category)) {
      let ingredient = ingredients[category];
      if (ingredient.length > 0) {
        if (isString(ingredient)) {
          allIngredients.push(ingredient);
        } else {
          allIngredients.push(ingredient.join(", "));
        }
      }
    }
  }
  let ingredientStr = allIngredients.join(", ");
  return ingredientStr.charAt(0).toUpperCase() + ingredientStr.slice(1).toLowerCase();
}

/**
 * Returns icon rendered on card swipe.
 *
 * Renders icon that scales based on drag position; may either be trash icon (swipe right)
 * or create icon (swipe left).
 *
 * @param {Animated.AnimatedInterpolation} progress   How far the card has been dragged.
 * @param {string}                         icon       Name of icon to be rendered.
 * @param {boolean}                        alignRight Whether icon should be rendered on right (true for swipe right).
 *
 * @return {React.ReactElement} Icon to be rendered on card swipe.
 * @constructor
 */
const SwipeAction = ({ progress, icon, alignRight }) => {
  const scaleInterpolation = progress.interpolate({
    inputRange: [0, 0.15],
    outputRange: [0.5, 1],
    extrapolate: "clamp"
  })
  return (
    <View style={[styles.swipeAction, alignRight && styles.swipeActionRight]}>
      <AnimatedIonicons
        name={`md-${icon}`}
        size={Layout.fonts.icon}
        color={Colors.primaryText}
        style={{ transform: [{ scale: scaleInterpolation }]}}
      />
    </View>
  );
}

/**
 * Renders card to display orders.
 *
 * Renders a card displaying the title (for named orders), date, and ingredients of an
 * order. Card may be swiped right to delete or swiped left/clicked to edit.
 *
 * @param {string}                          [title]     Title of order (for preset orders only).
 * @param {string}                          date        Date of order (formatted as "dddd, MMMM Do").
 * @param {Function}                        onPress     Function to execute when card is pressed (usually focuses order).
 * @param {Function}                        onDelete    Function to delete order.
 * @param {Object<string, string|string[]>} ingredients All order ingredients.
 *
 * @return {React.ReactElement} Card displaying sandwich order.
 * @constructor
 */
const Card = ({ title, date, onPress, onDelete, ...ingredients }) => {
  const swipeableRef = useRef();

  const focusAndClose = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    onPress();
  }

  return (
    <Swipeable
      ref={(ref) => swipeableRef.current = ref}
      leftThreshold={50}
      rightThreshold={50}
      renderLeftActions={(progress) => <SwipeAction progress={progress} icon={"create"}/>}
      renderRightActions={(progress) => <SwipeAction progress={progress} icon={"trash"} alignRight />}
      onSwipeableLeftOpen={focusAndClose}
      onSwipeableRightOpen={onDelete}
    >
      <AnimatedTouchable onPress={onPress}>
        <View style={styles.cardContainer}>
          <Text style={styles.date}>{date}</Text>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.ingredients} numberOfLines={title ? 1 : 2}>{getIngredientStr(ingredients)}</Text>
        </View>
      </AnimatedTouchable>
    </Swipeable>
  );
}

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
    color: Colors.primaryText,
    marginBottom: 5
  },
  ingredients: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.primaryText
  },
  swipeAction: {
    backgroundColor: "transparent",
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  swipeActionRight: {
    alignItems: "flex-end"
  }
});