import React from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { Checkbox } from "react-native-paper";
import createStyleSheet, { getColors } from "../../constants/Colors";
import Layout from "../../constants/Layout";

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
 * Renders a checkbox that instantaneously updates (rather than re-processing state each time) for faster UI reaction.
 */
const CheckBoxWithState = ({ selectedItems, item, setItems }) => {
  const [checked, setChecked] = React.useState(selectedItems.includes(item));
  const themedStyles = createStyleSheet(styles);
  const colors = getColors();
  const currentlyChecked = 0;
  const checkLimit = 2;

  // Toggles checkbox within component and in higher state
  // TODO: Toggle on if the amount currently checked is below the limit
  const toggleCheckbox = () => {
    setChecked(!checked);
    if (checked) {
      setItems(selectedItems.filter((ingredient) => ingredient !== item));
    } else {
      setItems([...selectedItems, item]);
    }
  };

  return (
    <TouchableOpacity style={themedStyles.checkboxContainer} onPress={toggleCheckbox}>
      <Checkbox.Android
        status={checked ? "checked" : "unchecked"}
        onPress={toggleCheckbox}
        uncheckedColor={colors.uncheckedCheckbox}
        color={colors.accentColor}
      />
      <Text style={themedStyles.checkboxText}>{item}</Text>
    </TouchableOpacity>
  );
};

const ColumnLayout = ({ numColumns, items, ...props }) => {
  const themedStyles = createStyleSheet(styles);
  const columnArr = getColumnArr(items, numColumns);
  return columnArr.map((column, colIndex ) => (
    <View style={themedStyles.column} key={colIndex}>
      {column.map((item, index) => <CheckBoxWithState item={item} key={index} {...props} />)}
    </View>
  ));
};

const Checkboxes = ({ selectedItems = [], itemsArr = [], setItems }) => (
  <View style={createStyleSheet(styles).container}>
    <ColumnLayout
      items={itemsArr}
      numColumns={2}
      selectedItems={selectedItems}
      setItems={setItems}
    />
  </View>
);

export default Checkboxes;

const styles = (Colors) => ({
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