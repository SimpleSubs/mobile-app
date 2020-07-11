import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import OrderScreen from "../screens/OrderScreen";

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const MainStackScreen = ({ isSignedIn }) => (
  <MainStack.Navigator headerMode={"none"} sceneAnimationEnabled={false}>
    {!isSignedIn ?
      (
        <>
          <MainStack.Screen name={"Login"} component={LoginScreen} options={{ animationTypeForReplace: "pop" }} />
          <MainStack.Screen name={"Register"} component={RegisterScreen} />
        </>
      ) : (
        <>
          <MainStack.Screen name={"Home"} component={HomeScreen} />
          <MainStack.Screen name={"Settings"} component={SettingsScreen} />
        </>
      )
    }
  </MainStack.Navigator>
);

const StackNavigator = ({ containerRef, initialState, isSignedIn }) => (
  <NavigationContainer ref={containerRef} initialState={initialState}>
    <RootStack.Navigator headerMode={"none"} mode={"modal"}>
      <RootStack.Screen name={"Main"}>
        {() => <MainStackScreen isSignedIn={isSignedIn}/>}
      </RootStack.Screen>
      <RootStack.Screen name={"Order"} component={OrderScreen} />
    </RootStack.Navigator>
  </NavigationContainer>
);

const mapStateToProps = ({ user }) => ({
  isSignedIn: !!user
});

export default connect(mapStateToProps, null)(StackNavigator);