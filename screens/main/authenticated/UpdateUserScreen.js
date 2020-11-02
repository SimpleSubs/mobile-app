/**
 * @file Manages screen to update user profile.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet, Text
} from "react-native";
import InputsList from "../../../components/userFields/UserInputsList";
import SubmitButton from "../../../components/userFields/SubmitButton";
import { connect } from "react-redux";
import { watchUserData, editUserData, logOut } from "../../../redux/Actions";
import Colors from "../../../constants/Colors";
import { valueIsValid } from "../../../constants/Inputs";
import Layout from "../../../constants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Renders screen to update user info.
 *
 * Renders inputs list (FlatList of ValidatedInputs) displaying invalid user fields
 * so that user must update user fields when changed from backend.
 *
 * @param {Object}                   user          Object containing user data.
 * @param {Object[]}                 userFields    Array containing all invalid input fields.
 * @param {function(Object, string)} editUserData  Pushes edited data to Firebase.
 * @param {function()}               logOut        Function to log user out of account
 * @param {Object}                   navigation    Navigation prop passed by React Navigation.
 *
 * @return {React.ReactElement} Element to display.
 * @constructor
 */
const UpdateUserScreen = ({ user, userFields, editUserData, logOut, navigation }) => {
  const [state, setInputs] = useState(user);
  const inset = useSafeAreaInsets();

  const submitData = () => {
    editUserData(state, user.uid);
    navigation.replace("Home");
  };
  const UpdateButton = (props) => <SubmitButton {...props} title={"Update"} style={styles.updateButton} />

  useEffect(() => navigation.addListener("beforeRemove", (e) => {
    if (e.data.action.type === "POP") {
      logOut();
    }
  }), []);

  return (
    <InputsList
      style={styles.container}
      contentContainerStyle={{ paddingTop: inset.top, paddingBottom: inset.bottom }}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Text style={styles.title}>Update profile settings</Text>
          <Text style={styles.text}>
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

const mapStateToProps = ({ user, stateConstants }) => ({
  user,
  // Only include invalid userFields
  userFields: stateConstants.userFields.filter((userField) => !valueIsValid(userField, user ? user[userField.key] : null))
});

const mapDispatchToProps = (dispatch) => ({
  watchUserData: (uid) => watchUserData(dispatch, uid),
  editUserData: (data, uid) => editUserData(dispatch, data, uid),
  logOut: () => logOut(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserScreen);

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