import React from "react";
import {
  View,
  Text
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InputsList from "../../../../components/userFields/UserInputsList";
import SubmitButton from "../../../../components/userFields/SubmitButton";
import AnimatedTouchable from "../../../../components/AnimatedTouchable";
import Layout from "../../../../constants/Layout";
import createStyleSheet, { getColors } from "../../../../constants/Colors";
import { DomainCodeField } from "../../../../constants/RequiredFields";
import { getUnauthData } from "../../../../redux/Thunks";
import { useDispatch } from "react-redux";

const DomainScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = React.useState({ domainCode: "" });
  const themedStyles = createStyleSheet(styles);
  const inset = useSafeAreaInsets();

  // Passes state to createUser action
  const registerToDomain = () => {
    dispatch(getUnauthData(inputs.domainCode)).then((success) => {
      if (success) {
        navigation.navigate("Register User")
      }
    });
  };

  // Button to submit form and register user
  const ContinueButton = (props) => <SubmitButton {...props} title={"Continue"} />;

  return (
    <InputsList
      style={themedStyles.container}
      contentContainerStyle={{ paddingBottom: inset.bottom }}
      ListHeaderComponent={() => (
        <View style={themedStyles.header}>
          <AnimatedTouchable
            style={themedStyles.closeButton}
            onPress={() => navigation.navigate("Main", { screen: "Login" })}
            endSize={0.8}
          >
            <Ionicons name={"close"} size={Layout.fonts.icon} color={getColors().primaryText} />
          </AnimatedTouchable>
          <Text style={themedStyles.title}>Enter organization code</Text>
        </View>
      )}
      SubmitButton={ContinueButton}
      data={[DomainCodeField]}
      state={inputs}
      setInputs={setInputs}
      onSubmit={registerToDomain}
    />
  );
};

export default DomainScreen;

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
    alignItems: "flex-start",
    marginVertical: 40,
    justifyContent: "center",
    flexDirection: "row"
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
    margin: 20,
    textAlign: "center",
    color: Colors.primaryText,
    maxWidth: Layout.window.width - 80
  }
});