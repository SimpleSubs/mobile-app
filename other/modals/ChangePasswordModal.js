import React from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";
import * as firebase from "firebase";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

const ACCENT_COLOR = "#ffd541";

export default class ChangePasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalPassword: null,
      newPassword: null,
      verifyPassword: null,
      loading: false,
      errorMessage: null,
      infoMessage: null
    };
    this.submit = this.submit.bind(this);
  }


  submit() {
    if (!this.verify()) {
      return false;
    }
    this.setState({errorMessage: null, infoMessage: null, loading: true});
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      this.state.originalPassword
    );
    user.reauthenticateAndRetrieveDataWithCredential(credential)
      .then(() => {
        user.updatePassword(this.state.newPassword)
          .then(() => {
            this.setState({loading: false});
            this.props.setMessage("Successfully updated password");
            this.props.changeModalState(false);
          })
          .catch((error) => {
            this.setState({loading: false, errorMessage: error.message});
          });
      })
      .catch((error) => {
        this.setState({loading: false, errorMessage: error.message});
      });
  }

  verify() {
    if (!this.state.originalPassword) {
      this.setState({errorMessage: "Please enter your password"});
      return false;
    }
    if (!this.state.newPassword) {
      this.setState({errorMessage: "Please specify a password"});
      return false;
    }
    if (this.state.newPassword !== this.state.verifyPassword) {
      this.setState({errorMessage: "Your new and verified password must match"});
      return false;
    }
    return true;
  }

  render() {
    let loadingStyle = {
      backgroundColor: "transparent",
      paddingBottom: 10
    };
    if (!this.state.loading) {
      loadingStyle.height = 0;
      loadingStyle.paddingBottom = 0;
    }
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
        animationType={"fade"}
        onRequestClose={this.props.onRequestClose}
      >
        <View style={styles.background}>
          <KeyboardAvoidingView behavior={"padding"}>
            <FlatList
              contentContainerStyle={styles.container}
              scrollingEnabled={false}
              alwaysBounceVertical={false}
              ListHeaderComponent={
                <View>
                  <Text style={styles.title}>Change Password</Text>
                  <ActivityIndicator size={"large"} style={loadingStyle} animating={this.state.loading} />
                  {this.state.infoMessage &&
                  <Text style={[styles.errorMessage, {color: "#66ff64"}]}>
                    {this.state.infoMessage}
                  </Text>}
                  {this.state.errorMessage &&
                  <Text style={styles.errorMessage}>
                    {this.state.errorMessage}
                  </Text>}
                </View>
              }
              ListFooterComponent={
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity onPress={() => this.props.changeModalState(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.submit} style={styles.doneButton}>
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              }
              data={[
                { key: "originalPassword", placeholder: "Current password" },
                { key: "newPassword", placeholder: "New password" },
                { key: "verifyPassword", placeholder: "Verify new password" }
              ]}
              renderItem={({item}) => (
                <TextInput
                  secureTextEntry
                  placeholder={item.placeholder}
                  autoCapitalize={"none"}
                  style={styles.textInput}
                  onChangeText={(input) => {
                    let newState = {};
                    newState[item.key] = input;
                    this.setState(newState);
                  }}
                  value={this.state[item.key]}
                />
              )}
            />
          </KeyboardAvoidingView>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    borderRadius: 10,
    paddingTop: 20,
    paddingHorizontal: 30,
    marginHorizontal: 40,
    marginTop: "auto",
    marginBottom: "auto"
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    paddingHorizontal: 10,
    alignSelf: "center",
    marginBottom: 10
  },
  text: {
    fontFamily: "open-sans",
    fontSize: 16,
    padding: 10,
    flex: 3
  },
  textInput: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    fontFamily: "open-sans",
    fontSize: 16,
    marginTop: 8,
    minWidth: 250
  },
  passwordView: {
    flexDirection: "row",
    alignItems: "center",
    flex: 3,
    paddingRight: 10
  },
  buttonsContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    padding: 10
  },
  doneButton: {
    backgroundColor: ACCENT_COLOR,
    width: 85,
    height: 50,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  doneButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontFamily: "open-sans-bold",
  },
  cancelButton: {
    backgroundColor: "transparent",
    width: 85,
    height: 50,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#7c7c7c",
    fontSize: 20,
    fontFamily: "open-sans",
  },
  errorMessage: {
    fontFamily: "open-sans",
    textAlign: "center",
    fontSize: 16,
    color: "#ff414c"
  }
});