import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import { getAuthData, getUnauthData, logOut } from "../../redux/Actions";
import { connect } from "react-redux";

import Colors from "../../constants/Colors";

const LoadingScreen = ({ isLoggedIn, getAuthData, getUnauthData, logOut, navigation }) => {
  const prevAuthRef = useRef();

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
      <ActivityIndicator size={"large"} style={styles.activityIndicator} color={Colors.loadingIndicator} />
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
  },
  activityIndicator: {
  }
});