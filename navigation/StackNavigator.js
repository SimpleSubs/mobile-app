/**
 * @file Manages app navigation.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";
import { watchAuthState } from "../redux/Actions";
import LoadingScreen from "../screens/main/LoadingScreen";
import LoginScreen from "../screens/main/unauthenticated/LoginScreen";
import RegisterScreen from "../screens/main/unauthenticated/register/RegisterScreen";
import DomainScreen from "../screens/main/unauthenticated/register/DomainScreen";
import UpdateUserScreen from "../screens/main/authenticated/UpdateUserScreen";
import HomeScreen from "../screens/main/authenticated/HomeScreen";
import SettingsScreen from "../screens/main/authenticated/SettingsScreen";
import UserSettingsScreen from "../screens/main/authenticated/UserSettingsScreen";
import OrderSettingsScreen from "../screens/main/authenticated/OrderSettingsScreen";
import PreOrderScreen from "../screens/order/PreOrderScreen";
import OrderScreen from "../screens/order/OrderScreen";
import PresetOrderScreen from "../screens/order/PresetOrderScreen";
import PresetScreen from "../screens/PresetScreen";

// Primary stack to display (home screen, login screen, etc.)
const MainStack = createStackNavigator();
// Stack for ordering (order preset, custom order, etc.)
const OrderStack = createStackNavigator();
// Stack for registering new user
const RegisterStack = createStackNavigator();
// Stack containing both stacks above, plus preset screen
const RootStack = createStackNavigator();

/**
 * Renders screens for main stack.
 *
 * Returns screens based on whether user is authenticated; login/register
 * if not, home/settings/etc. if so.
 *
 * @param {boolean} isSignedIn Whether user is authenticated.
 *
 * @return {React.ReactElement} Stack screens.
 * @constructor
 */
const MainStackScreen = ({ isSignedIn }) => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name={"Loading"} component={LoadingScreen} options={{ gestureEnabled: false }} />
    {!isSignedIn ? (
      <>
        <MainStack.Screen name={"Login"} component={LoginScreen} options={{ gestureEnabled: false }} />
      </>
    ) : (
      <>
        <MainStack.Screen name={"Update User"} component={UpdateUserScreen} />
        <MainStack.Screen name={"Home"} component={HomeScreen} />
        <MainStack.Screen name={"Settings"} component={SettingsScreen} />
        <MainStack.Screen name={"User Settings"} component={UserSettingsScreen} />
        <MainStack.Screen name={"Order Settings"} component={OrderSettingsScreen} />
      </>
    )}
  </MainStack.Navigator>
);

/**
 * Renders screens for order stack.
 *
 * Renders pre-order screen (i.e. screen that comes before order screens),
 * plus options for order screens.
 *
 * @return {React.ReactElement} Stack screens.
 * @constructor
 */
const OrderStackScreen = () => (
  <OrderStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name={"Preorder"} component={PreOrderScreen} />
    <MainStack.Screen name={"Custom Order"} component={OrderScreen} />
    <MainStack.Screen name={"Preset Order"} component={PresetOrderScreen} />
  </OrderStack.Navigator>
);

const RegisterStackScreen = () => (
  <RegisterStack.Navigator screenOptions={{ headerShown: false }}>
    <RegisterStack.Screen name={"Domain"} component={DomainScreen} />
    <RegisterStack.Screen name={"Register User"} component={RegisterScreen} />
  </RegisterStack.Navigator>
)

/**
 * Renders screens for root stack and main app navigator.
 *
 * Renders main stack, order stack, and preset screen.
 * Sub-stacks animate as standard screens, while the root
 * stack animates as fullscreen modals.
 *
 * @param {boolean} isSignedIn Whether user is authenticated.
 * @param {function()} watchAuthState Listener for changes in user authentication.
 *
 * @return {React.ReactElement} Navigation container with root stack.
 * @constructor
 */
const StackNavigator = ({ isSignedIn, watchAuthState }) => {
  useEffect(watchAuthState, []);
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false, presentation: "modal" }}>
        <RootStack.Screen name={"Main"}>
          {() => <MainStackScreen isSignedIn={isSignedIn} />}
        </RootStack.Screen>
        <RootStack.Screen name={"Register"} component={RegisterStackScreen} />
        <RootStack.Screen name={"Order"} component={OrderStackScreen} />
        <RootStack.Screen name={"Preset"} component={PresetScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProps = ({ user }) => ({
  isSignedIn: !!user
});

const mapDispatchToProps = (dispatch) => ({
  watchAuthState: () => watchAuthState(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StackNavigator);