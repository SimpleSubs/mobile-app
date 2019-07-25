import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from "react-native";

// Creates and renders header
export default class Header extends React.Component {
  // Renders header
  render() {
    const { width } = Dimensions.get("window");
    let margin = this.props.bigButton ? 30 : 0; // Adjusts margin if "big button" (place order button) is present
    return (
      <View style={[styles.header, { width: width, paddingBottom: width * 0.05 }]}>
        <Text style={[styles.title, { marginBottom: margin }]}>{this.props.title}</Text>
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