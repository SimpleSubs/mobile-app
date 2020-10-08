/**
 * @file Creates and manages picker to render within top-level center spring modal.
 * @author Emily Sturman <emily@sturman.org>
 */
import React from "react";
import {
  Picker,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity
} from "react-native";
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
    {options.map((value) => <Picker.Item key={value} label={value} value={value}/>)}
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
 * @param {string}           selectedValue Value that is currently selected in picker.
 * @param {string[]}         options       Array of options to display in picker.
 *
 * @return {React.ReactElement} Picker element to render.
 * @constructor
 */
const PickerAndroid = ({ changeValue, selectedValue, options }) => (
  <FlatList
    alwaysBounceVertical={false}
    data={options}
    contentContainerStyle={styles.androidPicker}
    showsVerticalScrollIndicator={true}
    keyExtractor={(item) => item}
    renderItem={({item}) => (
      <TouchableOpacity
        style={[styles.androidItemStyle, item === selectedValue ? styles.selectedAndroidItemStyle : {}]}
        onPress={() => changeValue(item)}
      >
        <Text style={[styles.itemTextStyle, item === selectedValue ? styles.selectedItemTextStyle : {}]}>{item}</Text>
      </TouchableOpacity>
    )}
  />
);

/**
 * Renders cross-platform picker
 *
 * Returns a picker to be displayed within a center spring
 * modal; returns a native picker element for iOS, custom
 * picker for Android.
 *
 * @param {function()}       closeModal    Closes picker's modal.
 * @param {string}           selectedValue Value that is currently selected in picker.
 * @param {function(string)} onValueChange Function to execute when value is changed/selected in picker.
 * @param {string[]}         options       Array of options to display in picker.
 *
 * @return {React.ReactElement} Picker element to render.
 * @constructor
 */
const PickerCrossPlatform = ({ closeModal, selectedValue, onValueChange, options }) => {
  const changeValue = (newValue) => {
    onValueChange(newValue);
    if (newValue !== selectedValue) { closeModal(); }
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
    color: Colors.primaryText
  },
  androidItemStyle: {
    padding: 20,
    alignItems: "center"
  },
  selectedAndroidItemStyle: {
    backgroundColor: Colors.accentColor
  },
  androidPicker: {
    alignItems: "stretch",
    paddingVertical: 30
  },
  pickerContainer: {
    left: 125.0 / 2,
    top: (Layout.window.height - 300) / 2,
    width: Layout.window.width - 125,
    height: 300
  },
  picker: {
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10
  },
  selectedItemTextStyle: {
    fontFamily: "josefin-sans-bold"
  }
})