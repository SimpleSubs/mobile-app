import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

const ACCENT_COLOR = "#ffd541";

export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      pin: "",
      name: "",
      grade: "",
      loading: false,
      errorMessage: null
    };
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  resetAll() {
    this.setState({
      email: "",
      password: "",
      pin: "",
      name: "",
      grade: "",
      loading: false,
      errorMessage: null
    })
  }

  validate() {
    for (let input in this.state) {
      if (this.state.hasOwnProperty(input) && input !== "errorMessage" && this.state[input].length === 0) {
        console.log(input);
        this.setState({ errorMessage: "Please fill in all of the text fields" });
        return false;
      }
    }
    if (this.state.pin.length !== 4 || isNaN(parseInt(this.state.pin))) {
      this.setState({ errorMessage: "Please enter a valid PIN number" });
      return false;
    }
    let grade = parseInt(this.state.grade);
    if ((!(grade >= 9) && !(grade <= 12)) || grade !== 0) {
      this.setState({ errorMessage: "Please enter a valid grade" });
      return false;
    }
    return true;
  }

  handleSignUp() {
    if (!this.validate()) {
      return;
    }
    this.setState({ loading: true, errorMessage: null });
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        let currentUser = firebase.auth().currentUser;
        firebase
          .firestore()
          .collection("userData").doc(currentUser.uid).set({
            name: this.state.name,
            grade: this.state.grade,
            pin: this.state.pin
          })
          .then(() => {
            this.props.navigation.push("Home");
            this.resetAll();
          })
          .catch(error => {
            this.setState({ errorMessage: error.message, loading: false });
            currentUser.delete();
          })
      })
      .catch(error => this.setState({ errorMessage: error.message }))
  };

  render() {
    const screenWidth = Dimensions.get("window").width;
    let loadingStyle = {
      backgroundColor: "transparent",
      paddingBottom: 10
    };
    if (!this.state.loading) {
      loadingStyle.height = 0;
      loadingStyle.paddingBottom = 0;
    }
    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <KeyboardAwareFlatList
              enableOnAndroid
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ marginTop: "auto", marginBottom: "auto" }}
              scrollingEnabled={false}
              alwaysBounceVertical={false}
              ListHeaderComponent={
                <View>
                  <Text style={styles.title}>Create an Account</Text>
                  <ActivityIndicator style={loadingStyle} size={"small"} animating={this.state.loading} />
                </View>
              }
              ListFooterComponent={
                <View>
                  {this.state.errorMessage &&
                  <Text style={styles.errorMessage}>
                    {this.state.errorMessage}
                  </Text>}
                  <TouchableOpacity
                    onPress={this.handleSignUp}
                    style={[styles.loginButton, { width: screenWidth - 2 * styles.container.padding }]}>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{width: screenWidth - 2 * styles.container.padding}}
                    onPress={() => {
                      this.props.navigation.push("Login");
                      this.resetAll();
                    }}>
                    <Text style={styles.loginButtonText}>Already have an account? Log in here.</Text>
                  </TouchableOpacity>
                </View>
              }
              data={[
                { key: "name", placeholder: "Name (first and last)", contentType: "name", autoCapitalize: "words" },
                { key: "grade", placeholder: "Grade (enter 0 for Faculty/Staff)", keyboardType: "number-pad" },
                { key: "pin", placeholder: "Caf PIN", keyboardType: "number-pad" },
                { key: "email", placeholder: "Email", contentType: "username", keyboardType: "email-address", autoCapitalize: "none" },
                { key: "password", placeholder: "Password", contentType: "password", secureTextEntry: true },
              ]}
              renderItem={({ item }) => (
                <TextInput
                  placeholder={item.placeholder}
                  textContentType={item.contentType}
                  keyboardType={item.keyboardType}
                  autoCapitalize={item.autoCapitalize}
                  secureTextEntry={item.secureTextEntry}
                  onChangeText={(input) => {
                    let newState = {};
                    newState[item.key] = input;
                    this.setState(newState);
                  }}
                  style={styles.textInput}
                  value={this.state[item.key]}
                />
              )}
            />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    fontFamily: "open-sans",
    fontSize: 16,
    marginTop: 8
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "open-sans",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#a0a0a0"
  },
  loginButton: {
    backgroundColor: ACCENT_COLOR,
    height: 65,
    borderRadius: 75 / 2,
    alignContent: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  signUpButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontFamily: "open-sans-bold",
  },
  loginButtonText: {
    fontFamily: "open-sans",
    color: "#0076ff",
    fontSize: 16,
    textAlign: "center",
  },
  errorMessage: {
    fontFamily: "open-sans",
    textAlign: "center",
    fontSize: 16,
    color: "#ff414c",
    marginTop: 10
  }
});