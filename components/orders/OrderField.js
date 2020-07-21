import React, { useState, useEffect } from "react";
import { TextInput, StyleSheet } from "react-native";
import IngredientPicker from "./IngredientPicker";
import AnimatedDropdown from "./AnimatedDropdown";
import Checkboxes from "./Checkboxes";

import { connect } from "react-redux";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { InputTypes } from "../../constants/Inputs";
import { DynamicOrderOptions, getDateOptions } from "../../constants/DataActions";

const OrderField = ({ title, type, options, value, placeholder, setValue, focusedOrder, orders, orderPresets, dynamic, cutoffTime, multiline = false }) => {
  const [rawOptions, setOptions] = useState([]);

  // computes options if they are dynamic
  useEffect(() => {
    switch (options) {
      case DynamicOrderOptions.DATE_OPTIONS:
        setOptions(getDateOptions(orders, focusedOrder, cutoffTime));
        break;
      case DynamicOrderOptions.PRESET_OPTIONS:
        setOptions(Object.keys(orderPresets));
        break;
      default:
        return;
    }
  }, []);

  switch (type) {
    case InputTypes.PICKER:
      return (
        <IngredientPicker
          title={title}
          options={dynamic ? rawOptions : options}
          selectedValue={value}
          changeValue={setValue}
        />
      );
    case InputTypes.CHECKBOX:
      return (
        <AnimatedDropdown title={title} type={type} selectedValue={value} options={options}>
          <Checkboxes selectedItems={value} itemsArr={dynamic ? rawOptions : options} setItems={setValue} />
        </AnimatedDropdown>
      );
    case InputTypes.TEXT_INPUT:
      return (
        <AnimatedDropdown title={title} type={type}>
          <TextInput
            style={[styles.textInput, multiline && styles.multilineInput]}
            placeholder={placeholder}
            placeholderTextColor={Colors.textInputText}
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

const mapStateToProps = ({ orders, orderPresets, stateConstants }) => ({
  orders,
  orderPresets,
  cutoffTime: stateConstants.cutoffTime
});

export default connect(mapStateToProps, null)(OrderField);

const styles = StyleSheet.create({
  textInput: {
    fontFamily: "josefin-sans",
    backgroundColor: Colors.textInputColor,
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 30,
    padding: 20,
    paddingTop: 20,
    paddingBottom: 20,
    fontSize: Layout.fonts.body,
    color: Colors.primaryText,
    borderRadius: 5
  },
  multilineInput: {
    height: 150
  }
})