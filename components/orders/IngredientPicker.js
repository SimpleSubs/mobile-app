import React from "react";
import {
  Text,
  TouchableOpacity
} from "react-native";
import { Picker } from '@react-native-community/picker';
import AnimatedDropdown from "./AnimatedDropdown";
import AndroidPicker, { getPickerProps } from "../Picker";
import { connect } from "react-redux";
import { openModal, closeModal } from "../../redux/Actions";
import Layout from "../../constants/Layout";
import { InputTypes } from "../../constants/Inputs";
import createStyleSheet from "../../constants/Colors";

const iOSPickerTouchable = ({ title, options = [], selectedValue, changeValue }) => {
  const themedStyles = createStyleSheet(styles);
  return (
    <AnimatedDropdown
      title={title}
      type={InputTypes.PICKER}
      selectedValue={selectedValue}
      changeValue={changeValue}
      options={options}
    >
      {options.length > 0 ? (
        <Picker
          itemStyle={themedStyles.pickerItem}
          selectedValue={selectedValue}
          onValueChange={(itemValue) => changeValue(itemValue)}
        >
          {options.map((item, i) => (
            <Picker.Item label={item} value={item} key={item}/>
          ))}
        </Picker>
      ) : <Text style={themedStyles.noOptionsText}>There are no available options</Text>}
    </AnimatedDropdown>
  )
};

const AndroidPickerTouchable = ({ openModal, closeModal, title, options = [], selectedValue, changeValue }) => {
  const themedStyles = createStyleSheet(styles);
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
      style={themedStyles.touchable}
      onPress={() => openModal(getPickerProps(myPicker))}
    >
      <Text style={themedStyles.touchableText}>{title}</Text>
      <Text style={themedStyles.selectedItem} numberOfLines={1}>
        {selectedValue}
      </Text>
    </TouchableOpacity>
  )
}

const mapDispatchToProps = (dispatch) => ({
  openModal: (props) => dispatch(openModal(props)),
  closeModal: () => dispatch(closeModal())
})

export default Layout.ios ? iOSPickerTouchable : connect(null, mapDispatchToProps)(AndroidPickerTouchable);

const styles = (Colors) => ({
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