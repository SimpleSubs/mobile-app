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

export const BREAD = ["Dutch crunch", "Sourdough roll", "Ciabatta roll", "Sliced wheat", "Sliced Sourdough", "Gluten free"];
const MEAT = ["Turkey", "Roast beef", "Pastrami", "Salami", "Ham", "Tuna salad", "Egg salad"];
const CHEESE = ["Provolone", "Swiss", "Cheddar", "Fresh Mozzarella"];
const CONDIMENTS = ["Mayo", "Mustard", "Pesto", "Red Vin/Olive Oil", "Balsamic Vin/Olive Oil", "Roasted Red Peppers",
  "Pepperoni", "Pickles", "Basil", "Lettuce", "Tomatoes", "Hummus", "Red Onions", "Jalapenos", "Artichoke Hearts"];
const EXTRAS = ["Avocado", "Bacon", "Extra meat"];

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

const IngredientTouchableiOS = ({ showModal, modal, category, item }) => (
  <TouchableOpacity style={styles.touchable} onPress={() => showModal(modal)}>
    <View style={{ flexDirection: "row" }}>
      <Text style={[styles.touchableTitleText, { textAlign: "left" }]}>{category}</Text>
      <Text style={styles.touchableText}>{item}</Text>
    </View>
  </TouchableOpacity>
);

const IngredientTouchableAndroid = ({ category, item, itemsArr, changeItem }) => (
  <IngredientPickerAndroid
    changeItem={changeItem}
    itemsArr={itemsArr}
    item={item}
    category={category}
  />
);

const IngredientTouchable = ({ showModal, modal, category, item, itemsArr, changeItem }) => (
  Platform.OS === "ios" ?
    <IngredientTouchableiOS showModal={showModal} modal={modal} category={category} item={item} /> :
    <IngredientTouchableAndroid category={category} item={item} itemsArr={itemsArr} changeItem={changeItem} />
);

export default class EventModals extends React.Component {
  dateModal = ({ onRequestClose }) => (
    <ItemModal
      onRequestClose={onRequestClose}
      picker={
        <IngredientPickeriOS
          changeItem={this.props.changeItem}
          itemsArr={this.props.dateStrings}
          handler={onRequestClose}
          item={this.props.state.date}
          category="date"
        />
      }
    />
  );

  breadModal = ({ onRequestClose }) => (
    <ItemModal
      onRequestClose={onRequestClose}
      picker={
        <IngredientPickeriOS
          changeItem={this.props.changeItem}
          itemsArr={BREAD}
          handler={onRequestClose}
          item={this.props.state.bread}
          category="bread"
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
                itemsArr={BREAD}
              />
              <AnimatedDropdown
                title="Meat"
                content={
                  <CheckboxList
                    category="meat"
                    columns={2}
                    content={MEAT}
                    selected={this.props.state.meat}
                    handler={this.props.handleCheckboxes}
                  />
                }
              />
              <AnimatedDropdown
                title="Cheese"
                content={
                  <CheckboxList
                    category="cheese"
                    columns={2}
                    content={CHEESE}
                    selected={this.props.state.cheese}
                    handler={this.props.handleCheckboxes}
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
                    selected={this.props.state.condiments}
                    handler={this.props.handleCheckboxes}
                  />
                }
              />
              <AnimatedDropdown
                title="Extras"
                content={
                  <CheckboxList
                    category="extras"
                    columns={2}
                    content={EXTRAS}
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