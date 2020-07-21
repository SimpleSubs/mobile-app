import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  YellowBox,
  UIManager
} from "react-native";
import { SplashScreen } from "expo";
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

YellowBox.ignoreWarnings(
  ["Require cycle: components/modals/InputModal.js -> components/userFields/UserInputsList.js -> constants/DataActions.js -> components/modals/InputModal.js"]
);

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const store = createStore(sandwichApp, applyMiddleware(thunk));

const App = ({ skipLoadingScreen }) => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState();
  const containerRef = useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();
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
        SplashScreen.hide();
      }
    }
    loadResourcesAndDataAsync();
  }, []);

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
