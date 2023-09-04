import React from "react";
import {
  View,
  Text
} from "react-native";
import InputsList from "../../../components/userFields/UserInputsList";
import SubmitButton from "../../../components/userFields/SubmitButton";
import { useSelector, useDispatch } from "react-redux";
import { editUserData, logOut } from "../../../redux/Thunks";
import createStyleSheet from "../../../constants/Colors";
import { valueIsValid } from "../../../constants/Inputs";
import Layout from "../../../constants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UpdateUserScreen = ({ navigation }) => {
  const user = useSelector(({ user }) => user);
  const userFields = useSelector(({ stateConstants }) => (
    stateConstants.userFields.filter((userField) => !valueIsValid(userField, user && user[userField.key]))
  ));
  const dispatch = useDispatch();

  const [state, setInputs] = React.useState(user);
  const themedStyles = createStyleSheet(styles);
  const inset = useSafeAreaInsets();

  const submitData = () => {
    dispatch(editUserData(state));
    navigation.navigate("Loading");
  };
  const UpdateButton = (props) => <SubmitButton {...props} title={"Update"} style={themedStyles.updateButton} />

  React.useEffect(() => navigation.addListener("beforeRemove", (e) => {
    if (e.data.action.type === "POP") {
      dispatch(logOut());
    }
  }), []);

  return (
    <InputsList
      style={themedStyles.container}
      contentContainerStyle={{ paddingTop: inset.top, paddingBottom: inset.bottom }}
      ListHeaderComponent={() => (
        <View style={themedStyles.header}>
          <Text style={themedStyles.title}>Update profile settings</Text>
          <Text style={themedStyles.text}>
            Profile parameters have been changed since you last used the app. Please update the following fields.
          </Text>
        </View>
      )}
      data={userFields}
      state={state}
      setInputs={setInputs}
      onSubmit={submitData}
      SubmitButton={UpdateButton}
    />
  )
};

export default UpdateUserScreen;

const styles = (Colors) => ({
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
  text: {
    fontFamily: "josefin-sans",
    color: Colors.primaryText,
    fontSize: Layout.fonts.body,
    marginVertical: 5,
    textAlign: "center",
    marginHorizontal: 30
  },
  updateButton: {
    borderRadius: 100,
    backgroundColor: Colors.accentColor,
    padding: 20,
    marginVertical: 20
  },
  updateButtonText: {
    color: Colors.textOnBackground,
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center"
  }
});