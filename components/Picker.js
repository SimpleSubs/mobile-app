/**
 * @file Creates and manages picker to render within top-level center spring modal.
 * @author Emily Sturman <emily@sturman.org>
 */
import React from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { Picker } from "@react-native-community/picker";
import ModalTypes from "../constants/ModalTypes";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

/**
 * Renders picker for iOS.
 *
 * Returns a picker (scrollable input that can select one value)
 * for iOS only.
 *
 * @param {function(string)} changeValue   Sets selected value of picker and closes modal.
 * @param {string}           selectedValue Value that is currently selected in picker.
 * @param {string[]}         options       Array of options to display in picker.
 *
 * @return {React.ReactElement} Picker element to render.
 * @constructor
 */
const PickerIOS = ({ changeValue, selectedValue, options }) => (
  <Picker selectedValue={selectedValue} onValueChange={changeValue} itemStyle={styles.itemTextStyle}>
    {options.map((value, i) => (
      <Picker.Item key={value} label={value} value={value} />
    ))}
  </Picker>
);

/**
 * Renders picker for Android.
 *
 * Returns a custom picker (scrollable list with a touchable
 * opacity for each option), providing more flexibility than
 * the native Picker element.
 *
 * @param {function(string)} changeValue   Sets selected value of picker and closes modal.
 * @param {string|number}    selectedValue Value that is currently selected in picker.
 * @param {string[]}         options       Array of options to display in picker.
 *
 * @return {React.ReactElement} Picker element to render.
 * @constructor
 */
const PickerAndroid = ({ changeValue, selectedValue, options }) => (
  <View style={styles.androidPickerContainer}>
    <FlatList
      alwaysBounceVertical={false}
      data={options}
      extraData={selectedValue}
      contentContainerStyle={styles.androidPicker}
      showsVerticalScrollIndicator={true}
      keyExtractor={(item) => item}
      ListEmptyComponent={<Text style={styles.noOptionsText}>There are no available options</Text>}
      renderItem={({ item, index }) => (
        <TouchableOpacity style={styles.androidItemStyle} onPress={() => changeValue(item)}>
          <Text style={[
            styles.itemTextStyle,
            item === selectedValue ? styles.selectedItemTextStyle : {}
          ]}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

/**
 * Renders cross-platform picker
 *
 * Returns a picker to be displayed within a center spring
 * modal; returns a native picker element for iOS, custom
 * picker for Android.
 *
 * @param {function()}       closeModal            Closes picker's modal.
 * @param {string}           selectedValue         Value that is currently selected in picker.
 * @param {function(string)} onValueChange         Function to execute when value is changed/selected in picker.
 * @param {string[]}         options               Array of options to display in picker.
 * @param {boolean}          [useIndexValue=false] Whether picker value should refer to index or string value of options.
 *
 * @return {React.ReactElement} Picker element to render.
 * @constructor
 */
const PickerCrossPlatform = ({ closeModal, selectedValue, onValueChange, options }) => {
  const changeValue = (newValue) => {
    onValueChange(newValue);
    if (newValue !== selectedValue) {
      closeModal();
    }
  };
  return Layout.ios ? (
    <PickerIOS
      changeValue={changeValue}
      closeModal={closeModal}
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      options={options}
    />
  ) : (
    <PickerAndroid
      changeValue={changeValue}
      closeModal={closeModal}
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      options={options}
    />
  );
}

export default PickerCrossPlatform;

export const getPickerProps = (picker) => ({
  type: ModalTypes.CENTER_SPRING_MODAL,
  style: styles.pickerContainer,
  children: <View style={styles.picker}>{picker}</View>
});

const styles = StyleSheet.create({
  itemTextStyle: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.primaryText,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 100
  },
  androidItemStyle: {
    alignItems: "center"
  },
  androidPicker: {
    alignItems: "stretch",
    paddingVertical: 30
  },
  androidPickerContainer: {
    maxHeight: 300
  },
  pickerContainer: {
    width: Layout.window.width - 125,
    maxWidth: 500
  },
  picker: {
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10
  },
  selectedItemTextStyle: {
    fontFamily: "josefin-sans-bold",
    backgroundColor: Colors.accentColor
  },
  noOptionsText: {
    fontFamily: "josefin-sans",
    color: Colors.primaryText,
    fontSize: Layout.fonts.body,
    textAlign: "center",
    paddingVertical: 40,
    paddingHorizontal: 20
  }
})