/**
 * @file Manages user settings screen
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet
} from "react-native";
import InputsList from "../../../components/userFields/UserInputsList";
import SubmitButton from "../../../components/userFields/SubmitButton";
import Header from "../../../components/Header";
import { connect } from "react-redux";
import { watchUserData, editUserData } from "../../../redux/Actions";
import { DomainNameField, EmailField, PasswordField } from "../../../constants/RequiredFields";
import Colors from "../../../constants/Colors";

/**
 * Renders user setting screen.
 *
 * Renders inputs list (FlatList of ValidatedInputs) displaying user fields and
 * containing user data.
 *
 * @param {Object}                           user          Object containing user data.
 * @param {Object}                           domain        Domain data for user's domain.
 * @param {Object[]}                         userFields    Array containing input fields to contain data.
 * @param {function(string, string)}         watchUserData Listener for changes in user data.
 * @param {function(Object, string, string)} editUserData  Pushes edited data to Firebase.
 * @param {Object}                           navigation    Navigation prop passed by React Navigation.
 *
 * @return {React.ReactElement} Element to display.
 * @constructor
 */
const UserSettingsScreen = ({ user, domain, userFields, watchUserData, editUserData, navigation }) => {
  const [state, setInputs] = useState({ ...user, domain: domain.name });

  const submitData = () => editUserData(state, user.uid, domain.id);
  const UpdateButton = (props) => <SubmitButton {...props} title={"Update"} style={styles.updateButton} />

  // Listens for changes in user data when on this page
  useEffect(() => watchUserData(user.uid, domain.id), []);
  useEffect(() => setInputs({ ...user, domain: domain.name }), [user]);

  return (
    <View style={styles.container}>
      <Header title={"Profile Settings"} leftButton={{ name: "ios-arrow-back", onPress: () => navigation.pop() }} />
      <InputsList
        data={userFields}
        state={state}
        setInputs={setInputs}
        onSubmit={submitData}
        editing
        SubmitButton={UpdateButton}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  )
};

const mapStateToProps = ({ user, domain, stateConstants }) => ({
  user,
  userFields: [EmailField, PasswordField, DomainNameField, ...stateConstants.userFields],
  domain
});

const mapDispatchToProps = (dispatch) => ({
  watchUserData: (uid, domain) => watchUserData(dispatch, uid, domain),
  editUserData: (data, uid, domain) => editUserData(dispatch, data, uid, domain)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.scrollViewBackground,
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  updateButton: {
    marginHorizontal: 20
  }
});