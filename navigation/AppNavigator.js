import React from "react";
import {
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import HomeScreen from "../screens/HomeScreen";
import OrderScreen from "../screens/OrderScreen";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SettingsScreen from "../screens/SettingsScreen";

// Handles user navigation between pages
const MainNavigator = createStackNavigator(
  {
    Loading: { screen: LoadingScreen },
    Login: { screen: LoginScreen },
    Register: { screen: RegisterScreen },
    Home: { screen: HomeScreen },
    Order: { screen: OrderScreen },
    Settings: { screen: SettingsScreen },
  },
  {
    initialRouteName: "Loading",
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

export default createAppContainer(MainNavigator);