import React, { useEffect } from "react";
import {
  Picker,
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import AnimatedDropdown from "./AnimatedDropdown";
import AndroidPicker, { getPickerProps } from "../Picker";

import { connect } from "react-redux";
import { openModal, closeModal } from "../../redux/Actions";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { InputTypes } from "../../constants/Inputs";

const iOSPickerTouchable = ({ title, options = [], selectedValue, changeValue }) => (
  <AnimatedDropdown title={title} type={InputTypes.PICKER} selectedValue={selectedValue} changeValue={changeValue} options={options}>
    {options.length > 0 ? (
      <Picker
        itemStyle={styles.pickerItem}
        selectedValue={selectedValue}
        onValueChange={(itemValue) => changeValue(itemValue)}
      >
        {options.map((item) => <Picker.Item label={item} value={item} key={item}/>)}
      </Picker>
    ) : <Text style={styles.noOptionsText}>There are no available options</Text>}
  </AnimatedDropdown>
);

const AndroidPickerTouchable = ({ openModal, closeModal, title, options = [], selectedValue, changeValue }) => {
  const myPicker = (
    <AndroidPicker
      closeModal={closeModal}
      selectedValue={selectedValue}
      onValueChange={changeValue}
      options={options}
    />
  );
  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => openModal(getPickerProps(myPicker))}
    >
      <Text style={styles.touchableText}>{title}</Text>
      <Text style={styles.selectedItem} numberOfLines={1}>{selectedValue}</Text>
    </TouchableOpacity>
  )
}

const mapDispatchToProps = (dispatch) => ({
  openModal: (props) => dispatch(openModal(props)),
  closeModal: () => dispatch(closeModal())
})

export default Layout.ios ? iOSPickerTouchable : connect(null, mapDispatchToProps)(AndroidPickerTouchable);

const styles = StyleSheet.create({
  pickerItem: {
    fontFamily: "josefin-sans",
    color: Colors.primaryText
  },
  noOptionsText: {
    fontFamily: "josefin-sans",
    color: Colors.primaryText,
    fontSize: Layout.fonts.body,
    textAlign: "center",
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  touchable: {
    backgroundColor: Colors.backgroundColor,
    flexDirection: "row",
    justifyContent: "space-between",
    color: Colors.primaryText,
    padding: 20
  },
  touchableText: {
    fontSize: Layout.fonts.title,
    fontFamily: "josefin-sans",
    color: Colors.primaryText,
    flex: 1
  },
  selectedItem: {
    fontSize: Layout.fonts.title,
    fontFamily: "josefin-sans",
    color: Colors.secondaryText,
    flex: 1,
    textAlign: "right"
  }
});