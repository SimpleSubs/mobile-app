import React, { useState } from "react";
import {
  Picker,
  StyleSheet,
  TouchableOpacity
} from "react-native"

import CenterSpringModal from "./modals/CenterSpringModal";
import SlideUpModal from "./modals/SlideUpModal";

import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

const PickerIOS = ({ selectedValue, onValueChange, options, open, toggleModal }) => (
  <SlideUpModal open={open} toggleModal={toggleModal} style={styles.pickerIOSContainer}>
    <Picker selectedValue={selectedValue} onValueChange={onValueChange} style={styles.pickerIOS}>
      {options.map(({ label, value }) => <Picker.Item label={label} value={value} />)}
    </Picker>
  </SlideUpModal>
);

const CustomPicker = ({ touchableContent, touchableStyle, currentModal, setModal, selectedValue, onValueChange, options  }) => {
  const Picker = () => (
    <PickerIOS selectedValue={selectedValue} onValueChange={onValueChange} options={options} />
  )
  return (
    <TouchableOpacity
      onPress={() => setModal(<PickerIOS/>)}
      style={touchableStyle}
    >
      {touchableContent}
    </TouchableOpacity>
  )
}

export default CustomPicker;

const styles = StyleSheet.create({
  pickerIOSContainer: {
    width: Layout.window.width,
    height: Layout.width.height * 0.3
  },
  pickerIOS: {
    flex: 1,
    backgroundColor: Colors.pickerIOS,
    padding: 50,
    alignItems: "center"
  },
  itemStyle: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body
  }
})