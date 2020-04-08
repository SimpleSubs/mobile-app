import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get("window");

const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  ios: Platform.OS === "ios",
  placeOrderButton: {
    height: 65.0,
    horizontalPadding: 110.0
  }
};

export default Layout;