import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  NativeModules,
  LayoutAnimation
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createStyleSheet, { getColors } from "../../constants/Colors";
import { InputTypes } from "../../constants/Inputs";
import Layout from "../../constants/Layout";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);
// Duration of dropdown animation
const DURATION = 100;

const getTransformationStyle = (animated) => {
  const interpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ["90deg", "0deg"],
  });
  return { transform: [{ rotate: interpolation }] }
};

const toggleAnimation = (expanded, changeExpanded, minHeight, maxHeight, setHeight, angleAnimated) => {
  LayoutAnimation.spring();
  setHeight(expanded ? minHeight : minHeight + maxHeight);
  angleAnimated.setValue(expanded ? 1 : 0);
  Animated.timing(angleAnimated, {
    toValue: expanded ? 0 : 1,
    duration: DURATION,
    useNativeDriver: true
  }).start();
  changeExpanded(!expanded);
};

const SecondaryTouchableText = ({ type, selectedValue, style }) => {
  const themedStyles = createStyleSheet(styles);
  switch (type) {
    case InputTypes.PICKER:
      return <Text style={themedStyles.selectedItem} numberOfLines={1}>{selectedValue}</Text>;
    case InputTypes.TEXT_INPUT:
    case InputTypes.CHECKBOX:
      return (
        <View style={themedStyles.arrowContainer}>
          <AnimatedIonicons
            name={"chevron-down"}
            size={Layout.fonts.title}
            color={getColors().primaryText}
            style={[themedStyles.dropdownArrow, style]}
          />
        </View>
    );
    default:
      return null
  }
};

/**
 * Renders touchable and animated dropdown.
 */
const AnimatedDropdown = ({ title, type, selectedValue = "", changeValue = () => {}, options = [], children }) => {
  const [expanded, changeExpanded] = React.useState(false);
  const [minHeight, setMinHeight] = React.useState(57.5);
  const [maxHeight, setMaxHeight] = React.useState(minHeight);
  const [height, setHeight] = React.useState();
  const angleAnimated = React.useRef(new Animated.Value(0)).current;

  const themedStyles = createStyleSheet(styles);

  const onPressTouchable = () => {
    if (type === InputTypes.PICKER && options.length > 0 && !options.includes(selectedValue)) {
      changeValue(options[0]);
    }
    toggleAnimation(expanded, changeExpanded, minHeight, maxHeight, setHeight, angleAnimated);
  };

  return (
    <View style={[themedStyles.container, height ? { height } : {}]}>
      <TouchableOpacity
        style={themedStyles.touchable}
        onLayout={({ nativeEvent }) => {
          setMinHeight(nativeEvent.layout.height);
          setHeight(nativeEvent.layout.height);
        }}
        onPress={onPressTouchable}
      >
        <Text style={themedStyles.touchableText}>{title}</Text>
        <SecondaryTouchableText
          type={type}
          selectedValue={selectedValue}
          style={getTransformationStyle(angleAnimated)}
        />
      </TouchableOpacity>
      <View onLayout={({ nativeEvent }) => setMaxHeight(nativeEvent.layout.height)}>
        {children}
      </View>
    </View>
  )
};

export default AnimatedDropdown;

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.backgroundColor,
    overflow: "hidden"
  },
  touchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20
  },
  touchableText: {
    fontSize: Layout.fonts.title,
    fontFamily: "josefin-sans",
    color: Colors.primaryText,
    flex: 1
  },
  selectedItem: {
    fontSize: Layout.fonts.title,
    fontFamily: "josefin-sans",
    color: Colors.secondaryText,
    textAlign: "right"
  },
  dropdownArrow: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 3
  },
  arrowContainer: {
    paddingLeft: 20
  }
});