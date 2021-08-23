/**
 * @file Creates list of checkboxes from a given array of data.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Checkbox } from "react-native-paper";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";

/**
 * Responds to check action by user.
 *
 * Toggles checkbox; removes item from selected items if ingredient is already
 * checked, otherwise adds item to selected items.
 *
 * @param {string}   item          Item that user has tapped.
 * @param {Function} setItems      Function to set selectedItems.
 * @param {string[]} selectedItems Array containing all currently selected items.
 * @param {boolean}  checked       Whether item is current checked.
 */
const onCheck = (item, setItems, selectedItems, checked) => {
  if (checked) {
    setItems(selectedItems.filter((ingredient) => ingredient !== item));
  } else {
    setItems([...selectedItems, item]);
  }
};

/**
 * Gets 2D array for checkbox columns and rows.
 *
 * Splits given array of items into specified number of columns. Follows order
 * horizontal wrapping (left-to-right, then top-to-bottom).
 *
 * @param {string[]} items      1D array of items to split.
 * @param {number}   numColumns Number of columns to split array into.
 *
 * @returns {string[][]} 2D array containing given items split into specified
 * number of columns.
 */
const getColumnArr = (items, numColumns) => {
  let columnArray = [];
  for (let i = 0; i < numColumns; i++) {
    columnArray.push([]);
  }
  let col = 0;
  for (let item of items) {
    columnArray[col].push(item);
    col++;
    if (col >= numColumns) {
      col = 0;
    }
  }
  return columnArray;
}

/**
 * Renders a checkbox that instantaneously updates (rather than re-processing state
 * each time) for faster UI reaction.
 *
 * @param {string[]}           selectedItems Array containing all currently selectedItems.
 * @param {string}             item          Title value for this checkbox.
 * @param {function(string[])} setItems      Function to set value of selectedItems.
 *
 * @return {React.ReactElement} Checkbox to render.
 * @constructor
 */
const CheckBoxWithState = ({ selectedItems, item, setItems }) => {
  const [checked, setChecked] = useState(selectedItems.includes(item));

  // Toggles checkbox within component and in higher state
  const toggleCheckbox = () => {
    setChecked(!checked);
    onCheck(item, setItems, selectedItems, checked);
  };

  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={toggleCheckbox}>
      <Checkbox.Android
        status={checked ? "checked" : "unchecked"}
        onPress={toggleCheckbox}
        uncheckedColor={Colors.uncheckedCheckbox}
        color={Colors.accentColor}
      />
      <Text style={styles.checkboxText}>{item}</Text>
    </TouchableOpacity>
  );
};

const ColumnLayout = ({ numColumns, items, ...props }) => {
  const columnArr = getColumnArr(items, numColumns);
  return columnArr.map((column, colIndex ) => (
    <View style={styles.column} key={colIndex}>
      {column.map((item, index) => <CheckBoxWithState item={item} key={index} {...props} />)}
    </View>
  ));
};

/**
 * Renders a list of checkboxes.
 *
 * Returns a two column list of checkboxes; selected items are checked,
 * unselected items are not.
 *
 * @param {string[]}           [selectedItems=[]] Array containing all currently selected items.
 * @param {string[]}           [itemsArr=[]]      Array containing all checkbox items.
 * @param {function(string[])} setItems           Function to set value of selectedItems.
 *
 * @return {React.ReactElement} List of checkboxes.
 * @constructor
 */
const Checkboxes = ({ selectedItems = [], itemsArr = [], setItems }) => (
  <View style={styles.container}>
    <ColumnLayout items={itemsArr} numColumns={2} selectedItems={selectedItems} setItems={setItems} />
  </View>
)

export default Checkboxes;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 15,
    flexDirection: "row"
  },
  column: {
    flex: 1
  },
  checkboxContainer: {
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    borderColor: "#0000",
    padding: 5,
    margin: 0,
    flexDirection: "row"
  },
  checkboxText: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.checkboxText
  }
});