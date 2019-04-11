import React, { Fragment } from "react";
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { ModalProvider, ModalConsumer } from "./ModalContext";
import ModalRoot from "./ModalRoot";
import IngredientPicker from "./IngredientPicker";
import CheckboxList from "../checkboxes/CheckboxList";
import AnimatedDropdown from "../checkboxes/AnimatedDropdown";

const BREAD = ["Dutch crunch", "Sourdough roll", "Ciabatta roll", "Sliced wheat", "Sliced Sourdough", "Gluten free"];
const MEAT = ["None", "Turkey", "Roast beef", "Pastrami", "Salami", "Ham", "Tuna salad", "Egg salad"];
const CHEESE = ["Provolone", "Swiss", "Cheddar", "Fresh Mozzarella"];
const CONDIMENTS = ["Mayo", "Mustard", "Pesto", "Red Vin/Olive Oil", "Balsamic Vin/Olive Oil", "Roasted Red Peppers",
  "Pepperoni", "Pickles", "Basil", "Lettuce", "Tomatoes", "Hummus", "Red Onions", "Jalapenos", "Artichoke Hearts"];
const EXTRAS = ["Avocado", "Bacon"];

/**
 * Modal that contains picker for specified category
 * @param onRequestClose - action to close modal
 * @param picker - picker to be contained in modal
 * @returns {*}
 * @constructor
 */
const ItemModal = ({ onRequestClose, picker }) => (
  <Modal
    isOpen
    onRequestClose={onRequestClose}
    animationType="slide"
    transparent={true}
    presentationStyle="overFullScreen"
    style={{height: "100%"}}
  >
    {picker}
  </Modal>
);

/**
 * Touchable that opens picker for specified category
 * @param showModal - action to show the picker
 * @param modal - picker modal
 * @param category - category of picker (e.g. "Bread", "Meat", etc.)
 * @param item - currently selected item in picker
 * @returns {*}
 * @constructor
 */
const IngredientTouchable = ({ showModal, modal, category, item }) => (
  <TouchableOpacity style={styles.touchable} onPress={() => showModal(modal)}>
    <View style={{flexDirection: "row"}}>
      <Text style={[styles.touchableTitleText, {textAlign: "left"}]}>{category}</Text>
      <Text style={styles.touchableText}>{item}</Text>
    </View>
  </TouchableOpacity>
);

/**
 * Touchable that opens picker for extra meat
 * @param showModal - action to show the picker
 * @param modal - picker modal
 * @param item - currently selected item in picker
 * @returns {*}
 * @constructor
 */
const ExtraMeat = ({ showModal, modal, item }) => (
  <IngredientTouchable
    showModal={showModal}
    category="Extra Meat"
    modal={modal}
    item={item}
  />
);

/**
 * Class containing the content for order screen
 */
export default class EventModals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bread: "Please select",
      meat: "None",
      extraMeat: "None",
      cheese: [],
      condiments: [],
      extras: []
    };
    this.changeItem = this.changeItem.bind(this);
    this.handleCheckboxes = this.handleCheckboxes.bind(this);
  }

  /**
   * Changes selected items for pickers
   * @param category - the category of picker (e.g. "meat", "cheese", etc)
   * @param item - the item that the user has just selected
   */
  changeItem(category, item) {
    if (category === "extraMeat" && this.state.meat === "None" && item !== "None")
      category = "meat";
    else if (category === "meat" && item === "None" && this.state.extraMeat !== "None") {
      this.setState({meat: this.state.extraMeat});
      category = "extraMeat"
    }
    let state = {};
    state[category] = item;
    this.setState(state);
  }

  /**
   * Changes selected values in a CheckboxList
   * @param title - name of item being selected/deselected
   * @param checked - if it is already checked
   * @param category - category of CheckboxList (e.g. "meat", "cheese", etc)
   */
  handleCheckboxes(title, checked, category) {
    let checkedArr = this.state[category];
    let setStateVal = {};
    if (checked) {
      setStateVal[category] = checkedArr.filter(function(value) {
        return value !== title;
      });
    } else {
      checkedArr.push(title);
      setStateVal[category] = checkedArr;
    }
    this.setState(setStateVal);
  }

  /**
   * Modal containing the picker for bread items (see const BREAD)
   * @param onRequestClose - action to close the modal
   * @returns {*}
   */
  breadModal = ({ onRequestClose }) => (
    <ItemModal
      onRequestClose={onRequestClose}
      picker={
        <IngredientPicker
          changeItem={this.changeItem}
          itemsArr={BREAD}
          handler={onRequestClose}
          item={this.state.bread}
          category="bread"
        />
      }
    />
  );

  /**
   * Modal containing the picker for meat items (see const MEAT)
   * @param onRequestClose - action to close the modal
   * @returns {*}
   */
  meatModal = ({ onRequestClose }) => (
    <ItemModal
      onRequestClose={onRequestClose}
      picker={
        <IngredientPicker
          itemsArr={MEAT}
          handler={onRequestClose}
          category="meat"
          changeItem={this.changeItem}
          item={this.state.meat}
        />
      }
    />
  );

  /**
   * Modal containing the picker for extra meat items (see const MEAT)
   * @param onRequestClose - action to close the modal
   * @returns {*}
   */
  extraMeatModal = ({ onRequestClose }) => (
    <ItemModal
      onRequestClose={onRequestClose}
      picker={
        <IngredientPicker
          itemsArr={MEAT}
          handler={onRequestClose}
          category="extraMeat"
          changeItem={this.changeItem}
          item={this.state.extraMeat}
        />
      }
    />
  );

  render() {
    return(
      <ModalProvider>
        <ModalRoot />
        <ModalConsumer>
          {({ showModal }) => (
            <Fragment>
              <IngredientTouchable
                showModal={showModal}
                category="Bread"
                modal={this.breadModal}
                item={this.state.bread}
              />
              <IngredientTouchable
                showModal={showModal}
                category="Meat"
                modal={this.meatModal}
                item={this.state.meat}
              />
              <AnimatedDropdown
                title="Cheese"
                content={
                  <CheckboxList
                    category="cheese"
                    columns={2}
                    content={CHEESE}
                    selected={this.state.cheese}
                    handler={this.handleCheckboxes}
                  />
                }
              />
              <AnimatedDropdown
                title="Condiments"
                content={
                  <CheckboxList
                    category="condiments"
                    columns={2}
                    content={CONDIMENTS}
                    selected={this.state.condiments}
                    handler={this.handleCheckboxes}
                  />
                }
              />
              <AnimatedDropdown
                title="Extras"
                content={
                  <View>
                    <CheckboxList
                      category="extras"
                      columns={2}
                      content={EXTRAS}
                      selected={this.state.extras}
                      handler={this.handleCheckboxes}
                    />
                    <ExtraMeat
                      showModal={showModal}
                      modal={this.extraMeatModal}
                      item={this.state.extraMeat}
                    />
                  </View>
                }
              />
            </Fragment>
          )}
        </ModalConsumer>
      </ModalProvider>
    )
  }
}

/**
 * StyleSheet for page
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    backgroundColor: "white",
    padding: 20,
  },
  touchableText: {
    textAlign: "center",
    color: "#7c7c7c",
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