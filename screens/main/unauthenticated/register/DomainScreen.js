/**
 * @file Manages screen to sign into domain
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InputsList from "../../../../components/userFields/UserInputsList";
import SubmitButton from "../../../../components/userFields/SubmitButton";
import AnimatedTouchable from "../../../../components/AnimatedTouchable";
import Layout from "../../../../constants/Layout";
import Colors from "../../../../constants/Colors";
import { DomainCodeField } from "../../../../constants/RequiredFields";
import { getUnauthData } from "../../../../redux/Actions";
import { connect } from "react-redux";

/**
 * Renders screen to sign into domain/organization (to get profile options for register
 * screen).
 *
 * @param {function(string)} getUnauthData   Gets data required for registering user.
 * @param {Object}           navigation      Navigation object passed by React Navigation.
 *
 * @return {React.ReactElement} Element to display.
 * @constructor
 */
const DomainScreen = ({ getUnauthData, navigation }) => {
  const [inputs, setInputs] = useState({ domainCode: "" });
  const inset = useSafeAreaInsets();

  // Passes state to createUser action
  const registerToDomain = () => {
    getUnauthData(inputs.domainCode).then((success) => {
      if (success) {
        navigation.navigate("Register")
      }
    });
  };

  // Button to submit form and register user
  const ContinueButton = (props) => <SubmitButton {...props} title={"Continue"} />;

  return (
    <InputsList
      style={styles.container}
      contentContainerStyle={{ paddingTop: inset.top, paddingBottom: inset.bottom }}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <AnimatedTouchable style={styles.closeButton} onPress={() => navigation.navigate("Main", { screen: "Login" })} endSize={0.8}>
            <Ionicons name={"md-close"} size={Layout.fonts.icon} color={Colors.primaryText} />
          </AnimatedTouchable>
          <Text style={styles.title}>Enter organization code</Text>
        </View>
      )}
      SubmitButton={ContinueButton}
      data={[DomainCodeField]}
      state={inputs}
      setInputs={setInputs}
      onSubmit={registerToDomain}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  getUnauthData: (code) => getUnauthData(dispatch, code)
});

export default connect(null, mapDispatchToProps)(DomainScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: 0
  },
  header: {
    alignItems: "flex-start",
    marginVertical: 40,
    justifyContent: "center",
    flexDirection: "row"
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
    margin: 20,
    textAlign: "center",
    color: Colors.primaryText,
    maxWidth: Layout.window.width - 80
  }
});