import React from "react";
import { View } from "react-native";
import Header from "../../components/Header";
import MultipleOptionsList from "../../components/MultipleOptionsList";
import createStyleSheet from "../../constants/Colors";

const ORDER_PAGES = [
  { key: "presetOrder", title: "Order with preset", page: "Preset Order" },
  { key: "customOrder", title: "Order with custom settings", page: "Custom Order" }
]

const PreOrderScreen = ({ navigation }) => (
  <View style={createStyleSheet(styles).container}>
    <Header title={"Order"} leftButton={{ name: "close", onPress: () => navigation.pop() }} includeInsets={false} />
    <MultipleOptionsList pages={ORDER_PAGES} navigation={navigation} isModal />
  </View>
);

export default PreOrderScreen;

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.scrollViewBackground,
    flex: 1
  }
});