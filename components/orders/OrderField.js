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
import { DynamicOrderOptions, getDateOptions } from "../../constants/DataActions";

/**
 * Computes options if they are dynamic.
 *
 * Uses preset dynamic order options to get options; if options are constant,
 * then the function returns those options.
 *
 * @param {string|string[]}        options      Either a key representing dynamic order options or an array of options.
 * @param {Object<string, Object>} orders       All of the user's orders.
 * @param {Object|null}            focusedOrder Object representing currently focused order (null if no object is focused).
 * @param {moment.Moment}          cutoffTime   Time after which orders may not be placed for that day.
 * @param {Object}                 orderPresets Object containing all of the user's preset orders.
 *
 * @return {string[]} Options to render in picker/checkboxes.
 */
const getDynamicOptions = (options, orders, focusedOrder, cutoffTime, orderPresets) => {
  switch (options) {
    case DynamicOrderOptions.DATE_OPTIONS:
      return getDateOptions(orders, focusedOrder, cutoffTime);
    case DynamicOrderOptions.PRESET_OPTIONS:
      return Object.keys(orderPresets).map((id) => orderPresets[id].title);
    default:
      return options;
  }
}

/**
 * Renders an order field.
 *
 * Returns an animated touchable with a corresponding form of input (usually a dropdown).
 *
 * @param {string}                 title             Title to be displayed in touchable.
 * @param {string}                 type              Input type (e.g. "PICKER").
 * @param {string|string[]}        options           Either a key representing dynamic order options or an array of options.
 * @param {string|string[]}        value             Current value of input; either a string (for pickers and text inputs) or an array of strings (for checkboxes).
 * @param {string}                 [placeholder]     Placeholder value for text input.
 * @param {Function}               setValue          Sets currently selected value(s).
 * @param {Object|null}            focusedOrder      Currently focused order (null if no object is focused).
 * @param {Object<string, Object>} orders            All of the user's orders.
 * @param {Object}                 orderPresets      Object containing all of the user's preset orders.
 * @param {moment.Moment}          cutoffTime        Time after which orders may not be placed for that day.
 * @param {boolean}                [multiline=false] Whether input is multiline (for text input).
 *
 * @return {React.ReactElement|null} Order field (animated touchable with form of input).
 * @constructor
 */
const OrderField = ({ title, type, options, value, placeholder, setValue, focusedOrder, orders, orderPresets, cutoffTime, multiline = false }) => {
  const myOptions = getDynamicOptions(options, orders, focusedOrder, cutoffTime, orderPresets);
  switch (type) {
    case InputTypes.PICKER:
      return (
        <IngredientPicker
          title={title}
          options={myOptions}
          selectedValue={value}
          changeValue={setValue}
        />
      );
    case InputTypes.CHECKBOX:
      return (
        <AnimatedDropdown title={title} type={type} selectedValue={value} options={myOptions}>
          <Checkboxes selectedItems={value} itemsArr={myOptions} setItems={setValue} />
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