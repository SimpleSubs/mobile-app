/**
 * @file Manages entire RN Expo app.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  LogBox
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import Modal from "./components/modals/Modal";
import InfoModal from "./components/modals/InfoModal";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import sandwichApp from "./redux/Reducers";
import useLinking from "./navigation/useLinking";
import StackNavigator from "./navigation/StackNavigator";
import Colors from "./constants/Colors";
import Layout from "./constants/Layout";

// Ignore recurring "cycle" warning
LogBox?.ignoreLogs(
  ["Require cycle: components/modals/InputModal.js -> components/userFields/UserInputsList.js -> constants/DataActions.js -> components/modals/InputModal.js"]
);

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
  const [initialNavigationState, setInitialNavigationState] = useState();
  const containerRef = useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();
        setInitialNavigationState(await getInitialState()); // Load our initial navigation state
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "josefin-sans": require("./assets/fonts/JosefinSans-Light.ttf"),
          "josefin-sans-bold": require("./assets/fonts/JosefinSans-Bold.ttf")
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
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
      <Provider store={store}>
        <View style={styles.container}>
          {Layout.ios && <StatusBar barStyle={Colors.statusBar} />}
          <StackNavigator containerRef={containerRef} initialState={initialNavigationState} />
          <InfoModal />
          <Modal />
        </View>
      </Provider>
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
