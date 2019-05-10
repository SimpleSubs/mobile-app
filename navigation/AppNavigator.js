import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from 'react-navigation';
import HomeScreen from "../screens/HomeScreen";
import OrderScreen from "../screens/OrderScreen";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SettingsScreen from "../screens/SettingsScreen";

const MainNavigator = createStackNavigator(
  {
    Loading: {screen: LoadingScreen},
    Login: {screen: LoginScreen},
    Register: {screen: RegisterScreen},
    Home: {screen: HomeScreen},
    Order: {screen: OrderScreen},
    Settings: {screen: SettingsScreen},
  },
  {
    initialRouteName: "Loading",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

const App = createAppContainer(MainNavigator);
export default App

/*
export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
}));
*/