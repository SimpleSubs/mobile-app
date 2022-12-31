import React, { useEffect, useState } from "react";
import { View } from "react-native";
import InputsList from "../../../components/userFields/UserInputsList";
import SubmitButton from "../../../components/userFields/SubmitButton";
import Header from "../../../components/Header";
import { connect } from "react-redux";
import { watchUserData, editUserData } from "../../../redux/Actions";
import { DomainNameField, EmailField, PasswordField } from "../../../constants/RequiredFields";
import createStyleSheet from "../../../constants/Colors";

const UserSettingsScreen = ({ user, domain, userFields, watchUserData, editUserData, navigation }) => {
  const [state, setInputs] = useState({ ...user, domain: domain.name });
  const themedStyles = createStyleSheet(styles);

  const submitData = () => editUserData(state, user.uid, domain.id);
  const UpdateButton = (props) => <SubmitButton {...props} title={"Update"} style={themedStyles.updateButton} />

  // Listens for changes in user data when on this page
  useEffect(() => watchUserData(user.uid, domain.id), []);
  useEffect(() => setInputs({ ...user, domain: domain.name }), [user]);

  return (
    <View style={themedStyles.container}>
      <Header title={"Profile Settings"} leftButton={{ name: "arrow-back", onPress: () => navigation.pop() }} />
      <InputsList
        data={userFields}
        state={state}
        setInputs={setInputs}
        onSubmit={submitData}
        editing
        SubmitButton={UpdateButton}
        contentContainerStyle={themedStyles.contentContainer}
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

const styles = (Colors) => ({
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