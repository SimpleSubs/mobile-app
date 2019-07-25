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
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import Colors from "../constants/Colors";

// Creates and renders the login screen
export default class LoginScreen extends React.Component {
  // Page is re-rendered when state is changed
  state = {
    email: "",
    password: "",
    loading: false,
    errorMessage: null,
    showModal: false,
    navigate: false
  };

  // Resets state to original value
  resetAll = () => this.setState({
    email: "",
    password: "",
    loading: false,
    errorMessage: null,
    infoMessage: null,
    showModal: false,
    navigate: false
  });

  // Logs user in and navigates to home page OR displays error message
  handleLogin = () => {
    const { email, password } = this.state;
    if (!(this.state.email.length > 0 && this.state.password.length > 0)) {
      this.setState({ errorMessage: "Please fill in all of the text fields" });
      return;
    }
    this.setState({ loading: true, errorMessage: null });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => setTimeout(this.navigateHome, 100))
      .catch(error => this.setState({ errorMessage: error.message, loading: false }))
  };

  // Navigates to home screen
  navigateHome = () => this.props.navigation.navigate("Home", { resetAll: this.resetAll });

  // Shows or hides forgot password modal according to status param
  changeModalStatus = (status) => this.setState({ showModal: status });

  // Loads and navigates to home screen if user is already logged in
  componentDidMount() {
    let loading = this.props.navigation.getParam("loading", false);
    if (loading) {
      this.setState({ loading });
      this.navigateHome();
    }
  }

  // Navigates home after 100 ms if this.state.navigate is true
  componentDidUpdate() {
    if (this.state.navigate) setTimeout(this.navigateHome, 100);
  }

  // Renders login screen
  render() {
    const { width } = Dimensions.get("window");
    let loadingStyle = {
      backgroundColor: "transparent",
      paddingBottom: 10
    };
    // Collapses loading container if page is not loading
    if (!this.state.loading) {
      loadingStyle.height = 0;
      loadingStyle.paddingBottom = 0;
    }
    return (
      <SafeAreaView style={styles.container}>
        <ForgotPasswordModal
          visible={this.state.showModal}
          changeModalState={this.changeModalStatus}
          setInfoMessage={(message) => {
            this.setState({ infoMessage: message })
          }}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <KeyboardAvoidingView behavior={"position"} enabled>
              <Text style={styles.title}>Log In</Text>
              <ActivityIndicator size={"small"} style={loadingStyle} animating={this.state.loading} />
              <TextInput
                keyboardType={"email-address"}
                placeholder={"Email"}
                autoCapitalize={"none"}
                style={styles.textInput}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
              <TextInput
                secureTextEntry
                placeholder={"Password"}
                autoCapitalize={"none"}
                style={styles.textInput}
                onChangeText={password => this.setState({password})}
                value={this.state.password}
              />
              {this.state.infoMessage &&
              <Text style={[styles.errorMessage, { color: "#4ca84a" }]}>
                {this.state.infoMessage}
              </Text>}
              {this.state.errorMessage &&
              <Text style={styles.errorMessage}>
                {this.state.errorMessage}
              </Text>}
              <TouchableOpacity
                onPress={this.handleLogin}
                style={[styles.loginButton, { width: width - 2 * styles.container.padding }]}>
                <Text style={styles.signUpButtonText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: width - 2 * styles.container.padding}}
                onPress={() => {
                  this.props.navigation.push("Register");
                  this.resetAll();
                }}>
                <Text style={styles.loginButtonText}>Don't have an account? Sign up here.</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: width - 2 * styles.container.padding}}
                onPress={() => this.changeModalStatus(true)}>
                <Text style={styles.loginButtonText}>I forgot my password!</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    )
  }
}

// Styles for login screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
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
    backgroundColor: Colors.accentColor,
    width: 100,
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
    color: Colors.linkText,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10
  },
  errorMessage: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: Colors.errorColor,
    marginTop: 10,
    textAlign: "center"
  }
});