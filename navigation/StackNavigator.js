import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import OrderScreen from "../screens/OrderScreen";

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const MainStackScreen = () => (
  <MainStack.Navigator headerMode={"none"}>
    <MainStack.Screen name={"Login"} component={LoginScreen} />
    <MainStack.Screen name={"Register"} component={RegisterScreen} />
    <MainStack.Screen name={"Home"} component={HomeScreen} />
    <MainStack.Screen name={"Settings"} component={SettingsScreen} />
  </MainStack.Navigator>
);

const StackNavigator = ({ containerRef, initialState }) => (
  <NavigationContainer ref={containerRef} initialState={initialState}>
    <RootStack.Navigator headerMode={"none"} mode={"modal"}>
      <RootStack.Screen name={"Main"} component={MainStackScreen} />
      <RootStack.Screen name={"Order"} component={OrderScreen} />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default StackNavigator;