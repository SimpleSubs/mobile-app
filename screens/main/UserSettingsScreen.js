import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet
} from "react-native";
import InputsList from "../../components/userFields/UserInputsList";
import SubmitButton from "../../components/userFields/SubmitButton";
import Header from "../../components/Header";

import { connect } from "react-redux";
import { watchUserData, editUserData } from "../../redux/Actions";
import { SettingsFields } from "../../constants/RequiredUserFields";

import Colors from "../../constants/Colors";

const UserSettingsScreen = ({ user, userFields, watchUserData, editUserData, navigation }) => {
  const [state, setInputs] = useState(user);

  const submitData = () => editUserData(state, user.uid);
  const UpdateButton = (props) => <SubmitButton {...props} title={"Update"} style={styles.updateButton} />

  useEffect(() => watchUserData(user.uid), []);

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

const mapStateToProps = ({ user, stateConstants }) => ({
  user,
  userFields: [...SettingsFields, ...stateConstants.userFields]
});

const mapDispatchToProps = (dispatch) => ({
  watchUserData: (uid) => watchUserData(dispatch, uid),
  editUserData: (data, uid) => editUserData(dispatch, data, uid)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mode === "DARK" ? Colors.scrollViewBackground : Colors.backgroundColor,
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