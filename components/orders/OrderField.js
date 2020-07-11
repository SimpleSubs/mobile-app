import React, { useState } from "react";
import IngredientPicker from "./IngredientPicker";
import AnimatedDropdown from "./AnimatedDropdown";
import Checkboxes from "./Checkboxes";

import InputTypes from "../../constants/InputTypes";

const OrderField = ({ title, type, options, value, setValue }) => {
  switch (type) {
    case InputTypes.picker:
      return (
        <AnimatedDropdown title={title} type={type} selectedValue={value}>
          <IngredientPicker options={options} selectedValue={value} changeValue={setValue} />
        </AnimatedDropdown>
      );
    case InputTypes.checkbox:
      return (
        <AnimatedDropdown title={title} type={type} selectedValue={value}>
          <Checkboxes selectedItems={value} itemsArr={options} setItems={setValue} />
        </AnimatedDropdown>
      );
    default:
      return null;
  }
};

export default OrderField;