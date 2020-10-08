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
import { getAuthData, getUnauthData, logOut } from "../../redux/Actions";
import { connect } from "react-redux";
import Colors from "../../constants/Colors";

/**
 * Renders app loading screen.
 *
 * Renders an activity indicator (loading symbol) and fetches app data based
 * on whether user is authorized (signed in).
 *
 * @param {bool}                         isLoggedIn    Whether user is logged in.
 * @param {function(function, function)} getAuthData   Gets data for when user is signed in.
 * @param {function(function, function)} getUnauthData Gets data for when user is not signed in.
 * @param {function()}                   logOut        Signs user out.
 * @param {Object}                       navigation    Navigation object (passed from React Navigation).
 *
 * @return {React.ReactElement} Element to render loading screen.
 * @constructor
 */
const LoadingScreen = ({ isLoggedIn, getAuthData, getUnauthData, logOut, navigation }) => {
  const prevAuthRef = useRef();

  // Gets different state constants depending on whether user is logged in.
  useEffect(() => {
    const prevAuthState = prevAuthRef.current;
    if (isLoggedIn && !prevAuthState) {
      getAuthData(() => navigation.navigate("Main", { screen: "Home" }), logOut);
    } else if (prevAuthState || prevAuthState === undefined) {
      getUnauthData(() => navigation.navigate("Main", { screen: "Login" }), () => {});
    }
    prevAuthRef.current = isLoggedIn;
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={Colors.loadingIndicator} />
    </View>
  );
};

const mapStateToProps = ({ user }) => ({
  isLoggedIn: !!user
});

const mapDispatchToProps = (dispatch) => ({
  getAuthData: (onSuccess, onError) => getAuthData(dispatch, onSuccess, onError),
  getUnauthData: (onSuccess, onError) => getUnauthData(dispatch, onSuccess, onError),
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