import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";

import AnimatedTouchable from "../components/AnimatedTouchable";
import inputModalProps from "../components/modals/InputModal";
import InputsList from "../components/InputsList";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import InputTypes from "../constants/InputTypes";

import { logIn, openModal, closeModal, setModalProps } from "../redux/Actions";
import { connect } from "react-redux";

const LoginScreen = ({ logIn, user, loginUserFields, inputPresets, openModal, closeModal, setModalProps, navigation }) => {
  const inset = useSafeArea();
  const [inputs, setInputs] = useState({ email: "", password: "" });

  const logInState = () => {
    logIn(inputs.email, inputs.password);
  };

  const resetPassword = ({ email }) => {
    closeModal();
  };

  const openForgotPasswordModal = () => openModal(inputModalProps(
    "Reset password",
    [{ key: "email", inputType: InputTypes.textInput, textType: "email", placeholder: "Your email address" }],
    { title: "Send email" },
    resetPassword,
    setModalProps
  ));

  const LoginButton = ({ onPress }) => (
    <AnimatedTouchable style={styles.loginButton} onPress={onPress}>
      <Text style={styles.loginButtonText}>Login</Text>
    </AnimatedTouchable>
  );

  return (
    <InputsList
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Image source={require("../assets/images/robot-dev.png")}/>
          <Text style={styles.title}>SimpleSubs</Text>
          <Text style={styles.text}>An app for sandwich ordering at Lick-Wilmerding High School</Text>
          <Text style={styles.text}>Built by Emily Sturman</Text>
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
      data={loginUserFields}
      inputPresets={inputPresets}
      state={inputs}
      setInputs={setInputs}
      SubmitButton={LoginButton}
      onSubmit={logInState}
      contentContainerStyle={{ paddingTop: inset.top, paddingBottom: inset.bottom }}
      style={styles.container}
    />
  )
};

const mapStateToProps = ({ user, stateConstants }) => ({
  user,
  loginUserFields: stateConstants.userFields.filter(({ key }) => key === "email" || key === "password"),
  inputPresets: stateConstants.inputPresets
});

const mapDispatchToProps = (dispatch) => ({
  logIn: (email, password) => dispatch(logIn(email, password)),
  openModal: (props) => dispatch(openModal(props)),
  closeModal: () => dispatch(closeModal()),
  setModalProps: (props) => dispatch(setModalProps(props))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

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
  loginButton: {
    borderRadius: 100,
    backgroundColor: Colors.accentColor,
    padding: 20,
    marginBottom: 20,
    marginTop: 50
  },
  loginButtonText: {
    color: Colors.textOnBackground,
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center"
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