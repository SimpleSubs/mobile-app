import React from "react";
import { TextInput } from "react-native";
import IngredientPicker from "./IngredientPicker";
import AnimatedDropdown from "./AnimatedDropdown";
import Checkboxes from "./Checkboxes";
import createStyleSheet, { getColors } from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { InputTypes } from "../../constants/Inputs";

const OrderField = ({ title, type, options, value, placeholder, setValue, multiline = false }) => {
  const themedStyles = createStyleSheet(styles);
  switch (type) {
    case InputTypes.PICKER:
      return (
        <IngredientPicker
          title={title}
          options={options}
          selectedValue={value}
          changeValue={setValue}
        />
      );
    case InputTypes.CHECKBOX:
      return (
        <AnimatedDropdown title={title} type={type} selectedValue={value} options={options}>
          <Checkboxes selectedItems={value} itemsArr={options} setItems={setValue} />
        </AnimatedDropdown>
      );
    case InputTypes.TEXT_INPUT:
      return (
        <AnimatedDropdown title={title} type={type}>
          <TextInput
            style={[themedStyles.textInput, multiline && themedStyles.multilineInput]}
            placeholder={placeholder}
            placeholderTextColor={getColors().textInputText}
            value={value}
            onChangeText={setValue}
            multiline={multiline}
          />
        </AnimatedDropdown>
      )
    default:
      return null;
  }
};

export default OrderField;

const styles = (Colors) => ({
  textInput: {
    fontFamily: "josefin-sans",
    backgroundColor: Colors.textInputColor,
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 30,
    padding: 20,
    paddingVertical: 20,
    fontSize: Layout.fonts.body,
    color: Colors.primaryText,
    borderRadius: 5
  },
  multilineInput: {
    height: 150,
    paddingTop: 20,
    paddingBottom: 20
  }
})