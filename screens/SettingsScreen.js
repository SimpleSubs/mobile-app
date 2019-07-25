import React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Text,
  View, ActivityIndicator
} from "react-native";
import Header from "../components/Header";
import SettingsItem from "../components/SettingsItem";
import * as firebase from "firebase";
import "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import Colors from "../constants/Colors";

// Creates and renders the settings screen
export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      pin: "",
      grade: "",
      name: "",
      errorMessage: null,
      infoMessage: null,
      modalVisible: false,
      placeholderPass: ""
    };
  }

  // Changes the visibility of reset password modal according to status param
  changeModalVisibility = (status) => this.setState({ modalVisible: status });

  // Determines if newly entered settings data is valid
  validate(newData) {
    if (newData.pin.length !== 4 || isNaN(parseInt(newData.pin))) {
      this.setState({ errorMessage: "Please enter a valid pin number" });
      return false;
    }
    let grade = parseInt(newData.grade);
    if (!(grade >= 9) && !(grade <= 12) || grade !== 0) {
      this.setState({ errorMessage: "Please enter a valid grade" });
      return false;
    }
    return true;
  }

  // Pushes new user data to Firebase
  changeUserData = (category, newData) => {
    // Returns if text has not changed
    if (newData.nativeEvent.text === this.state[category]) {
      return;
    }
    this.setState({ loading: true, errorMessage: null, infoMessage: null });
    let data = {
      email: this.state.email,
      password: this.state.password,
      pin: this.state.pin,
      grade: this.state.grade,
      name: this.state.name
    };
    // Sets edited category to edited content
    data[category] = newData.nativeEvent.text;
    if (!this.validate(data)) {
      this.setState({ loading: false });
      return;
    }
    // Pushes data to Firebase
    firebase.firestore()
      .collection("userData")
      .doc(firebase.auth().currentUser.uid)
      .set(data)
      .then(() => this.setState({ infoMessage: "Successfully updated user data", loading: false }))
      .catch((error) => this.setState({ errorMessage: error, loading: false }));
  };

  // Gets user data from Firebase
  readFirestoreData() {
    this.setState({ loading: true, errorMessage: null, infoMessage: null });
    const email = firebase.auth().currentUser.email;
    firebase.firestore()
      .collection("userData")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        const { pin, grade, name } = doc.data();
        this.setState({ pin, grade, name, email, placeholderPass: "********", loading: false });
      })
      .catch((error) => this.setState({ errorMessage: error, loading: false }));
  }

  componentDidMount() {
    this.readFirestoreData();
  }

  // Renders the settings screen
  render() {
    let loadingStyle = {
      backgroundColor: "transparent",
      paddingBottom: 10,
      paddingTop: 20
    };
    // Collapses loading container if page is not loading
    if (!this.state.loading) {
      loadingStyle.height = 0;
      loadingStyle.paddingBottom = 0;
      loadingStyle.paddingTop = 0;
    }
    return (
      <SafeAreaView style={{ alignContent: "center" }}>
        <Header title={"Settings"} buttons={
          <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.navigate("Home")}>
            <Ionicons name={`${Platform.OS === "ios" ? "ios" : "md"}-arrow-back`} size={35} color={"#000"} />
          </TouchableOpacity>
        } />
        <ChangePasswordModal
          onRequestClose={() => this.changeModalVisibility(false)}
          visible={this.state.modalVisible}
          changeModalState={this.changeModalVisibility}
          setMessage={(message) => this.setState({infoMessage: message})}
        />
        <FlatList
          style={styles.container}
          showsVerticalScrollIndicator={false}
          enableScrolling={false}
          alwaysBounceVertical={false}
          ListHeaderComponent={(
            <View>
              <ActivityIndicator size={"large"} style={loadingStyle} animating={this.state.loading} />
              {this.state.infoMessage &&
              <Text style={[styles.errorMessage, { color: Colors.infoColor }]}>
                {this.state.infoMessage}
              </Text>}
              {this.state.errorMessage &&
              <Text style={styles.errorMessage}>
                {this.state.errorMessage}
              </Text>}
            </View>
          )}
          data={[
            { key: "Email", category: "email", value: this.state.email, mutable: false, protected: false },
            { key: "Password", category: "password", value: this.state.placeholderPass, mutable: true, protected: true },
            { key: "Name", category: "name", value: this.state.name, mutable: true, keyboardType: "default", protected: false },
            { key: "Grade", category: "grade", value: this.state.grade, mutable: true, keyboardType: "number-pad", protected: false },
            { key: "Caf PIN", category: "pin", value: this.state.pin, mutable: true, keyboardType: "number-pad", protected: false }
          ]}
          renderItem={({item}) =>
            <SettingsItem
              title={item.key}
              changeUserData={this.changeUserData}
              value={item.value}
              mutable={item.mutable}
              protected={item.protected}
              category={item.category}
              keyboardType={item.keyboardType}
              changeModalState={this.changeModalVisibility}
            />
          }
        />
      </SafeAreaView>
    );
  }
}

// Styles for settings screen
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.containerBackground,
    height: "100%",
  },
  header: {
    zIndex: 999,
    backgroundColor: "#fff",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 30,
    marginLeft: "auto",
    marginRight: "auto",
  },
  placeOrderButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontFamily: "open-sans-extra-bold",
  },
  date: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  },
  backButton: {
    position: "absolute",
    top: 5,
    left: 20
  },
  errorMessage: {
    fontFamily: "open-sans",
    textAlign: "center",
    fontSize: 16,
    color: Colors.errorColor,
    padding: 10,
    flex: 1,
    borderBottomColor: Colors.settingsBorder,
    borderBottomWidth: 0.25,
  }
});