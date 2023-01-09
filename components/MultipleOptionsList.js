import React from "react";
import {
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import createStyleSheet, { getColors } from "../constants/Colors";
import Layout from "../constants/Layout";

const MultipleOptionsList = ({ pages, navigation }) => {
  const themedStyles = createStyleSheet(styles);
  return (
    <FlatList
      alwaysBounceVertical={false}
      style={themedStyles.container}
      data={pages}
      renderItem={({item}) => (
        <TouchableOpacity
          activeOpacity={0.5}
          style={themedStyles.navigateTouchable}
          onPress={() => navigation.navigate(item.page)}
        >
          <Text style={themedStyles.navigateTouchableText}>{item.title}</Text>
          <Ionicons name={"chevron-forward"} color={getColors().primaryText} size={Layout.fonts.icon}/>
        </TouchableOpacity>
      )}
    />
  )
};

export default MultipleOptionsList;

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.scrollViewBackground,
    flex: 1
  },
  navigateTouchable: {
    flex: 1,
    backgroundColor: Colors.cardColor,
    padding: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.5
  },
  navigateTouchableText: {
    fontSize: Layout.fonts.title,
    fontFamily: "josefin-sans",
    color: Colors.primaryText
  }
});