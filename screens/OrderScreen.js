import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import MenuModals from "../other/modals/MenuModals";

const ACCENT_COLOR = "#ffd541";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      checkboxHeight: 0
    };
    this.changeCheckboxHeight = this.changeCheckboxHeight.bind(this);
  }

  changeCheckboxHeight(event) {
    this.setState({checkboxHeight: event.nativeEvent.layout.height})
  }

  render() {
    const screenWidth = Dimensions.get("window").width;
    return (
      <SafeAreaView style={{ alignContent: "center" }}>
        <View style={[styles.header, { width: screenWidth, padding: screenWidth * 0.05, paddingTop: 0 }]}>
          <Text style={styles.title}>Place an order</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.pop()}>
              <View style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.pop()}>
              <View style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Done</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.container}>
          <MenuModals />
          <View style={{backgroundColor: "transparent", height: 50}} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// TODO: Add box shadow for android (shadow props only support iOS)
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
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
    alignItems: "center",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    marginLeft: 0,
  },
  buttonsContainer: {
    zIndex: 1000,
    flexDirection: "row",
    marginLeft: "auto",
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
});