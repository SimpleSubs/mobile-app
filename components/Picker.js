import React from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { Picker } from "@react-native-community/picker";
import ModalTypes from "../constants/ModalTypes";
import Layout from "../constants/Layout";
import createStyleSheet from "../constants/Colors";

const PickerIOS = ({ changeValue, selectedValue, options, themedStyles }) => (
  <Picker selectedValue={selectedValue} onValueChange={changeValue} itemStyle={themedStyles.itemTextStyle}>
    {options.map((value, i) => (
      <Picker.Item key={value} label={value} value={value} />
    ))}
  </Picker>
);

const PickerAndroid = ({ changeValue, selectedValue, options, themedStyles }) => (
  <View style={themedStyles.androidPickerContainer}>
    <FlatList
      alwaysBounceVertical={false}
      data={options}
      extraData={selectedValue}
      contentContainerStyle={themedStyles.androidPicker}
      showsVerticalScrollIndicator={true}
      keyExtractor={(item) => item}
      ListEmptyComponent={<Text style={themedStyles.noOptionsText}>There are no available options</Text>}
      renderItem={({ item, index }) => (
        <TouchableOpacity style={themedStyles.androidItemStyle} onPress={() => changeValue(item)}>
          <Text style={[
            themedStyles.itemTextStyle,
            item === selectedValue ? themedStyles.selectedItemTextStyle : {}
          ]}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

const PickerCrossPlatform = ({ closeModal, selectedValue, onValueChange, options }) => {
  const themedStyles = createStyleSheet(styles);
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
      themedStyles={themedStyles}
    />
  ) : (
    <PickerAndroid
      changeValue={changeValue}
      closeModal={closeModal}
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      options={options}
      themedStyles={themedStyles}
    />
  );
}

export default PickerCrossPlatform;

export const getPickerProps = (picker) => {
  const themedStyles = createStyleSheet(styles);
  return ({
    type: ModalTypes.CENTER_SPRING_MODAL,
    style: themedStyles.pickerContainer,
    children: <View style={themedStyles.picker}>{picker}</View>
  })
};

const styles = (Colors) => ({
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