import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform
} from "react-native";
import MenuModals from "../components/modals/MenuModals";
import * as firebase from "firebase";
import "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import Ingredients from "../constants/Ingredients";
import Colors from "../constants/Colors";
import Time from "../constants/Time";

// Makes date a weekday
function makeWeekday(date) {
  if (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 2);
  }
}

// Returns cutoff date for sandwich orders (tomorrow if today is past cutoff time, or a weekday if it is a weekend currently)
function makeToday() {
  let today = new Date();
  let cutoff = new Date();
  cutoff.setHours(Time.cutoff.hour, Time.cutoff.minutes, 0, 0);
  // Sets cutoff to tomorrow if today is past cutoff time
  if (cutoff < today) {
    today.setDate(today.getDate() + 1);
  }
  // Converts to nearest future weekday
  if (today.getDay() === 0) {
    today.setDate(today.getDate() + 1);
  } else if (today.getDay() === 6) {
    today.setDate(today.getDate() + 2);
  }
  today.setHours(Time.cutoff.hour, Time.cutoff.minutes, 0, 0);
  return today;
}

// Returns an array of date options, up to 7 days in the future (excluding dates that already have orders)
function getDateOptions(prevDates) {
  let today = makeToday();
  let newDate = new Date(today);
  let dateOptions = [];
  if (!prevDates.includes(today.getDate())) {
    dateOptions.push(today);
  }
  // Adds up to 7 days to dateOptions
  for (let i = 0; i < 6; i++) {
    newDate = new Date(newDate);
    newDate.setDate(newDate.getDate() + 1);
    makeWeekday(newDate);
    // Adds day to dateOptions if order does not exist on that day
    if (!prevDates.includes(newDate.getDate())) {
      dateOptions.push(newDate);
    }
  }
  return dateOptions;
}

// Converts date object into string formatted as "[day of week], [month] [date]" (e.g. Monday, June 21)
function getDayString(date) {
  let timezoneDate = new Date(date);
  return `${Time.daysOfWeek[timezoneDate.getDay()]}, ${Time.months[timezoneDate.getMonth()]} ${timezoneDate.getDate()}`;
}

// Button to delete previous order
const DeleteButton = ({ id, deleteFunc }) => (
  id ?
    <TouchableOpacity onPress={deleteFunc} style={styles.deleteButton}>
      <Ionicons name={`${Platform.OS === "ios" ? "ios" : "md"}-trash`} size={30} color={"#fff"} style={styles.trashIcon} />
      <Text style={styles.deleteButtonText}>Delete order</Text>
    </TouchableOpacity> :
    <View />
);

// Cancel and submit buttons at top of screen
const CancelSubmitButtons = ({ cancelHandler, doneHandler, screenWidth }) => (
  screenWidth >= 375 ?
    <View style={styles.buttonsContainer}>
      <TouchableOpacity onPress={cancelHandler} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={doneHandler} style={styles.doneButton}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View> :
    <View style={styles.buttonsContainer}>
      <TouchableOpacity onPress={cancelHandler} style={styles.iconButtons}>
        <Ionicons name={`${Platform.OS === "ios" ? "ios" : "md"}-close`} color={styles.cancelButtonText.color} size={50} />
      </TouchableOpacity>
      <TouchableOpacity onPress={doneHandler} style={styles.iconButtons}>
        <Ionicons name={`${Platform.OS === "ios" ? "ios" : "md"}-checkmark-circle`} color={Colors.accentColor} size={50} />
      </TouchableOpacity>
    </View>
);

// Creates and renders order screen
export default class OrderScreen extends React.Component {
  prevOrders = this.props.navigation.getParam("prevOrders", []);
  prevDates = this.prevOrders.map(({ date }) => date.getDate());
  dateOptions = getDateOptions(this.prevDates);
  dateStrings = this.dateOptions.map((date) => getDayString(date));

  // Page is re-rendered when state is changed
  state = {
    bread: Platform.OS === "ios" ? "Please select" : Ingredients.bread[0],
    date: Platform.OS === "ios" ? "Please select" : this.dateStrings[0],
    meat: [],
    cheese: [],
    condiments: [],
    extras: [],
    errorMessage: null,
    loading: false,
    id: null
  };

  // Changes ingredient in specified category
  changeItem = (category, item) => {
    let state = {};
    state[category] = item;
    this.setState(state);
  };

  // Adds or removes ingredient from category based on if checkbox is checked or not
  handleCheckboxes = (title, checked, category) => {
    let checkedArr = this.state[category];
    let setStateVal = {};
    if (checked) {
      setStateVal[category] = checkedArr.filter((value) => value !== title);
    } else {
      checkedArr.push(title);
      setStateVal[category] = checkedArr;
    }
    this.setState(setStateVal);
  };

