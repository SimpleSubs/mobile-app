import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { inputModalProps } from "../../../components/modals/InputModal";
import InputsList from "../../../components/userFields/UserInputsList";
import SubmitButton from "../../../components/userFields/SubmitButton";
import Layout from "../../../constants/Layout";
import createStyleSheet from "../../../constants/Colors";
import { EmailField, PasswordField } from "../../../constants/RequiredFields";
import { logIn, resetPassword } from "../../../redux/Thunks";
import { openModal, closeModal } from "../../../redux/features/display/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../../assets/images/icon.svg";
import { clearOperation, setKey } from "../../../redux/features/display/modalOperationsSlice";
import uuid from "react-native-uuid";
import TopIconButton from "../../../components/TopIconButton";

// Fields required for login
const LOGIN_FIELDS = [EmailField, PasswordField];

const LoginScreen = ({ navigation }) => {
  const { key, returnValue } = useSelector(({ modalOperations }) => modalOperations);
  const dispatch = useDispatch();
  const [inputs, setInputs] = React.useState({ email: "", password: "" });
  const [modalId, setModalId] = React.useState();
  const themedStyles = createStyleSheet(styles);
  const inset = useSafeAreaInsets();

  // Logs in using component state.
  const logInState = () => dispatch(logIn(inputs.email, inputs.password));

  // Prevents popping back to loading screen.
  React.useEffect(() => (
    navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type === "POP") {
        e.preventDefault();
      }
    })
  ), [navigation]);

  const openForgotPasswordModal = () => {
    dispatch(setKey(modalId));
    dispatch(openModal(inputModalProps({
      title: "Reset Password",
      inputData: [{...EmailField, placeholder: "Your email address"}],
      buttonTitle: "Send email"
    })))
  };

  React.useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

  React.useEffect(() => {
    if (key === modalId && returnValue?.email) {
      dispatch(resetPassword(returnValue.email));
      dispatch(closeModal());
      dispatch(clearOperation());
    }
  }, [returnValue, modalId]);

  React.useEffect(() => setModalId(uuid.v4()), []);

  return (
    <InputsList
      ListHeaderComponent={() => (
        <View style={themedStyles.header}>
          <TopIconButton iconName={"at-outline"} style={themedStyles.creditsButton} onPress={() => navigation.navigate("Credits")} />
          <Logo width={150} height={150} />
          <Text style={themedStyles.title}>SimpleSubs</Text>
          <Text style={themedStyles.text}>School lunches made easy</Text>
        </View>
      )}
      ListFooterComponent={() => (
        <View style={themedStyles.otherTouchables}>
          <TouchableOpacity style={themedStyles.linkTouchable} onPress={openForgotPasswordModal} activeOpacity={0.5}>
            <Text style={themedStyles.linkTouchableText}>I forgot my password!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={themedStyles.linkTouchable}
            onPress={() => navigation.navigate("Register", { screen: "Domain" })}
            activeOpacity={0.5}
          >
            <Text style={themedStyles.linkTouchableText}>Don't have an account? Click here to create one.</Text>
          </TouchableOpacity>
        </View>
      )}
      data={LOGIN_FIELDS}
      state={inputs}
      setInputs={setInputs}
      SubmitButton={(props) => <SubmitButton {...props} title={"Login"} />}
      onSubmit={logInState}
      contentContainerStyle={{ paddingTop: inset.top, paddingBottom: inset.bottom }}
      style={themedStyles.container}
    />
  )
};

export default LoginScreen;

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  logo: {
    height: 150,
    width: 150
  },
  creditsButton: {
    right: -20
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