import { InputTypes } from "./Inputs";
import { DynamicOrderOptions } from "./DataActions";

export const TitleField = {
  key: "title",
  title: "Title",
  type: InputTypes.TEXT_INPUT,
  defaultValue: "",
  placeholder: "Name your sandwich",
  required: true,
  dynamic: false
};

export const PresetField = {
  key: "preset",
  title: "Preset",
  type: InputTypes.PICKER,
  options: DynamicOrderOptions.PRESET_OPTIONS,
  defaultValue: "Please select",
  required: true,
  dynamic: true
};

export const DateField = {
  key: "date",
  title: "Date",
  type: InputTypes.PICKER,
  options: DynamicOrderOptions.DATE_OPTIONS,
  defaultValue: "Please select",
  required: true,
  dynamic: true
};