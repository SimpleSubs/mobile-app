import React, { useState } from "react";
import {
  Picker,
  StyleSheet,
  FlatList,
  Text,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "./AnimatedTouchable";

import ModalTypes from "../constants/ModalTypes";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

const PickerIOS = ({ selectedValue, onValueChange, options }) => {
  const [value, setValue] = useState(selectedValue);
  const changeValue = (newValue) => {
    setValue(newValue);
    onValueChange(newValue);
  }
  return (
    <Picker
      selectedValue={value}
      onValueChange={changeValue}
      itemStyle={styles.itemTextStyle}
    >
      {options.map((value) => <Picker.Item key={value} label={value} value={value} />)}
    </Picker>
  );
}

const PickerAndroid = ({ closeModal, selectedValue, onValueChange, options }) => {
  const [value, setValue] = useState(selectedValue);
  const changeValue = (newValue) => {
    setValue(newValue);
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
        <AnimatedTouchable
          style={[styles.androidItemStyle, item === value ? styles.selectedAndroidItemStyle : {}]}
          onPress={() => changeValue(item)}
        >
          <Text style={[styles.itemTextStyle, item === value ? styles.selectedItemTextStyle : {}]}>{item}</Text>
        </AnimatedTouchable>
      )}
    />
  )
};

const pickerProps = (closeModal, selectedValue, onValueChange, options) => ({
  type: ModalTypes.CENTER_SPRING_MODAL,
  style: styles.pickerContainer,
  children: (
    <View style={styles.picker}>
      <AnimatedTouchable onPress={closeModal} endSize={0.8} style={styles.exitButton}>
        <Ionicons name={"md-close"} size={Layout.fonts.icon} color={Colors.primaryText} />
      </AnimatedTouchable>
      {Layout.ios
        ? <PickerIOS selectedValue={selectedValue} onValueChange={onValueChange} options={options} />
        : <PickerAndroid closeModal={closeModal} selectedValue={selectedValue} onValueChange={onValueChange} options={options} />}
    </View>
  )
})

export default pickerProps;

const styles = StyleSheet.create({
  itemTextStyle: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    color: Colors.primaryText
  },
  androidItemStyle: {
    padding: 20,
    alignItems: "center",
    borderRadius: 100
  },
  selectedAndroidItemStyle: {
    backgroundColor: Colors.accentColor
  },
  androidPicker: {
    alignItems: "center"
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
    borderRadius: 10,
    padding: 30
  },
  selectedItemTextStyle: {
    fontFamily: "josefin-sans-bold"
  },
  exitButton: {
    position: "absolute",
    padding: 20,
  }
})