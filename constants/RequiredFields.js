/**
 * @file Manages fields to display in orders that may not be changed by admin.
 * @author Emily Sturman <emily@sturman.org>
 */
import { InputTypes, TextTypes } from "./Inputs";
import { DynamicOrderOptions, EditActions } from "./DataActions";

// Text input to set title for preset
export const TitleField = {
  key: "title",
  title: "Title",
  type: InputTypes.TEXT_INPUT,
  defaultValue: "",
  placeholder: "Name your sandwich",
  required: true,
  dynamic: false
};

// Picker to select an order preset
export const PresetField = {
  key: "preset",
  title: "Preset",
  type: InputTypes.PICKER,
  options: DynamicOrderOptions.PRESET_OPTIONS,
  defaultValue: "Please select",
  required: true,
  dynamic: true
};

// Picker to select a date for the order
export const DateField = {
  key: "date",
  title: "Date",
  type: InputTypes.PICKER,
  options: DynamicOrderOptions.DATE_OPTIONS,
  defaultValue: "Please select",
  required: true,
  dynamic: true
};

export const EmailField = {
  key: "email",
  title: "Email",
  placeholder: "Email",
  inputType: InputTypes.TEXT_INPUT,
  textType: TextTypes.EMAIL,
  mutable: false
};

export const PasswordField = {
  key: "password",
  title: "Password",
  placeholder: "Password",
  inputType: InputTypes.TEXT_INPUT,
  textType: TextTypes.PASSWORD,
  mutable: true,
  editAction: EditActions.CHANGE_PASSWORD
};

export const NewPasswordField = {
  ...PasswordField,
  textType: TextTypes.NEW_PASSWORD
};

export const ConfirmPasswordField = {
  key: "confirmPassword",
  title: "Confirm password",
  placeholder: "Confirm password",
  inputType: InputTypes.TEXT_INPUT,
  textType: TextTypes.CONFIRM_PASSWORD
}