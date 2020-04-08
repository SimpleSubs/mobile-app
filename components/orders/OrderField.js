import React, { useState } from "react";
import {
  View,
  Text
} from "react-native";
import IngredientPicker from "./IngredientPicker";
import AnimatedDropdown from "./AnimatedDropdown";

import OrderInputTypes from "../../constants/OrderInputTypes";

const OrderField = ({ title, type, options, defaultValue }) => {
  const [selectedValue, setValue] = useState(defaultValue || OrderInputTypes[type].defaultValue);
  switch (type) {
    case OrderInputTypes.PICKER.title:
      return (
        <AnimatedDropdown title={title} type={type} selectedValue={selectedValue}>
          <IngredientPicker options={options} selectedValue={selectedValue} changeValue={setValue} />
        </AnimatedDropdown>
      );
    case OrderInputTypes.CHECKBOX.title:
      return (
        <AnimatedDropdown title={title} type={type} selectedValue={selectedValue}>
          <Text>There will be some cool checkbox stuff happening here</Text>
        </AnimatedDropdown>
      );
    default:
      return null;
  }
};

export default OrderField;