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
import MenuModals from "../other/modals/MenuModals";
import * as firebase from "firebase";
import "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { BREAD } from "../other/modals/MenuModals";

const ACCENT_COLOR = "#ffd541";
const CUTOFF_HOURS = 9;
const CUTOFF_MINUTES = 30;
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
  "November", "December"];

function makeWeekday(date) {
  if (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 2);
  }
}

function makeToday() {
  let today = new Date();
  let cutoff = new Date();
  cutoff.setHours(CUTOFF_HOURS);
  cutoff.setMinutes(CUTOFF_MINUTES);

  if (cutoff < today) {
    today.setDate(today.getDate() + 1);
  }
  if (today.getDay() === 0) {
    today.setDate(today.getDate() + 1);
  } else if (today.getDay() === 6) {
    today.setDate(today.getDate() + 2);
  }
  today.setHours(CUTOFF_HOURS);
  today.setMinutes(CUTOFF_MINUTES);
  today.setSeconds(0);
  return today;
}

function getDateOptions(prevDates) {
  let today = makeToday();
  let newDate = new Date(today);
  let dateOptions = [];
  if (!prevDates.includes(today.getDate())) {
    dateOptions.push(today);
  }
  for (let i = 0; i < 6; i++) {
    newDate = new Date(newDate);
    newDate.setDate(newDate.getDate() + 1);
    makeWeekday(newDate);
    if (!prevDates.includes(newDate.getDate())) {
      dateOptions.push(newDate);
    }
  }
  return dateOptions;
}

function getDayString(date) {
  let timezoneDate = new Date(date);
  return `${DAYS_OF_WEEK[timezoneDate.getDay()]}, ${MONTHS[timezoneDate.getMonth()]} ${timezoneDate.getDate()}`;
}

const DeleteButton = ({ id, deleteFunc }) => (
  id ?
    <TouchableOpacity onPress={deleteFunc} style={styles.deleteButton}>
      <Ionicons name={`${Platform.OS === "ios" ? "ios" : "md"}-trash`} size={30} color={"#fff"} style={styles.trashButton} />
      <Text style={styles.deleteButtonText}>Delete order</Text>
    </TouchableOpacity> :
    <View />
);

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
        <Ionicons name={`${Platform.OS === "ios" ? "ios" : "md"}-checkmark-circle`} color={ACCENT_COLOR} size={50} />
      </TouchableOpacity>
    </View>
);

export default class OrderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bread: Platform.OS === "ios" ? "Please select" : BREAD[0],
      date: Platform.OS === "ios" ? "Please select" : this.dateStrings[0],
      meat: [],
      cheese: [],
      condiments: [],
      extras: [],
      errorMessage: null,
      loading: false,
      id: null
    };
    this.changeItem = this.changeItem.bind(this);
    this.handleCheckboxes = this.handleCheckboxes.bind(this);
    this.submit = this.submit.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
  }

  prevOrders = this.props.navigation.getParam("prevOrders", []);
  prevDates = this.prevOrders.map(({date}) => date.getDate());
  dateOptions = getDateOptions(this.prevDates);
  dateStrings = this.dateOptions.map(date => getDayString(date));

  changeItem(category, item) {
    let state = {};
    state[category] = item;
    this.setState(state);
  }

  handleCheckboxes(title, checked, category) {
    let checkedArr = this.state[category];
    let setStateVal = {};
    if (checked) {
      setStateVal[category] = checkedArr.filter(function(value) {
        return value !== title;
      });
    } else {
      checkedArr.push(title);
      setStateVal[category] = checkedArr;
    }
    this.setState(setStateVal);
  }

  navigateBack() {
    const { getParam } = this.props.navigation;
    const getOrders = getParam("getOrders", () => []);
    this.setState({ loading: false });
    this.props.navigation.navigate("Home");
    getOrders();
  }

  deleteOrder() {
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
  }

  submit() {
    if (this.state.loading) return;
    let order = Object.assign({}, this.state);
    delete order.errorMessage;
    delete order.loading;
    delete order.id;
    if (order.bread === "Please select") {
      this.setState({errorMessage: "Please select a bread"});
      return;
    }
    if (order.date === "Please select") {
      this.setState({errorMessage: "Please select a date"});
      return;
    }
    let dateObj = this.dateOptions[this.dateStrings.indexOf(order.date)];
    order.date = firebase.firestore.Timestamp.fromDate(dateObj);
    this.setState({loading: true, errorMessage: null});
    let pushEndpoint = firebase.firestore()
      .collection("orders")
      .doc(firebase.auth().currentUser.uid)
      .collection("myOrders");
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
  }

  componentWillMount() {
    this.setState({ loading: true });
  }

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

  render() {
    let loadingStyle = {
      backgroundColor: "#fff",
      padding: 10
    };
    if (!this.state.loading) {
      loadingStyle.height = 0;
      loadingStyle.padding = 0;
    }
    const screenWidth = Dimensions.get("window").width;
    return (
      <SafeAreaView style={{alignContent: "center"}}>
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

// TODO: Add box shadow for android (shadow props only support iOS)
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  contentContainer: {
    paddingBottom: Platform.OS === "ios" ? 65 : 100
  },
  header: {
    paddingTop: Platform.OS !== "ios" ? 25 : 0,
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
  iconButtons: {
    height: 50,
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 25
  },
  deleteButton: {
    backgroundColor: "#ff414c",
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
  trashButton: {
    paddingRight: 10
  },
  errorMessage: {
    fontFamily: "open-sans",
    textAlign: "center",
    fontSize: 16,
    color: "#ff414c",
    padding: 10,
    flex: 1,
    backgroundColor: "#fff"
  }
});