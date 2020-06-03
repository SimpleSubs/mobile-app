import React from "react";
import {
  Picker,
  View,
  StyleSheet
} from "react-native";
import Colors from "../../constants/Colors";

const iOSPicker = ({ options, selectedValue, changeValue }) => (
  <Picker
    itemStyle={styles.pickerItem}
    selectedValue={selectedValue}
    onValueChange={(itemValue, itemPosition) => changeValue(itemValue)}
  >
    {options.map((item) => <Picker.Item label={item} value={item} key={item} />)}
  </Picker>
);

export default iOSPicker;

const styles = StyleSheet.create({
  pickerItem: {
    fontFamily: "josefin-sans",
    color: Colors.primaryText
  }
});