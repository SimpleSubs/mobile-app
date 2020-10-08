/**
 * @file Manages screen to register a new user
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import InputsList from "../../components/userFields/UserInputsList";
import SubmitButton from "../../components/userFields/SubmitButton";
import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";
import { RegisterFields } from "../../constants/RequiredUserFields";
import { createUser } from "../../redux/Actions";
import { connect } from "react-redux";

/**
 * Renders screen to register/sign up user.
 *
 * @param {Object[]}                         registerUserFields Input fields to display in register screen.
 * @param {function(string, string, Object)} createUser         Creates a user with the provided data.
 * @param {Object}                           navigation         Navigation object passed by React Navigation.
 *
 * @return {React.ReactElement} Element to display.
 * @constructor
 */
const RegisterScreen = ({ registerUserFields, createUser, navigation }) => {
  const [inputs, setInputs] = useState({});
  const inset = useSafeArea();

  // Passes state to createUser action
  const createUserState = () => {
    let data = { ...inputs };
    for (let field of RegisterFields) {
      delete data[field.key];
    }
    createUser(inputs.email, inputs.password, data);
  };

  // Button to submit form and register user
  const RegisterButton = (props) => <SubmitButton {...props} title={"Register"} />;

  return (
    <InputsList
      style={styles.container}
      contentContainerStyle={{ paddingTop: inset.top, paddingBottom: inset.bottom }}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Text style={styles.title}>Create an account</Text>
        </View>
      )}
      ListFooterComponent={() => (
        <TouchableOpacity style={styles.linkTouchable} onPress={() => navigation.navigate("Login")} activeOpacity={0.5}>
          <Text style={styles.linkTouchableText}>Already have an account? Click here to log in.</Text>
        </TouchableOpacity>
      )}
      SubmitButton={RegisterButton}
      data={registerUserFields}
      state={inputs}
      setInputs={setInputs}
      onSubmit={createUserState}
    />
  );
};

const mapStateToProps = ({ stateConstants }) => ({
  registerUserFields: [...RegisterFields, ...stateConstants.userFields]
});

const mapDispatchToProps = (dispatch) => ({
  createUser: (email, password, data) => createUser(dispatch, email, password, data)
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  header: {
    alignItems: "center",
    marginVertical: 30
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.mainTitle,
    margin: 20,
    textAlign: "center",
    color: Colors.primaryText
  },
  registerButton: {
    borderRadius: 100,
    backgroundColor: Colors.accentColor,
    padding: 20,
    marginVertical: 20
  },
  registerButtonText: {
    color: Colors.textOnBackground,
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center"
  },
  linkTouchable: {
    marginVertical: 20
  },
  linkTouchableText: {
    color: Colors.linkText,
    fontSize: Layout.fonts.body,
    fontFamily: "josefin-sans",
    textAlign: "center"
  }
});