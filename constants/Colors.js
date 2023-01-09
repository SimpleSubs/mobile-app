import { StyleSheet, Appearance } from "react-native";

// Colors to display when phone is in light mode
const LightColors = {
  accentColor: "#ffd541",
  backgroundColor: "#fff",
  textInputColor: "#f0f0f0",
  darkerTextInputColor: "#e8e8e8",
  primaryText: "#000",
  secondaryText: "#a4a4a4",
  textOnBackground: "#fff",
  scrollViewBackground: "#f0f0f0",
  uncheckedCheckbox: "#cbcbcb",
  checkboxText: "#6e6e6e",
  statusBar: "dark-content",
  textInputText: "#b6b6b6",
  linkText: "#466cff",
  infoModal: "#333",
  errorText: "#d72e2e",
  pickerIOS: "#ddd",
  okAction: "#33ac33",
  loadingIndicator: "#999999",
  borderColor: "#0000000f",
  cardColor: "#fafafa",
  mode: "LIGHT"
};

// Colors to display when phone is in dark mode
const DarkColors = {
  accentColor: "#ffd541",
  backgroundColor: "#1f1f1f",
  textInputColor: "#080808",
  darkerTextInputColor: "#080808",
  primaryText: "#fff",
  secondaryText: "#a4a4a4",
  textOnBackground: "#fff",
  scrollViewBackground: "#000",
  uncheckedCheckbox: "#cbcbcb",
  checkboxText: "#fff",
  statusBar: "light-content",
  textInputText: "#858585",
  linkText: "#466cff",
  infoModal: "#2a2a2a",
  errorText: "#d72e2e",
  pickerIOS: "#ddd",
  okAction: "#33ac33",
  loadingIndicator: "#fff",
  borderColor: "#ffffff0f",
  cardColor: "#151515",
  mode: "DARK"
};

export const getColors = () => Appearance.getColorScheme() === "dark" ? DarkColors : LightColors

const createStyleSheet = (styles) => StyleSheet.create(styles(getColors()));

// Exports either light or dark color scheme depending on phone settings
export default createStyleSheet;