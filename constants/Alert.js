import Layout from "./Layout";
import { Alert } from "react-native";

const crossPlatformAlert = (title, message) => {
  if (Layout.web) {
    alert(title.toUpperCase() + "\n" + message);
  } else {
    Alert.alert(title, message);
  }
}

export default crossPlatformAlert;