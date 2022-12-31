import React, { useEffect, useRef } from "react";
import {
  View,
  ActivityIndicator
} from "react-native";
import { getAuthData, logOut } from "../../redux/Actions";
import { connect } from "react-redux";
import createStyleSheet, { getColors } from "../../constants/Colors";
import { allValid } from "../../constants/Inputs";

const LoadingScreen = ({ isLoggedIn, hasAuthenticated, getAuthData, logOut, navigation }) => {
  const prevAuthRef = useRef();
  const themedStyles = createStyleSheet(styles);

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
    <View style={themedStyles.container}>
      <ActivityIndicator size={"large"} color={getColors().loadingIndicator} />
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

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
});