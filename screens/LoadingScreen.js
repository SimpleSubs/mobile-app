import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import * as firebase from "firebase";

// Creates and renders loading screen, which will either navigate the user to login or home
export default class LoadingScreen extends React.Component {
  // Checks if user is logged in
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      let loading = user !== null;
      this.props.navigation.navigate("Login", { loading: loading });
    })
  }

  // Renders loading screen
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading</Text>
        <ActivityIndicator size={"large"} style={styles.loadingIndicator} />
      </View>
    )
  }
}

// Styles for loading screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontFamily: "open-sans",
    fontSize: 20
  },
  loadingIndicator: {
    padding: 10
  }
});