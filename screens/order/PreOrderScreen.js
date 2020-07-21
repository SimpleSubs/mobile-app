import React from "react";
import {
  View,
  StyleSheet
} from "react-native";
import Header from "../../components/Header";
import DualOptionDisplay from "../../components/DualOptionDisplay";
import Colors from "../../constants/Colors";

const ORDER_PAGES = [
  { key: "presetOrder", title: "Order with preset", page: "Preset Order" },
  { key: "customOrder", title: "Order with custom settings", page: "Custom Order" }
]

const PreOrderScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Header title={"Order"} leftButton={{ name: "md-close", onPress: () => navigation.pop() }} />
    <DualOptionDisplay pages={ORDER_PAGES} navigation={navigation} />
  </View>
);

export default PreOrderScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.scrollViewBackground,
    flex: 1
  }
});