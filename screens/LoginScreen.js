import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  Text,
  StyleSheet,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedTouchable from "../components/AnimatedTouchable";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

const LoginScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView style={styles.avoidingView} behavior={"position"}>
      <View style={styles.avoidingView}>
        <View style={styles.header}>
          <Image source={require("../assets/images/robot-dev.png")}/>
          <Text style={styles.title}>SimpleSubs</Text>
          <Text style={styles.text}>An app for sandwich ordering at Lick-Wilmerding High School</Text>
          <Text style={styles.text}>Built by Emily Sturman</Text>
        </View>
        <View>
          <TextInput style={styles.textInput} placeholder={"Email"}/>
          <TextInput style={styles.textInput} placeholder={"Password"}/>
        </View>
      </View>
    </KeyboardAvoidingView>
    <AnimatedTouchable style={styles.loginButton} onPress={() => navigation.navigate("Home")}>
      <Text style={styles.loginButtonText}>Login</Text>
    </AnimatedTouchable>
  </SafeAreaView>
);

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    alignItems: "center"
  },
  header: {
    alignItems: "center"
  },
  textInput: {
    width: Layout.window.width - 100,
    backgroundColor: Colors.textInputColor,
    padding: 15,
    fontFamily: "josefin-sans",
    fontSize: 15,
    margin: 10,
    borderRadius: 10
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: 30,
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
    fontSize: 20,
    textAlign: "center"
  },
  avoidingView: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  text: {
    fontFamily: "josefin-sans",
    color: Colors.primaryText,
    fontSize: 17,
    marginVertical: 5,
    textAlign: "center",
    marginHorizontal: 30
  }
});