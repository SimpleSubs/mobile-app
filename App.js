import React, { useState, useRef, useEffect } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import InfoModal from "./components/modals/InfoModal";

import useLinking from "./navigation/useLinking";
import StackNavigator from "./navigation/StackNavigator";

import Colors from "./constants/Colors";

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState();
  const [infoMessage, setInfoMessage] = useState("hello");
  const containerRef = useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

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

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle={Colors.statusBar} />}
        <StackNavigator containerRef={containerRef} initialState={initialNavigationState} />
        <InfoModal setInfoMessage={setInfoMessage} message={infoMessage} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
