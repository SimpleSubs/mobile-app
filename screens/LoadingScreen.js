import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import * as firebase from "firebase";

export default class LoadingScreen extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      let loading = user !== null;
      this.props.navigation.navigate("Login", { loading: loading });
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading</Text>
        <ActivityIndicator size="large" style={styles.loadingIndicator} />
      </View>
    )
  }
}

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