  // Navigates home
  navigateBack = () => {
    const { getParam } = this.props.navigation;
    const getOrders = getParam("getOrders", () => []);
    this.setState({ loading: false });
    this.props.navigation.navigate("Home");
    getOrders();
  };

  // Deletes the currently selected order
  deleteOrder = () => {
    this.setState({loading: true});
    if (this.state.id === null) return;
    firebase.firestore()
      .collection("orders")
      .doc(firebase.auth().currentUser.uid)
      .collection("myOrders")
      .doc(this.state.id)
      .delete()
      .then(this.navigateBack)
      .catch((error) => this.setState({errorMessage: error, loading: false}));
  };

  // Ensures all required fields have been selected
  validateOrder = (order) => {
    if (order.bread === "Please select") {
      this.setState({ errorMessage: "Please select a bread" });
      return false;
    }
    if (order.date === "Please select") {
      this.setState({ errorMessage: "Please select a date" });
      return false;
    }
    return true;
  };

  // Submits order and pushes it to Firebase
  submit = () => {
    if (this.state.loading) return;
    let order = Object.assign({}, this.state);
    delete order.errorMessage;
    delete order.loading;
    delete order.id;
    if (!this.validateOrder(order)) return;
    let dateObj = this.dateOptions[this.dateStrings.indexOf(order.date)];
    order.date = firebase.firestore.Timestamp.fromDate(dateObj); // Gets timestamp of date
    this.setState({ loading: true, errorMessage: null });
    let pushEndpoint = firebase.firestore()
      .collection("orders")
      .doc(firebase.auth().currentUser.uid)
      .collection("myOrders");
    // Updates order if it exists, otherwise creates a new one
    if (this.state.id) {
      pushEndpoint
        .doc(this.state.id)
        .set(order)
        .then(this.navigateBack)
        .catch(error => this.setState({ errorMessage: error.message, loading: false }));
    } else {
      pushEndpoint
        .add(order)
        .then(this.navigateBack)
        .catch(error => this.setState({ errorMessage: error.message, loading: false }));
    }
  };

  componentWillMount() {
    this.setState({ loading: true });
  }

  // Checks to see if user is editing an existing order or creating a new one
  componentDidMount() {
    let prevData = this.props.navigation.getParam("data", null);
    let id = this.props.navigation.getParam("id", null);
    if (prevData && id) {
      prevData.date = getDayString(prevData.date.toDate());
      this.setState(prevData);
      this.setState({ id });
    }
    this.setState({ loading: false });
  }

  // Renders order screen
  render() {
    let loadingStyle = {
      backgroundColor: "#fff",
      padding: 10
    };
    // Collapses loading container if page is not loading
    if (!this.state.loading) {
      loadingStyle.height = 0;
      loadingStyle.padding = 0;
    }
    const screenWidth = Dimensions.get("window").width;
    return (
      <SafeAreaView style={{ alignContent: "center" }}>
        <View style={[styles.header, { width: screenWidth, padding: screenWidth * 0.05 }]}>
          <Text style={styles.title}>Place an order</Text>
          <CancelSubmitButtons
            cancelHandler={this.navigateBack}
            doneHandler={this.submit}
            screenWidth={screenWidth}
          />
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <ActivityIndicator size={"large"} style={loadingStyle} animating={this.state.loading} />
          {this.state.errorMessage &&
          <Text style={styles.errorMessage}>
            {this.state.errorMessage}
          </Text>}
          <MenuModals
            dateStrings={this.dateStrings}
            changeItem={this.changeItem}
            handleCheckboxes={this.handleCheckboxes}
            state={this.state}
          />
          <DeleteButton deleteFunc={this.deleteOrder} id={this.state.id} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  contentContainer: {
    paddingBottom: Platform.OS === "ios" ? 65 : 100
  },
  header: {
    paddingTop: 0,
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
    elevation: 8,
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
    backgroundColor: Colors.accentColor,
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
  iconButtons: {
    height: 50,
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 25
  },
  deleteButton: {
    backgroundColor: Colors.errorColor,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  deleteButtonText: {
    fontFamily: "open-sans-bold",
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  trashIcon: {
    paddingRight: 10
  },
  errorMessage: {
    fontFamily: "open-sans",
    textAlign: "center",
    fontSize: 16,
    color: Colors.errorColor,
    padding: 10,
    flex: 1,
    backgroundColor: "#fff"
  }
});