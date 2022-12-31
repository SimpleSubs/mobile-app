import React, { useState, useEffect } from "react";
import {
  View,
  Text
} from "react-native";
import InputsList from "../../../components/userFields/UserInputsList";
import SubmitButton from "../../../components/userFields/SubmitButton";
import { connect } from "react-redux";
import { editUserData, logOut } from "../../../redux/Actions";
import createStyleSheet from "../../../constants/Colors";
import { valueIsValid } from "../../../constants/Inputs";
import Layout from "../../../constants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UpdateUserScreen = ({ user, domain, userFields, editUserData, logOut, navigation }) => {
  const [state, setInputs] = useState(user);
  const themedStyles = createStyleSheet(styles);
  const inset = useSafeAreaInsets();

  const submitData = () => {
    editUserData(state, user.uid, domain);
    navigation.replace("Home");
  };
  const UpdateButton = (props) => <SubmitButton {...props} title={"Update"} style={themedStyles.updateButton} />

  useEffect(() => navigation.addListener("beforeRemove", (e) => {
    if (e.data.action.type === "POP") {
      logOut();
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

const mapStateToProps = ({ user, stateConstants, domain }) => ({
  user,
  domain: domain.id,
  // Only include invalid userFields
  userFields: stateConstants.userFields.filter((userField) => !valueIsValid(userField, user ? user[userField.key] : null))
});

const mapDispatchToProps = (dispatch) => ({
  editUserData: (data, uid, domain) => editUserData(dispatch, data, uid, domain),
  logOut: () => logOut(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserScreen);

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