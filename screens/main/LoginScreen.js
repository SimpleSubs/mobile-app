import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";

import inputModalProps from "../../components/modals/InputModal";
import InputsList from "../../components/userFields/UserInputsList";
import SubmitButton from "../../components/userFields/SubmitButton";

import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";
import { InputTypes, TextTypes } from "../../constants/Inputs";
import { LoginFields } from "../../constants/RequiredUserFields";

import { logIn, openModal, closeModal, setModalProps, resetPassword } from "../../redux/Actions";
import { connect } from "react-redux";

const LoginScreen = ({ logIn, openModal, closeModal, setModalProps, resetPasswordAction, navigation }) => {
  const inset = useSafeArea();
  const [inputs, setInputs] = useState({ email: "", password: "" });

  const logInState = () => {
    logIn(inputs.email, inputs.password);
  };

  const resetPassword = ({ email }) => {
    resetPasswordAction(email);
    closeModal();
  };

  useEffect(() => (
    navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type === "POP") {
        e.preventDefault();
      }
    })
  ), [navigation])

  const openForgotPasswordModal = () => openModal(inputModalProps(
    "Reset Password",
    [{
      key: "email",
      inputType: InputTypes.TEXT_INPUT,
      textType: TextTypes.EMAIL,
      placeholder: "Your email address"
    }],
    { title: "Send email" },
    resetPassword,
    setModalProps
  ));

  const LoginButton = (props) => <SubmitButton {...props} title={"Login"} />

  return (
    <InputsList
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Image source={require("../../assets/images/robot-dev.png")}/>
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
      data={LoginFields}
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