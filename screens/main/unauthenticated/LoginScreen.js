/**
 * @file Manages login screen (main screen for unauthenticated users).
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import inputModalProps from "../../../components/modals/InputModal";
import InputsList from "../../../components/userFields/UserInputsList";
import SubmitButton from "../../../components/userFields/SubmitButton";
import Layout from "../../../constants/Layout";
import Colors from "../../../constants/Colors";
import { EmailField, PasswordField } from "../../../constants/RequiredFields";
import { logIn, openModal, closeModal, setModalProps, resetPassword } from "../../../redux/Actions";
import { connect } from "react-redux";
import Logo from "../../../assets/images/icon.svg";

// Fields required for login
const LOGIN_FIELDS = [EmailField, PasswordField];

/**
 * Renders login screen.
 *
 * @param {function(string, string)} logIn               Function that signs user into their account.
 * @param {function(Object)}         openModal           Function that opens top-level model with provided props.
 * @param {function()}               closeModal          Function that closes top-level modal.
 * @param {function(Object)}         setModalProps       Sets props for top-level modal.
 * @param {function(string)}         resetPasswordAction Sends password reset email to user.
 * @param {Object}                   navigation          Navigation object (passed from React Navigation).
 *
 * @return {React.ReactElement} Element to render login screen.
 * @constructor
 */
const LoginScreen = ({ logIn, openModal, closeModal, setModalProps, resetPasswordAction, navigation }) => {
  const inset = useSafeAreaInsets();
  const [inputs, setInputs] = useState({ email: "", password: "" });

  // Logs in using component state.
  const logInState = () => logIn(inputs.email, inputs.password);

  // Sends password reset email and closes modal.
  const resetPassword = ({ email }) => {
    resetPasswordAction(email);
    closeModal();
  };

  // Prevents popping back to loading screen.
  useEffect(() => (
    navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type === "POP") {
        e.preventDefault();
      }
    })
  ), [navigation]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => BackHandler.removeEventListener("hardwareBackPress", () => true);
  })

  const openForgotPasswordModal = () => openModal(inputModalProps(
    "Reset Password",
    [{ ...EmailField, placeholder: "Your email address" }],
    "Send email",
    resetPassword,
    setModalProps
  ));

  const LoginButton = (props) => <SubmitButton {...props} title={"Login"} />

  return (
    <InputsList
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Logo width={150} height={150} />
          <Text style={styles.title}>SimpleSubs</Text>
          <Text style={styles.text}>An app for sandwich ordering at Lick-Wilmerding High School</Text>
          <Text style={styles.text}>Built by Emily Sturman</Text>
          <Text style={styles.text}>Logo designed by Ronan Furuta</Text>
        </View>
      )}
      ListFooterComponent={() => (
        <View style={styles.otherTouchables}>
          <TouchableOpacity style={styles.linkTouchable} onPress={openForgotPasswordModal} activeOpacity={0.5}>
            <Text style={styles.linkTouchableText}>I forgot my password!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkTouchable}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.5}
          >
            <Text style={styles.linkTouchableText}>Don't have an account? Click here to create one.</Text>
          </TouchableOpacity>
        </View>
      )}
      data={LOGIN_FIELDS}
      state={inputs}
      setInputs={setInputs}
      SubmitButton={LoginButton}
      onSubmit={logInState}
      contentContainerStyle={{ paddingTop: inset.top, paddingBottom: inset.bottom }}
      style={styles.container}
    />
  )
};

const mapDispatchToProps = (dispatch) => ({
  logIn: (email, password) => logIn(dispatch, email, password),
  openModal: (props) => dispatch(openModal(props)),
  closeModal: () => dispatch(closeModal()),
  setModalProps: (props) => dispatch(setModalProps(props)),
  resetPasswordAction: (email) => resetPassword(dispatch, email)
})

export default connect(null, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
    marginTop: 20
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.mainTitle,
    margin: 20,
    textAlign: "center",
    color: Colors.primaryText
  },
  text: {
    fontFamily: "josefin-sans",
    color: Colors.primaryText,
    fontSize: Layout.fonts.body,
    marginVertical: 5,
    textAlign: "center",
    marginHorizontal: 30
  },
  linkTouchable: {
    marginBottom: 20,
    width: "100%"
  },
  linkTouchableText: {
    color: Colors.linkText,
    fontSize: Layout.fonts.body,
    fontFamily: "josefin-sans",
    textAlign: "center"
  },
  otherTouchables: {
    marginTop: 20,
    alignItems: "center"
  }
});