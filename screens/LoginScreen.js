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
import ForgotPasswordModal from "../other/modals/ForgotPasswordModal";

const ACCENT_COLOR = "#ffd541";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
      errorMessage: null,
      showModal: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.changeModalStatus = this.changeModalStatus.bind(this);
  }

  resetAll() {
    this.setState({
      email: "",
      password: "",
      loading: false,
      errorMessage: null,
      showModal: false
    });
  }

  handleLogin() {
    const { email, password } = this.state;
    if (!(this.state.email.length > 0 && this.state.password.length > 0)) {
      this.setState({ errorMessage: "Please fill in all of the text fields" });
      return;
    }
    this.setState({ loading: true, errorMessage: null });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.push("Home");
        if (this.state.loading) {
          this.resetAll();
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message, loading: false })
      })
  };

  changeModalStatus(status) {
    this.setState({ showModal: status });
  }

  componentDidMount() {
    let execute = this.props.navigation.getParam("execute", null);
    if (execute) {
      this.setState({ loading: true });
      execute(() => {
        if (this.state.loading) this.setState({ loading: false });
      });
    }
  }

  componentWillUnmount() {
    this.resetAll();
  }

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
        <ForgotPasswordModal visible={this.state.showModal} changeModalState={this.changeModalStatus} />
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
                onChangeText={email => this.setState({email})}
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
              {this.state.errorMessage &&
              <Text style={styles.errorMessage}>
                {this.state.errorMessage}
              </Text>}
              <TouchableOpacity
                onPress={this.handleLogin}
                style={[styles.loginButton, {width: screenWidth - 2 * styles.container.padding}]}>
                <Text style={styles.signUpButtonText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: screenWidth - 2 * styles.container.padding}}
                onPress={() => {
                  this.props.navigation.push("Register");
                  this.resetAll();
                }}>
                <Text style={styles.loginButtonText}>Don't have an account? Sign up here.</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: screenWidth - 2 * styles.container.padding}}
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
    backgroundColor: ACCENT_COLOR,
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
    color: "#0076ff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10
  },
  errorMessage: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#ff414c",
    marginTop: 10,
    textAlign: "center"
  }
});