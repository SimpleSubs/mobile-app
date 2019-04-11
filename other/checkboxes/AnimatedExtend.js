import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from "react-native";

export default class AnimatedExtend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: true,
      minHeight: 67.5,
      maxHeight: 0,
      expandValue: new Animated.Value(0)
    };
  }

  expand() {
    let initialValue = this.props.closed ? 0 : 1;
    let finalValue = this.props.closed ? 1 : 0;
    this.state.expandValue.setValue(initialValue);
    Animated.timing(
      this.state.expandValue,
      {
        toValue: finalValue,
        duration: 100,
        easing: Easing.linear,
      }
    ).start();
  }

  _setMaxHeight(event) {
    this.setState({maxHeight: event.nativeEvent.layout.height});
  }

  _setMinHeight(event) {
    this.setState({minHeight: event.nativeEvent.layout.height});
  }

  render() {
    const expand = this.state.expandValue.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.minHeight, this.state.minHeight + this.state.maxHeight]
    });
    return (
      <Animated.View style={[styles.container, {height: expand}]}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            this.props.handler();
            this.expand();
          }}
          onLayout={this._setMinHeight.bind(this)}
        >
          {this.props.touchable}
        </TouchableOpacity>
        <View onLayout={this._setMaxHeight.bind(this)}>
          {this.props.content}
        </View>
      </Animated.View>
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