/**
 * @file Manages constants for app layout
 * @author Emily Sturman <emily@sturman.org>
 */
import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
const Layout = {
  // Window dimensions
  window: {
    width,
    height,
  },
  // Whether device is "small" (should display more condensed UI)
  isSmallDevice: width < 375,
  // Whether device is iOS
  ios: Platform.OS === "ios",
  // Dimensions for place order button (on Home Screen)
  placeOrderButton: {
    height: 65.0,
    horizontalPadding: 110.0
  },
  // Font sizes
  fonts: {
    icon: 34,
    header: 24,
    title: 20,
    body: 18,
    mainTitle: 30,
    tiny: 12
  }
};

export default Layout;