import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";

import AnimatedTouchable from "../components/AnimatedTouchable";
import InputsList from "../components/InputsList";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import InputTypes from "../constants/InputTypes";

import { createUser } from "../redux/Actions";
import { connect } from "react-redux";

const RegisterScreen = ({ registerUserFields, inputPresets, createUser, navigation }) => {
  const [inputs, setInputs] = useState({});
  const inset = useSafeArea();

  const createUserState = () => {
    let data = { ...inputs };
    if (data.confirmPassword) { delete data.confirmPassword; }
    createUser(data);
  };

  const RegisterButton = ({ onPress }) => (
    <AnimatedTouchable style={styles.registerButton} onPress={onPress}>
      <Text style={styles.registerButtonText}>Register</Text>
    </AnimatedTouchable>
  );

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
        <TouchableOpacity
          style={styles.linkTouchable}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.5}
        >
          <Text style={styles.linkTouchableText}>Already have an account? Click here to log in.</Text>
        </TouchableOpacity>
      )}
      SubmitButton={RegisterButton}
      inputPresets={inputPresets}
      data={registerUserFields}
      state={inputs}
      setInputs={setInputs}
      onSubmit={createUserState}
    />
  );
};

const getRegisterUserFields = (userFields) => {
  const passwordIndex = userFields.findIndex(({ textType }) => textType === "password");
  let registerUserFields = [...userFields];
  if (passwordIndex !== -1) {
    registerUserFields.splice(
      passwordIndex,
      1,
      {
        key: "password",
        title: "Password",
        placeholder: "Password",
        mutable: false,
        inputType: InputTypes.textInput,
        textType: "newPassword"
      },
      {
        key: "confirmPassword",
        title: "Confirm password",
        placeholder: "Confirm password",
        mutable: false,
        inputType: InputTypes.textInput,
        textType: "confirmPassword"
      }
    )
  }
  return registerUserFields;
};

const mapStateToProps = ({ stateConstants }) => ({
  registerUserFields: getRegisterUserFields(stateConstants.userFields),
  inputPresets: stateConstants.inputPresets
});

const mapDispatchToProps = (dispatch) => ({
  createUser: (data) => dispatch(createUser(data))
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