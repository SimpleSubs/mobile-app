import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";
import { getIngredientStr } from "./Card";
import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

/**
 * Returns icon rendered on card swipe to the right.
 *
 * Renders red banner that slides with card and trash icon that scales with swipe.
 *
 * @param {Animated.AnimatedInterpolation} progress How far the card has been dragged (1 = all the way, 0 = not at all).
 * @param {Animated.AnimatedInterpolation} dragX    How far the card has been dragged (pixels).
 *
 * @return {React.Element} Banner to be rendered on card swipe.
 * @constructor
 */
const SwipeActionRight = (progress, dragX) => {
  const slideInterpolation = dragX.interpolate({
    inputRange: [-10, 0],
    outputRange: [Layout.window.width - 10, Layout.window.width]
  })
  const scaleInterpolation = progress.interpolate({
    inputRange: [0, 0.15],
    outputRange: [0.25, 1],
    extrapolate: "clamp"
  })
  return (
    <Animated.View style={[styles.swipeActionRight, { transform: [{ translateX: slideInterpolation }]}]}>
      <AnimatedIonicons
        name={"md-trash"}
        size={Layout.fonts.icon}
        color={Colors.primaryText}
        style={{ transform: [{ scale: scaleInterpolation }]}}
      />
      <Text style={styles.swipeText}>Delete preset</Text>
    </Animated.View>
  );
};

/**
 * Returns icon rendered on card swipe to the left.
 *
 * Renders green banner that slides with card and create icon that scales with swipe.
 *
 * @param {Animated.AnimatedInterpolation} progress How far the card has been dragged (1 = all the way, 0 = not at all).
 * @param {Animated.AnimatedInterpolation} dragX    How far the card has been dragged (pixels).
 *
 * @return {React.Element} Banner to be rendered on card swipe.
 * @constructor
 */
const SwipeActionLeft = (progress, dragX) => {
  const slideInterpolation = dragX.interpolate({
    inputRange: [0, 10],
    outputRange: [-Layout.window.width, -Layout.window.width + 10]
  })
  const scaleInterpolation = progress.interpolate({
    inputRange: [0, 0.15],
    outputRange: [0.25, 1],
    extrapolate: "clamp"
  })
  return (
    <Animated.View style={[styles.swipeActionLeft, { transform: [{ translateX: slideInterpolation }]}]}>
      <AnimatedIonicons
        name={"md-create"}
        size={Layout.fonts.icon}
        color={Colors.primaryText}
        style={{ transform: [{ scale: scaleInterpolation }]}}
      />
      <Text style={styles.swipeText}>Edit preset</Text>
    </Animated.View>
  );
};

/**
 * Renders card to display preset.
 *
 * Renders a card displaying the title and ingredients of a preset.
 * Card may be swiped right to delete or swiped left/clicked to edit.
 *
 * @param {string}                          title       Title of the preset.
 * @param {Function}                        onPress     Function to execute when card is pressed (usually focuses preset).
 * @param {Function}                        onDelete    Function to delete preset.
 * @param {Object<string, string|string[]>} ingredients All order ingredients.
 *
 * @return {React.Element} Card displaying sandwich preset.
 * @constructor
 */
const PresetCard = ({ title, onPress, onDelete, ...ingredients }) => {
  const swipeableRef = useRef();
  const focusAndClose = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    onPress();
  };
  return (
    <Swipeable
      ref={(ref) => swipeableRef.current = ref}
      renderRightActions={SwipeActionRight}
      renderLeftActions={SwipeActionLeft}
      onSwipeableRightOpen={onDelete}
      onSwipeableLeftOpen={focusAndClose}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={styles.cardContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.ingredients} numberOfLines={2}>{getIngredientStr(ingredients)}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

export default PresetCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.cardColor,
    paddingVertical: 30,
    paddingLeft: 30,
    paddingRight: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    marginBottom: 10,
    color: Colors.primaryText
  },
  ingredients: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.primaryText
  },
  swipeActionRight: {
    backgroundColor: Colors.errorText,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    flexDirection: "row"
  },
  swipeActionLeft: {
    backgroundColor: Colors.okAction,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    flexDirection: "row-reverse"
  },
  swipeText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.body,
    color: Colors.textOnBackground,
    marginHorizontal: 40
  }
});