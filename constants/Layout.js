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
  },
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