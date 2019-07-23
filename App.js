import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  YellowBox
} from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBIV-fwIGwS9sNbGxHH_kCTbx_BbpAJC2s",
  authDomain: "sandwich-orders.firebaseapp.com",
  databaseURL: "https://sandwich-orders.firebaseio.com",
  storageBucket: "sandwich-orders.appspot.com",
  projectId: "sandwich-orders"
};

firebase.initializeApp(firebaseConfig);

YellowBox.ignoreWarnings(["Setting a timer for a long period of time, i.e. multiple minutes, is a performance and " +
  "correctness issue on Android as it keeps the timer module awake, and timers can only be called when the app is in " +
  "the foreground. See https://github.com/facebook/react-native/issues/12981 for more info."]);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
        "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
        "open-sans-extra-bold": require("./assets/fonts/OpenSans-ExtraBold.ttf"),
        "open-sans-italic": require("./assets/fonts/OpenSans-Italic.ttf"),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
