import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AnimatedTouchable from "../components/AnimatedTouchable";
import InputModal from "../components/modals/InputModal";
import InputsList from "../components/InputsList";

import { LoginUserFields } from "../constants/UserFields";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

const ForgotPasswordModal = ({ open, toggleModal }) => {
  const [email, setEmail] = useState("");
  return (
    <InputModal
      open={open}
      toggleModal={toggleModal}
      title={"Reset password"}
      inputData={[{ value: email, placeholder: "Your email address", onChangeText: (text) => setEmail(text) }]}
      buttonData={{ onPress: () => toggleModal(!open), title: "Send email" }}
    />
  )
};

const LoginScreen = ({ navigation }) => {
  const [open, toggleModal] = useState(false);
  const [inputs, setInputs] = useState({});

  const login = () => {
    navigation.navigate("Home");
  }

  return (
    <SafeAreaView style={styles.container}>
      <InputsList
        ListHeaderComponent={(
          <View style={styles.header}>
            <Image source={require("../assets/images/robot-dev.png")}/>
            <Text style={styles.title}>SimpleSubs</Text>
            <Text style={styles.text}>An app for sandwich ordering at Lick-Wilmerding High School</Text>
            <Text style={styles.text}>Built by Emily Sturman</Text>
          </View>
        )}
        ListFooterComponent={(
          <View style={styles.otherTouchables}>
            <TouchableOpacity style={styles.linkTouchable} onPress={() => toggleModal(!open)} activeOpacity={0.5}>
              <Text style={styles.linkTouchableText}>I forgot my password!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkTouchable} onPress={() => navigation.navigate("Register")} activeOpacity={0.5}>
              <Text style={styles.linkTouchableText}>Don't have an account? Click here to create one.</Text>
            </TouchableOpacity>
          </View>
        )}
        data={LoginUserFields}
        state={inputs}
        setInputs={setInputs}
        onSubmit={login}
      />
      <AnimatedTouchable style={styles.loginButton} onPress={login}>
        <Text style={styles.loginButtonText}>Login</Text>
      </AnimatedTouchable>
      <ForgotPasswordModal open={open} toggleModal={toggleModal} />
    </SafeAreaView>
  )
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
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
    width: Layout.window.width - 100,
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
    marginTop: 20
  }
});