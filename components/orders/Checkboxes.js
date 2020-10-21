/**
 * @file Creates list of checkboxes from a given array of data.
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet
} from "react-native";
import { CheckBox } from "react-native-elements";
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
 * Renders a checkbox that instantaneously updates (rather than re-processing state
 * each time) for faster UI reaction.
 *
 * @param {string[]}           selectedItems Array containing all currently selectedItems.
 * @param {string}             item          Title value for this checkbox.
 * @param {function(string[])} setItems      Function to set value of selectedItems.
 *
 * @return {React.ReactElement} CheckBox to render.
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
      onPress={toggleCheckbox}
    />
  )
}

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
const Checkboxes = ({ selectedItems, itemsArr = [], setItems }) => (
  <FlatList
    style={styles.container}
    data={itemsArr}
    extraData={selectedItems}
    keyExtractor={(item, index) => index.toString()}
    numColumns={2}
    renderItem={({item}) => <CheckBoxWithState item={item} selectedItems={selectedItems} setItems={setItems} />}
    scrollEnabled={false}
    alwaysBounceVertical={false}
  />
)

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
    margin: 0,
    flexDirection: "row"
  },
  checkboxText: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.checkboxText
  }
});