import React from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InputsList from "../../../../components/userFields/UserInputsList";
import SubmitButton from "../../../../components/userFields/SubmitButton";
import Layout from "../../../../constants/Layout";
import createStyleSheet from "../../../../constants/Colors";
import { EmailField, NewPasswordField, ConfirmPasswordField } from "../../../../constants/RequiredFields";
import { createUser } from "../../../../redux/Thunks";
import { useDispatch, useSelector } from "react-redux";
import TopIconButton from "../../../../components/TopIconButton";

const REGISTER_FIELDS = [EmailField, NewPasswordField, ConfirmPasswordField];

const RegisterScreen = ({ navigation }) => {
  const domain = useSelector(({ domain }) => domain);
  const registerUserFields = useSelector(({ stateConstants }) => (
    stateConstants.userFields && [...REGISTER_FIELDS, ...stateConstants.userFields]
  ));
  const dispatch = useDispatch();

  const [inputs, setInputs] = React.useState({});
  const themedStyles = createStyleSheet(styles);
  const inset = useSafeAreaInsets();

  // Passes state to createUser action
  const createUserState = () => {
    let data = { ...inputs };
    for (let field of REGISTER_FIELDS) {
      delete data[field.key];
    }
    dispatch(createUser(inputs.email, inputs.password, data));
  };

  // Button to submit form and register user
  const RegisterButton = (props) => <SubmitButton {...props} title={"Register"} />;

  React.useEffect(() => {
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
          <TopIconButton iconName={"arrow-back"} style={themedStyles.closeButton} onPress={() => navigation.pop()} />
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

export default RegisterScreen;

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  closeButton: {
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