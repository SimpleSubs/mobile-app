import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Easing,
  Platform
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AnimatedExtend from "./AnimatedExtend";

const ICON_SIZE = 30;
const AnimatedIonicon = Animated.createAnimatedComponent(Ionicons);

export default class AnimatedDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);
    this.state = {
      closed: true,
      minHeight: 67.5,
      maxHeight: 0,
      expandValue: new Animated.Value(0)
    };
    this.spin = this.spin.bind(this);
  }

  spin() {
    let value = 0;
    let toValue = 1;
    if (!this.state.closed) {
      value = 1;
      toValue = 0;
    }
    this.spinValue.setValue(value);
    Animated.timing(
      this.spinValue,
      {
        toValue: toValue,
        duration: 100,
        easing: Easing.linear,
      }
    ).start(() => {
      this.setState({closed: !this.state.closed});
    });
  }

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "-90deg"]
    });
    const DropdownTouchable = (
      <View style={{flexDirection: "row"}}>
        <Text style={[styles.touchableTitleText, {textAlign: "left"}]}>{this.props.title}</Text>
        <AnimatedIonicon
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            transform: [{rotate: spin}],
            marginLeft: "auto",
          }}
          size={ICON_SIZE}
          name={(Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-dropleft")}
        />
      </View>
    );
    return (
      <AnimatedExtend
        content={this.props.content}
        touchable={DropdownTouchable}
        handler={this.spin}
        closed={this.state.closed}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    overflow: "hidden"
  },
  touchable: {
    backgroundColor: "white",
    padding: 20,
  },
  touchableTitleText: {
    textAlign: "left",
    fontSize: 20,
    fontFamily: "open-sans",
  }
});