import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from 'react-navigation';
import HomeScreen from "../screens/HomeScreen";
import OrderScreen from "../screens/OrderScreen";

import MainTabNavigator from './MainTabNavigator';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Order: {screen: OrderScreen}
});

const App = createAppContainer(MainNavigator);
export default App

/*
export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
}));
*/