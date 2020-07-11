import React from "react";
import {
  FlatList,
  StyleSheet
} from "react-native";
import { CheckBox } from "react-native-elements";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";

const onCheck = (item, setItems, selectedItems, checked) => {
  if (checked) {
    let newItemsArr = selectedItems.filter((ingredient) => ingredient !== item);
    setItems(newItemsArr);
  } else {
    let newItemsArr = selectedItems.slice();
    newItemsArr.push(item);
    setItems(newItemsArr);
  }
};

const Checkboxes = ({ selectedItems, itemsArr, setItems }) => (
  <FlatList
    style={styles.container}
    data={itemsArr}
    keyExtractor={(item, index) => index.toString()}
    numColumns={2}
    renderItem={({ item, index }) => {
      const checked = selectedItems.includes(item);
      return (
        <CheckBox
          containerStyle={styles.checkbox}
          textStyle={styles.checkboxText}
          checkedColor={Colors.accentColor}
          uncheckedColor={Colors.uncheckedCheckbox}
          title={item}
          checked={checked}
          iconType={"ionicon"}
          checkedIcon={"md-checkbox-outline"}
          uncheckedIcon={"md-square-outline"}
          onPress={() => onCheck(item, setItems, selectedItems, checked)}
        />
      )
    }}
    scrollEnabled={false}
    alwaysBounceVertical={false}
  />
);

export default Checkboxes;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 15
  },
  checkbox: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    borderColor: "#0000",
    padding: 5,
    margin: 0
  },
  checkboxText: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.checkboxText
  }
});