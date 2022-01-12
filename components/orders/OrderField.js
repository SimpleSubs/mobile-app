/**
 * @file Creates a field to display on order/preset screens.
 * @author Emily Sturman <emily@sturman.org>
 */
import React from "react";
import { TextInput, StyleSheet } from "react-native";
import IngredientPicker from "./IngredientPicker";
import AnimatedDropdown from "./AnimatedDropdown";
import Checkboxes from "./Checkboxes";
import { connect } from "react-redux";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { InputTypes } from "../../constants/Inputs";

/**
 * Renders an order field.
 *
 * Returns an animated touchable with a corresponding form of input (usually a dropdown).
 *
 * @param {string}          title             Title to be displayed in touchable.
 * @param {string}          type              Input type (e.g. "PICKER").
 * @param {string[]}        [options]         An array of options for checkbox and picker fields.
 * @param {string|string[]} value             Current value of input; either a string (for pickers and text inputs) or an array of strings (for checkboxes).
 * @param {string}          [placeholder]     Placeholder value for text input.
 * @param {Function}        setValue          Sets currently selected value(s).
 * @param {boolean}         [multiline=false] Whether input is multiline (for text input).
 *
 * @return {React.ReactElement|null} Order field (animated touchable with form of input).
 * @constructor
 */
const OrderField = ({ title, type, options, value, placeholder, setValue, multiline = false }) => {
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
  lunchSchedule: stateConstants.lunchSchedule,
  orderSchedule: stateConstants.orderSchedule
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