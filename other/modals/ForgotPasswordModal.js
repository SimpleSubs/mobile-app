import React from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal, ActivityIndicator
} from "react-native";
import * as firebase from "firebase";

const ACCENT_COLOR = "#ffd541";

export default class ForgotPasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      loading: false,
      errorMessage: null
    };
    this.submit = this.submit.bind(this);
  }


  submit() {
    if (!this.verify()) {
      return false;
    }
    this.setState({ errorMessage: null, loading: true });
    firebase.auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => {
        this.setState({ loading: false });
        this.props.changeModalState(false);
      })
      .catch((error) => {
        this.setState({ loading: false, errorMessage: error.message });
      });
  }

  verify() {
    if (!this.state.email) {
      this.setState({ errorMessage: "Please enter your email address" });
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
        onRequestClose={() => this.props.changeModalState(false)}
      >
        <View style={styles.background}>
          <KeyboardAvoidingView behavior={"position"}>
            <View style={styles.container}>
              <Text style={styles.title}>Reset Password</Text>
              <ActivityIndicator size={"large"} style={loadingStyle} animating={this.state.loading} />
              {this.state.errorMessage &&
              <Text style={styles.errorMessage}>
                {this.state.errorMessage}
              </Text>}
              <TextInput
                keyboardType={"email-address"}
                placeholder={"Email"}
                autoCapitalize={"none"}
                style={styles.textInput}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => this.props.changeModalState(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.submit} style={styles.doneButton}>
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    marginHorizontal: 40
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