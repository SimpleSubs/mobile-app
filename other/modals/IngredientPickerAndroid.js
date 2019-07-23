import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Picker,
  StyleSheet, Text
} from "react-native";

const PICKER_HEIGHT = 25;

export default class IngredientPickerAndroid extends Component {
  state = {
    width: 0
  };

  itemsArr = this.props.itemsArr;
  pickerItems = this.itemsArr.map(item => (
    <Picker.Item label={item} value={item} key={item} />
  ));

  componentWillMount() {
    this.setState({ width: Math.max(...this.props.itemsArr.map((item) => item.length)) * 12.5});
  }

  componentDidMount() {
    if (!this.itemsArr.includes(this.props.item)) {
      this.props.changeItem(this.props.category, this.itemsArr[0]);
    }
  }

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

const styles = StyleSheet.create({
  pickerItems: {
    fontSize: 20,
    margin: 0,
    fontFamily: "open-sans",
    textAlign: "center"
  },
  container: {
    height: 100 - PICKER_HEIGHT + "%",
    backgroundColor: "transparent",
    opacity: 0,
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