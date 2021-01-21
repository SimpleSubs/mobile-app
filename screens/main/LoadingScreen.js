/**
 * @file Manages loading screen (buffer between auth states that fetches necessary data).
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { getAuthData, logOut } from "../../redux/Actions";
import { connect } from "react-redux";
import Colors from "../../constants/Colors";
import { allValid } from "../../constants/Inputs";

/**
 * Renders app loading screen.
 *
 * Renders an activity indicator (loading symbol) and fetches app data based
 * on whether user is authorized (signed in).
 *
 * @param {bool}       isLoggedIn       Whether user is logged in.
 * @param {bool}       hasAuthenticated Whether app has gotten initial auth state.
 * @param {function()} getAuthData      Gets data for when user is signed in.
 * @param {function()} logOut           Signs user out.
 * @param {Object}     navigation       Navigation object (passed from React Navigation).
 *
 * @return {React.ReactElement} Element to render loading screen.
 * @constructor
 */
const LoadingScreen = ({ isLoggedIn, hasAuthenticated, getAuthData, logOut, navigation }) => {
  const prevAuthRef = useRef();

  // Gets different state constants depending on whether user is logged in.
  useEffect(() => {
    if (!hasAuthenticated) return;
    const prevAuthState = prevAuthRef.current;
    if (isLoggedIn && !prevAuthState) {
      getAuthData().then(({ user, userFields }) => {
        if (!allValid(user, userFields)) {
          navigation.navigate("Main", { screen: "Update User" });
        } else {
          navigation.navigate("Main", { screen: "Home" });
        }
      }).catch((e) => {
        console.log(e);
        logOut();
      });
    } else if (prevAuthState || prevAuthState === undefined) {
      navigation.navigate("Main", { screen: "Login" });
    }
    prevAuthRef.current = isLoggedIn;
  }, [isLoggedIn, hasAuthenticated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={Colors.loadingIndicator} />
    </View>
  );
};

const mapStateToProps = ({ user, hasAuthenticated, stateConstants, domain }) => ({
  isLoggedIn: !!user,
  hasAuthenticated,
  userFields: stateConstants.userFields,
  domain
});

const mapDispatchToProps = (dispatch) => ({
  getAuthData: async () => await getAuthData(dispatch),
  logOut: () => logOut(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
});