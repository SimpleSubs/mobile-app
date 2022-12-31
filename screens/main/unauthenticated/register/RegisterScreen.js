import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InputsList from "../../../../components/userFields/UserInputsList";
import SubmitButton from "../../../../components/userFields/SubmitButton";
import Layout from "../../../../constants/Layout";
import createStyleSheet, { getColors } from "../../../../constants/Colors";
import { EmailField, NewPasswordField, ConfirmPasswordField } from "../../../../constants/RequiredFields";
import { createUser } from "../../../../redux/Actions";
import { connect } from "react-redux";
import AnimatedTouchable from "../../../../components/AnimatedTouchable";
import { Ionicons } from "@expo/vector-icons";

const REGISTER_FIELDS = [EmailField, NewPasswordField, ConfirmPasswordField];

const RegisterScreen = ({ registerUserFields, domain, createUser, navigation }) => {
  const [inputs, setInputs] = useState({});
  const themedStyles = createStyleSheet(styles);
  const inset = useSafeAreaInsets();

  // Passes state to createUser action
  const createUserState = () => {
    let data = { ...inputs };
    for (let field of REGISTER_FIELDS) {
      delete data[field.key];
    }
    createUser(inputs.email, inputs.password, data, domain.id);
  };

  // Button to submit form and register user
  const RegisterButton = (props) => <SubmitButton {...props} title={"Register"} />;

  useEffect(() => {
    if (!registerUserFields) {
      navigation.navigate("Loading");
    }
  }, [registerUserFields]);

  return (
    <InputsList
      style={themedStyles.container}
      contentContainerStyle={{ paddingBottom: inset.bottom }}
      ListHeaderComponent={() => (
        <View style={themedStyles.header}>
          <AnimatedTouchable style={themedStyles.closeButton} onPress={() => navigation.pop()} endSize={0.8}>
            <Ionicons name={"arrow-back"} size={Layout.fonts.icon} color={getColors().primaryText} />
          </AnimatedTouchable>
          <Text style={themedStyles.title}>Join the {domain.name} Organization</Text>
        </View>
      )}
      ListFooterComponent={() => (
        <TouchableOpacity style={themedStyles.linkTouchable} onPress={() => navigation.navigate("Main", { screen: "Login" })} activeOpacity={0.5}>
          <Text style={themedStyles.linkTouchableText}>Already have an account? Click here to log in.</Text>
        </TouchableOpacity>
      )}
      SubmitButton={RegisterButton}
      data={registerUserFields || []}
      state={inputs}
      setInputs={setInputs}
      onSubmit={createUserState}
    />
  );
};

const mapStateToProps = ({ stateConstants, domain }) => ({
  registerUserFields: stateConstants.userFields ? [...REGISTER_FIELDS, ...stateConstants.userFields] : null,
  domain
});

const mapDispatchToProps = (dispatch) => ({
  createUser: (email, password, data, domain) => createUser(dispatch, email, password, data, domain)
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: -20
  },
  header: {
    alignItems: "center",
    marginVertical: 30
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
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