import React, { useRef } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";
import { getIngredientStr } from "./Card";
import Layout from "../../constants/Layout";
import createStyleSheet, { getColors } from "../../constants/Colors";

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const SwipeActionRight = ({ progress, dragX, themedStyles }) => {
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
    <Animated.View style={[themedStyles.swipeActionRight, { transform: [{ translateX: slideInterpolation }]}]}>
      <AnimatedIonicons
        name={"trash-outline"}
        size={Layout.fonts.icon}
        color={getColors().color}
        style={{ transform: [{ scale: scaleInterpolation }]}}
      />
      <Text style={themedStyles.swipeText}>Delete preset</Text>
    </Animated.View>
  );
};

const SwipeActionLeft = ({ progress, dragX, themedStyles }) => {
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
    <Animated.View style={[themedStyles.swipeActionLeft, { transform: [{ translateX: slideInterpolation }]}]}>
      <AnimatedIonicons
        name={"md-create"}
        size={Layout.fonts.icon}
        color={getColors().primaryText}
        style={{ transform: [{ scale: scaleInterpolation }]}}
      />
      <Text style={themedStyles.swipeText}>Edit preset</Text>
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
  const themedStyles = createStyleSheet(styles);
  
  const focusAndClose = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    onPress();
  };
  return (
    <Swipeable
      ref={(ref) => swipeableRef.current = ref}
      renderRightActions={(progress, dragX) => (
        <SwipeActionRight progress={progress} dragX={dragX} themedStyles={themedStyles} />
      )}
      renderLeftActions={(progress, dragX) => (
        <SwipeActionLeft progress={progress} dragX={dragX} themedStyles={themedStyles} />
      )}
      onSwipeableRightOpen={onDelete}
      onSwipeableLeftOpen={focusAndClose}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={themedStyles.cardContainer}>
          {title && <Text style={themedStyles.title}>{title}</Text>}
          <Text style={themedStyles.ingredients} numberOfLines={2}>{getIngredientStr(ingredients)}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

export default PresetCard;

const styles = (Colors) => ({
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