import React from "react";
import {
  Text,
  TouchableOpacity
} from "react-native";
import { Picker } from '@react-native-community/picker';
import AnimatedDropdown from "./AnimatedDropdown";
import { getPickerProps } from "../Picker";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../redux/features/display/modalSlice";
import Layout from "../../constants/Layout";
import { InputTypes } from "../../constants/Inputs";
import createStyleSheet from "../../constants/Colors";
import { setKey } from "../../redux/features/display/modalOperationsSlice";
import uuid from "react-native-uuid";

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

const AndroidPickerTouchable = ({ title, options = [], selectedValue, changeValue }) => {
  const { key, returnValue } = useSelector(({ modalOperations }) => modalOperations);
  const dispatch = useDispatch();
  const [modalId, setModalId] = React.useState();
  const themedStyles = createStyleSheet(styles);

  const openPicker = () => {
    dispatch(setKey(modalId));
    dispatch(openModal(getPickerProps({ selectedValue, options })));
  };

  React.useEffect(() => {
    if (key === modalId && returnValue) {
      changeValue(returnValue);
    }
  }, [returnValue, modalId]);

  React.useEffect(() => setModalId(uuid.v4()), []);

  return (
    <TouchableOpacity style={themedStyles.touchable} onPress={openPicker}>
      <Text style={themedStyles.touchableText}>{title}</Text>
      <Text style={themedStyles.selectedItem} numberOfLines={1}>
        {selectedValue}
      </Text>
    </TouchableOpacity>
  )
}

export default Layout.ios ? iOSPickerTouchable : AndroidPickerTouchable;

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