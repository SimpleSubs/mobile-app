/**
 * @file Manages entire RN Expo app.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import * as Sentry from "sentry-expo";
import { Ionicons } from "@expo/vector-icons";
import Modal from "./components/modals/Modal";
import InfoModal from "./components/modals/InfoModal";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import sandwichApp from "./redux/Reducers";
import StackNavigator from "./navigation/StackNavigator";
import Colors from "./constants/Colors";
import Layout from "./constants/Layout";

// Only import if not in web (LogBox doesn't exist in web)
const { LogBox } = !Layout.web ? require("react-native") : { LogBox: null };

// Initialize Sentry for error reporting/management
Sentry.init({
  "dsn": "https://b94b0a4a89a6438591f3c5aa07dca44d@o327609.ingest.sentry.io/1838264",
  "enableInExpoDevelopment": true,
  "debug": false
});

// Ignore recurring "cycle" warning and Firebase timer error on Android
LogBox?.ignoreLogs(
  [
    "Require cycle: components/modals/InputModal.js -> components/userFields/UserInputsList.js -> constants/DataActions.js -> components/modals/InputModal.js",
    "Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android as it keeps the timer module awake, and timers can only be called when the app is in the foreground. See https://github.com/facebook/react-native/issues/12981 for more info."
  ]
);

// Overrides slight delay when pressing TouchableOpacity
TouchableOpacity.defaultProps = { delayPressIn: 0 };

// Creates store for Redux state management
const store = createStore(sandwichApp, applyMiddleware(thunk));

/**
 * Renders entire RN app.
 * @param {boolean} skipLoadingScreen Whether app should ignore loading screen.
 * @return {React.ReactElement|null} Element to render.
 * @constructor
 */
const App = ({ skipLoadingScreen }) => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
      try {
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "josefin-sans": require("./assets/fonts/JosefinSans-Light.ttf"),
          "josefin-sans-bold": require("./assets/fonts/JosefinSans-Bold.ttf")
        });
      } catch (e) {
        console.warn(e);
        // Report error to Sentry
        if (Layout.web) {
          Sentry.Browser.captureException(e);
        } else {
          Sentry.Native.captureException(e);
        }
      } finally {
        setLoadingComplete(true);
        await SplashScreen.hideAsync();
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  // Renders nothing if app is still loading (and loading screen isn't skipped)
  if (!isLoadingComplete && !skipLoadingScreen) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <View style={styles.container}>
            {Layout.ios && <StatusBar barStyle={Colors.statusBar} />}
            <StackNavigator />
            <InfoModal />
            <Modal />
          </View>
        </Provider>
      </SafeAreaProvider>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
});
