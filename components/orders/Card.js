import React from "react";
import {
  View,
  Text,
  Animated
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "../AnimatedTouchable";
import Layout from "../../constants/Layout";
import createStyleSheet, { getColors } from "../../constants/Colors";

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const isString = (val) => typeof val === "string";

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

const SwipeAction = ({ progress, icon, alignRight }) => {
  const themedStyles = createStyleSheet(styles);
  const scaleInterpolation = progress.interpolate({
    inputRange: [0, 0.15],
    outputRange: [0.5, 1],
    extrapolate: "clamp"
  })
  return (
    <View style={[themedStyles.swipeAction, alignRight && themedStyles.swipeActionRight]}>
      <AnimatedIonicons
        name={`${icon}`}
        size={Layout.fonts.icon}
        color={getColors().primaryText}
        style={{ transform: [{ scale: scaleInterpolation }]}}
      />
    </View>
  );
}

const Card = ({ title, date, data, onPress, onDelete, ...ingredients }) => {
  const swipeableRef = React.useRef();
  const themedStyles = createStyleSheet(styles);

  const focusAndClose = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    onPress();
  };

  const CardSection = ({ title, date, ingredients }) => (
    <>
      {date && <Text style={themedStyles.smallerDate}>{date}</Text>}
      {title && <Text style={themedStyles.title}>{title}</Text>}
      <Text style={themedStyles.ingredients} numberOfLines={title ? 1 : 2}>{getIngredientStr(ingredients)}</Text>
    </>
  );

  return (
    <Swipeable
      ref={(ref) => swipeableRef.current = ref}
      leftThreshold={50}
      rightThreshold={50}
      renderLeftActions={(progress) => (
        <SwipeAction progress={progress} icon={"create-outline"} />
      )}
      renderRightActions={(progress) => (
        <SwipeAction progress={progress} icon={"trash-outline"} alignRight />
      )}
      onSwipeableLeftOpen={focusAndClose}
      onSwipeableRightOpen={onDelete}
    >
      <AnimatedTouchable onPress={onPress}>
        <View style={themedStyles.cardContainer}>
          <Text style={themedStyles.date}>{date}</Text>
          {data ?
            data.map(({ date, title, key, ...ingredients }) => (
              <CardSection key={key} date={date} title={title} ingredients={ingredients} />
            )) : <CardSection title={title} ingredients={ingredients} />
          }
        </View>
      </AnimatedTouchable>
    </Swipeable>
  );
}

export default Card;

const styles = (Colors) => ({
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
    fontSize: Layout.fonts.body,
    marginBottom: 5,
    color: Colors.primaryText
  },
  date: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    color: Colors.primaryText,
    marginBottom: 5
  },
  smallerDate: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.body,
    color: Colors.primaryText,
    marginBottom: 5,
    marginTop: 10
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