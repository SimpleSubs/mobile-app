import React from "react";
import {
  StatusBar,
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
import { Provider } from "react-redux";
import store from "./redux/Store";
import StackNavigator from "./navigation/StackNavigator";
import createStyleSheet, { getColors } from "./constants/Colors";
import Layout from "./constants/Layout";

// Only import if not in web (LogBox doesn't exist in web)
const { LogBox } = !Layout.web ? require("react-native") : { LogBox: null };

// Initialize Sentry for error reporting/management
Sentry.init({
  "dsn": "https://b94b0a4a89a6438591f3c5aa07dca44d@o327609.ingest.sentry.io/1838264",
  "enableInExpoDevelopment": false,
  "debug": false
});

// Ignore recurring "cycle" warning and Firebase timer error on Android
LogBox?.ignoreLogs(
  [
    "Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android as it keeps the timer module awake, and timers can only be called when the app is in the foreground. See https://github.com/facebook/react-native/issues/12981 for more info.",
    "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"
  ]
);

// Overrides slight delay when pressing TouchableOpacity
TouchableOpacity.defaultProps = { delayPressIn: 0 };

const App = ({ skipLoadingScreen }) => {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const themedStyles = createStyleSheet(styles);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
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
          <View style={themedStyles.container}>
            {Layout.ios && <StatusBar barStyle={getColors().statusBar} />}
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

const styles = () => ({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
});
