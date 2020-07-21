import React from "react";
import {
  Picker,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "./AnimatedTouchable";

import ModalTypes from "../constants/ModalTypes";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

const PickerIOS = ({ closeModal, selectedValue, onValueChange, options }) => {
  const changeValue = (newValue) => {
    onValueChange(newValue);
    if (newValue !== selectedValue) { closeModal(); }
  }
  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={changeValue}
      itemStyle={styles.itemTextStyle}
    >
      {options.map((value) => <Picker.Item key={value} label={value} value={value}/>)}
    </Picker>
  )
}

const PickerAndroid = ({ closeModal, selectedValue, onValueChange, options }) => {
  const changeValue = (newValue) => {
    onValueChange(newValue);
    if (newValue !== selectedValue) { closeModal(); }
  }
  return (
    <FlatList
      alwaysBounceVertical={false}
      data={options}
      contentContainerStyle={styles.androidPicker}
      showsVerticalScrollIndicator={true}
      keyExtractor={(item, index) => item}
      renderItem={({item}) => (
        <TouchableOpacity
          style={[styles.androidItemStyle, item === selectedValue ? styles.selectedAndroidItemStyle : {}]}
          onPress={() => changeValue(item)}
        >
          <Text style={[styles.itemTextStyle, item === selectedValue ? styles.selectedItemTextStyle : {}]}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  )
};

export default Layout.ios ? PickerIOS : PickerAndroid;

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
  },
  exitButton: {
    position: "absolute",
    padding: 20,
  }
})