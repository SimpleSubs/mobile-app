import React, { Fragment } from "react";
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform
} from "react-native";
import { ModalProvider, ModalConsumer } from "./ModalContext";
import ModalRoot from "./ModalRoot";
import IngredientPickeriOS from "./IngredientPickeriOS";
import IngredientPickerAndroid from "./IngredientPickerAndroid";
import CheckboxList from "../checkboxes/CheckboxList";
import AnimatedDropdown from "../checkboxes/AnimatedDropdown";
import Ingredients from "../../constants/Ingredients";
import Colors from "../../constants/Colors";

const { bread, meat, cheese, condiments, extras } = Ingredients;

// Modal containing picker
const ItemModal = ({ onRequestClose, picker }) => (
  <Modal
    isOpen
    onRequestClose={onRequestClose}
    animationType="slide"
    transparent={true}
    presentationStyle="overFullScreen"
    style={{ height: "100%" }}
  >
    {picker}
  </Modal>
);

// Touchable that opens modal on iOS
const IngredientTouchableiOS = ({ showModal, modal, category, item }) => (
  <TouchableOpacity style={styles.touchable} onPress={() => showModal(modal)}>
    <View style={{ flexDirection: "row" }}>
      <Text style={[styles.touchableTitleText, { textAlign: "left" }]}>{category}</Text>
      <Text style={styles.touchableText}>{item}</Text>
    </View>
  </TouchableOpacity>
);

// Touchable that opens modal on Android
const IngredientTouchableAndroid = ({ category, item, itemsArr, changeItem }) => (
  <IngredientPickerAndroid
    changeItem={changeItem}
    itemsArr={itemsArr}
    item={item}
    category={category}
  />
);

// Touchable that opens modal
const IngredientTouchable = ({ showModal, modal, category, item, itemsArr, changeItem }) => (
  Platform.OS === "ios" ?
    <IngredientTouchableiOS showModal={showModal} modal={modal} category={category} item={item} /> :
    <IngredientTouchableAndroid category={category} item={item} itemsArr={itemsArr} changeItem={changeItem} />
);

// Creates and renders all order options, including dropdowns and modals
export default class MenuModals extends React.Component {
  // Modal that allows user to select order date
  dateModal = ({ onRequestClose }) => (
    <ItemModal
      onRequestClose={onRequestClose}
      picker={
        <IngredientPickeriOS
          changeItem={this.props.changeItem}
          itemsArr={this.props.dateStrings}
          handler={onRequestClose}
          item={this.props.state.date}
          category={"date"}
        />
      }
    />
  );

  // Modal that allows user to select bread
  breadModal = ({ onRequestClose }) => (
    <ItemModal
      onRequestClose={onRequestClose}
      picker={
        <IngredientPickeriOS
          changeItem={this.props.changeItem}
          itemsArr={bread}
          handler={onRequestClose}
          item={this.props.state.bread}
          category={"bread"}
        />
      }
    />
  );

  // Renders order options
  render() {
    return(
      <ModalProvider>
        <ModalRoot />
        <ModalConsumer>
          {({ showModal }) => (
            <Fragment>
              <IngredientTouchable
                showModal={showModal}
                category={"Date"}
                modal={this.dateModal}
                item={this.props.state.date}
                changeItem={this.props.changeItem}
                itemsArr={this.props.dateStrings}
              />
              <IngredientTouchable
                showModal={showModal}
                category={"Bread"}
                modal={this.breadModal}
                item={this.props.state.bread}
                changeItem={this.props.changeItem}
                itemsArr={bread}
              />
              <AnimatedDropdown
                title={"Meat"}
                content={
                  <CheckboxList
                    category={"meat"}
                    columns={2}
                    content={meat}
                    selected={this.props.state.meat}
                    handler={this.props.handleCheckboxes}
                  />
                }
              />
              <AnimatedDropdown
                title={"Cheese"}
                content={
                  <CheckboxList
                    category={"cheese"}
                    columns={2}
                    content={cheese}
                    selected={this.props.state.cheese}
                    handler={this.props.handleCheckboxes}
                  />
                }
              />
              <AnimatedDropdown
                title={"Condiments"}
                content={
                  <CheckboxList
                    category={"condiments"}
                    columns={2}
                    content={condiments}
                    selected={this.props.state.condiments}
                    handler={this.props.handleCheckboxes}
                  />
                }
              />
              <AnimatedDropdown
                title={"Extras"}
                content={
                  <CheckboxList
                    category={"extras"}
                    columns={2}
                    content={extras}
                    selected={this.props.state.extras}
                    handler={this.props.handleCheckboxes}
                  />
                }
              />
            </Fragment>
          )}
        </ModalConsumer>
      </ModalProvider>
    )
  }
}

// Styles for modals
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  touchable: {
    backgroundColor: "white",
    padding: 20,
  },
  touchableText: {
    textAlign: "center",
    color: Colors.secondaryText,
    fontSize: 20,
    fontFamily: "open-sans",
    marginLeft: "auto",
  },
  touchableTitleText: {
    textAlign: "left",
    fontSize: 20,
    fontFamily: "open-sans",
  }
});