import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform
} from "react-native";

export default class Header extends React.Component {
  render() {
    const screenWidth = Dimensions.get("window").width;
    let height = this.props.bigButton ? 30 : 0;
    return (
      <View style={[styles.header, { width: screenWidth, paddingBottom: screenWidth * 0.05 }]}>
        <Text style={[styles.title, { marginBottom: height }]}>{this.props.title}</Text>
        {this.props.buttons}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 0,
    zIndex: 999,
    backgroundColor: "#fff",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 8
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  backButton: {
    position: "absolute",
    top: 5,
    left: 20
  }
});