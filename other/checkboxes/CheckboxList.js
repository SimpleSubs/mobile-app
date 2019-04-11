import React from "react";
import {
  View,
  StyleSheet
} from "react-native";

import { CheckBox } from "react-native-elements/src/index";

const ACCENT_COLOR = "#ffd541";

function splitColumns(columns, content) {
  if (columns > content.length)
    columns = content.length;
  let splitIndex = Math.ceil(content.length / columns);
  let columnArrs = [];
  for (let i = 1; i <= columns; i++)
    columnArrs.push(content.slice((i - 1) * splitIndex, i * splitIndex));
  if (columnArrs[columnArrs.length - 1].length === 0) {
    let lastCol = columnArrs[columnArrs.length - 2];
    columnArrs[columnArrs.length - 1] = [lastCol.pop()];
  }
  return columnArrs;
}

export default class CheckboxList extends React.Component {
  render() {
    let columnArrays = splitColumns(this.props.columns, this.props.content);
    let columnMaps = columnArrays.map((colData, i) => {
      let checkboxArr = colData.map((title, j) => {
        let checked = this.props.selected.includes(title);
        return (
          <CheckBox
            key={j}
            title={title}
            textStyle={styles.text}
            checkedColor={ACCENT_COLOR}
            uncheckedColor={ACCENT_COLOR}
            checked={checked}
            onPress={() => this.props.handler(title, checked, this.props.category)}
            containerStyle={styles.checkboxContainer}
            size={24}
          />
        )
      });
      return (
        <View style={{flexDirection: "column", flex: 1}} key={i} onLayout={this.props.onLayout}>
          {checkboxArr}
        </View>
      )
    });
    return (
      <View style={styles.container}>
        {columnMaps}
      </View>
    );
  }
}

// TODO: Add box shadow for android (shadow props only support iOS)
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 10
  },
  text: {
    textAlign: "left",
    color: "#000",
    fontSize: 14,
    fontFamily: "open-sans",
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    margin: 0,
    padding: 5,
  }
});