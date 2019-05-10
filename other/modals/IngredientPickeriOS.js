import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Picker,
  StyleSheet
} from "react-native";

const PICKER_HEIGHT = 25;

export default class IngredientPickeriOS extends Component {
  itemsArr = this.props.itemsArr;
  pickerItems = this.itemsArr.map(item => (
    <Picker.Item label={item} value={item} key={item} />
  ));

  componentDidMount() {
    if (!this.itemsArr.includes(this.props.item)) {
      this.props.changeItem(this.props.category, this.itemsArr[0]);
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={styles.container.opacity}
          onPress={() => (this.props.handler(false))}
        />
        <Picker
          selectedValue={this.props.item}
          onValueChange={(item) => {
            this.props.changeItem(this.props.category, item)
          }}
          style={styles.picker}
          itemStyle={styles.pickerItems}
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
    margin: 0
  },
  container: {
    height: 100 - PICKER_HEIGHT + "%",
    backgroundColor: "transparent",
    opacity: 0,
  },
  picker: {
    backgroundColor: "#bfbfbf",
    width: "100%",
    height: PICKER_HEIGHT + "%",
  },
});