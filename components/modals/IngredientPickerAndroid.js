import React, { Component } from "react";
import {
  View,
  Picker,
  StyleSheet, Text
} from "react-native";

// Creates and renders ingredient picker on Android
export default class IngredientPickerAndroid extends Component {
  state = {
    width: 0 // Width of picker
  };

  itemsArr = this.props.itemsArr;
  pickerItems = this.itemsArr.map((item) => <Picker.Item label={item} value={item} key={item} />);

  // Sets picker width according to longest picker item
  componentWillMount() {
    this.setState({ width: Math.max(...this.props.itemsArr.map((item) => item.length)) * 12.5 });
  }

  // Sets picker item to first option if the current value does not exist (i.e. is "Please select")
  componentDidMount() {
    if (!this.itemsArr.includes(this.props.item)) {
      this.props.changeItem(this.props.category, this.itemsArr[0]);
    }
  }

  // Renders picker
  render() {
    return (
      <View style={styles.touchable}>
        <Text style={[styles.touchableTitleText, { textAlign: "left" }]}>{this.props.category}</Text>
        <Picker
          mode={"dialog"}
          selectedValue={this.props.item}
          onValueChange={(item) => {
            this.props.changeItem(this.props.category.toLowerCase(), item);
          }}
          prompt={this.props.item}
          style={[styles.picker, { width: this.state.width }]}
        >
          {this.pickerItems}
        </Picker>
      </View>
    );
  }
}

// Styles for picker
const styles = StyleSheet.create({
  pickerItems: {
    fontSize: 20,
    margin: 0,
    fontFamily: "open-sans",
    textAlign: "center"
  },
  picker: {
    marginLeft: "auto"
  },
  touchable: {
    backgroundColor: "white",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  touchableTitleText: {
    textAlign: "left",
    fontSize: 20,
    fontFamily: "open-sans",
  }
});