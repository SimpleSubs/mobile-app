import React from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ModalTypes, { ModalAnimationTypes } from "../constants/ModalTypes";
import Layout from "../constants/Layout";
import createStyleSheet from "../constants/Colors";
import { closeModal } from "../redux/features/display/modalSlice";
import { useDispatch } from "react-redux";
import {setReturnValue} from "../redux/features/display/modalOperationsSlice";

const PickerIOS = ({ onValueChange, selectedValue, options }) => (
  <Picker selectedValue={selectedValue} onValueChange={onValueChange} itemStyle={createStyleSheet(styles).itemTextStyle}>
    {options.map((value) => <Picker.Item key={value} label={value} value={value}/>)}
  </Picker>
);

const PickerAndroid = ({ onValueChange, selectedValue, options }) => {
  const themedStyles = createStyleSheet(styles);
  return (
    <View style={themedStyles.androidPickerContainer}>
      <FlatList
        alwaysBounceVertical={false}
        data={options}
        extraData={selectedValue}
        contentContainerStyle={themedStyles.androidPicker}
        showsVerticalScrollIndicator={true}
        keyExtractor={(item) => item}
        ListEmptyComponent={<Text style={themedStyles.noOptionsText}>There are no available options</Text>}
        renderItem={({item, index}) => (
          <TouchableOpacity style={themedStyles.androidItemStyle} onPress={() => onValueChange(item)}>
            <Text style={[
              themedStyles.itemTextStyle,
              item === selectedValue ? themedStyles.selectedItemTextStyle : {}
            ]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
};

const PickerCrossPlatform = ({ selectedValue, options }) => {
  const dispatch = useDispatch();
  const changeValue = (newValue) => {
    dispatch(setReturnValue(newValue));
    if (newValue !== selectedValue) {
      dispatch(closeModal());
    }
  };
  return Layout.ios ? (
    <PickerIOS
      onValueChange={changeValue}
      selectedValue={selectedValue}
      options={options}
    />
  ) : (
    <PickerAndroid
      onValueChange={changeValue}
      selectedValue={selectedValue}
      options={options}
    />
  );
}

export default PickerCrossPlatform;

export const getPickerProps = ({ selectedValue, options }) => {
  const themedStyles = createStyleSheet(styles);
  return ({
    type: ModalTypes.PICKER_MODAL,
    animationType: ModalAnimationTypes.CENTER_SPRING_MODAL,
    style: themedStyles.pickerContainer,
    contentContainerStyle: themedStyles.picker,
    props: { selectedValue, options }
  });
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