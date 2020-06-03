import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AnimatedTouchable from "../components/AnimatedTouchable";
import InputsList from "../components/InputsList";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import { RegisterUserFields } from "../constants/UserFields";

const RegisterScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({});
  const submit = () => {
    navigation.navigate("Home");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.spacer} />
      <InputsList
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={styles.title}>Create an account</Text>
          </View>
        )}
        ListFooterComponent={(
          <TouchableOpacity style={styles.linkTouchable} onPress={() => navigation.navigate("Login")} activeOpacity={0.5}>
            <Text style={styles.linkTouchableText}>Already have an account? Click here to log in.</Text>
          </TouchableOpacity>
        )}
        data={RegisterUserFields}
        state={inputs}
        setInputs={setInputs}
        onSubmit={submit}
      />
      <AnimatedTouchable style={styles.registerButton} onPress={submit}>
        <Text style={styles.registerButtonText}>Register</Text>
      </AnimatedTouchable>
    </SafeAreaView>
  )
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  header: {
    alignItems: "center",
    marginBottom: 30
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
    width: Layout.window.width - 100,
    marginBottom: 20,
    marginTop: 50
  },
  registerButtonText: {
    color: Colors.textOnBackground,
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center"
  },
  linkTouchable: {
    marginVertical: 20,
    width: "100%"
  },
  linkTouchableText: {
    color: Colors.linkText,
    fontSize: Layout.fonts.body,
    fontFamily: "josefin-sans",
    textAlign: "center"
  },
  inputContainer: {
    margin: 5
  },
  spacer: {
    flex: 1
  }
});