import React from "react";
import {
  View,
  ActivityIndicator
} from "react-native";
import { getAuthData, logOut } from "../../redux/Thunks";
import { useSelector, useDispatch } from "react-redux";
import createStyleSheet, { getColors } from "../../constants/Colors";
import { allValid } from "../../constants/Inputs";

const LoadingScreen = ({ navigation }) => {
  const isLoggedIn = useSelector(({ user }) => !!user);
  const hasAuthenticated = useSelector(({ hasAuthenticated }) => hasAuthenticated.value);
  const dispatch = useDispatch();

  const prevAuthRef = React.useRef();
  const themedStyles = createStyleSheet(styles);

  // Gets different state constants depending on whether user is logged in.
  React.useEffect(() => {
    if (!hasAuthenticated) return;
    const prevAuthState = prevAuthRef.current;
    if (isLoggedIn && !prevAuthState) {
      dispatch(async (dispatch) => {
        try {
          const { user, userFields } = await getAuthData()(dispatch);
          if (!allValid(user, userFields)) {
            navigation.navigate("Main", { screen: "Update User" });
          } else {
            navigation.navigate("Main", { screen: "Home" });
          }
        } catch (e) {
          console.error(e);
          dispatch(logOut());
        }
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

export default LoadingScreen;

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
});