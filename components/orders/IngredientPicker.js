import React from "react";
import {
  Picker,
  View
} from "react-native";

const iOSPicker = ({ options, selectedValue, changeValue }) => (
  <Picker selectedValue={selectedValue} onValueChange={changeValue}>
    {options.map((item) => <Picker.Item label={item} value={item} />)}
  </Picker>
);

export default iOSPicker;