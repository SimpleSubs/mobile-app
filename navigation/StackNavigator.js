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
import LoginScreen from "../screens/main/LoginScreen";
import RegisterScreen from "../screens/main/RegisterScreen";
import HomeScreen from "../screens/main/HomeScreen";
import SettingsScreen from "../screens/main/SettingsScreen";
import UserSettingsScreen from "../screens/main/UserSettingsScreen";
import OrderSettingsScreen from "../screens/main/OrderSettingsScreen";
import PreOrderScreen from "../screens/order/PreOrderScreen";
import OrderScreen from "../screens/order/OrderScreen";
import PresetOrderScreen from "../screens/order/PresetOrderScreen";
import PresetScreen from "../screens/PresetScreen";

// Primary stack to display (home screen, login screen, etc.)
const MainStack = createStackNavigator();
// Stack for ordering (order preset, custom order, etc.)
const OrderStack = createStackNavigator();
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
  <MainStack.Navigator headerMode={"none"}>
    <MainStack.Screen name={"Loading"} component={LoadingScreen} options={{ gestureEnabled: false }} />
    {!isSignedIn ? (
      <>
        <MainStack.Screen name={"Login"} component={LoginScreen} options={{ gestureEnabled: false }} />
        <MainStack.Screen name={"Register"} component={RegisterScreen} />
      </>
    ) : (
      <>
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
  <OrderStack.Navigator headerMode={"none"}>
    <MainStack.Screen name={"Preorder"} component={PreOrderScreen} />
    <MainStack.Screen name={"Custom Order"} component={OrderScreen} />
    <MainStack.Screen name={"Preset Order"} component={PresetOrderScreen} />
  </OrderStack.Navigator>
)

/**
 * Renders screens for root stack and main app navigator.
 *
 * Renders main stack, order stack, and preset screen.
 * Sub-stacks animate as standard screens, while the root
 * stack animates as fullscreen modals.
 *
 * @param {React.ElementRef} containerRef Element ref to assign navigation container to.
 * @param {Object} initialState Initial navigation state.
 * @param {boolean} isSignedIn Whether user is authenticated.
 * @param {function()} watchAuthState Listener for changes in user authentication.
 *
 * @return {React.ReactElement} Navigation container with root stack.
 * @constructor
 */
const StackNavigator = ({ containerRef, initialState, isSignedIn, watchAuthState }) => {
  useEffect(watchAuthState, []);
  return (
    <NavigationContainer ref={containerRef} initialState={initialState}>
      <RootStack.Navigator headerMode={"none"} mode={"modal"}>
        <RootStack.Screen name={"Main"}>
          {() => <MainStackScreen isSignedIn={isSignedIn} />}
        </RootStack.Screen>
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