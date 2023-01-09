import React from "react";
import { View } from "react-native";
import InputsList from "../../../components/userFields/UserInputsList";
import SubmitButton from "../../../components/userFields/SubmitButton";
import Header from "../../../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { watchUserData, editUserData } from "../../../redux/Thunks";
import { DomainNameField, EmailField, PasswordField } from "../../../constants/RequiredFields";
import createStyleSheet from "../../../constants/Colors";

const UserSettingsScreen = ({ navigation }) => {
  const user = useSelector(({ user }) => user);
  const domain = useSelector(({ domain }) => domain);
  const userFields = useSelector(({ stateConstants }) => (
    [EmailField, PasswordField, DomainNameField, ...stateConstants.userFields]
  ));
  const dispatch = useDispatch();

  const [state, setInputs] = React.useState({ ...user, domain: domain.name });
  const themedStyles = createStyleSheet(styles);

  const submitData = () => dispatch(editUserData(state));
  const UpdateButton = (props) => <SubmitButton {...props} title={"Update"} style={themedStyles.updateButton} />

  // Listens for changes in user data when on this page
  React.useEffect(watchUserData, []);
  React.useEffect(() => setInputs({ ...user, domain: domain.name }), [user]);

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

export default UserSettingsScreen;

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