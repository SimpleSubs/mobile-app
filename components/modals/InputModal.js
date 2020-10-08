/**
 * @file Creates modal containing a form (inputs and submit button).
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text
} from "react-native";
import InputsList from "../userFields/UserInputsList";
import SubmitButton from "../userFields/SubmitButton";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ModalTypes from "../../constants/ModalTypes";

/**
 * Renders modal containing validated inputs and submit button.
 *
 * Uses InputsList component to render inputs; used for forgot
 * password and change password modals.
 *
 * @see InputsList
 *
 * @param {Object[]} inputData     Data for InputsList.
 * @param {Function} setModalProps Function to change/set props for modal.
 * @param {string}   title         String to display at the top of the modal.
 * @param {string}   buttonTitle   String to display within submit button.
 * @param {Function} onSubmit      Function to execute when submit button is pressed.
 *
 * @returns {React.ReactElement} Component representing modal contents.
 * @constructor
 */
const InputModalContent = ({ inputData, setModalProps, title, buttonTitle, onSubmit }) => {
  const [state, setState] = useState({});
  const Submit = (props) => <SubmitButton {...props} title={buttonTitle} />;
  const onClose = () => setState({});

  useEffect(() => {
    setModalProps({ onClose });
    return () => setModalProps({ onClose: () => {} });
  }, []);

  return (
    <InputsList
      data={inputData}
      state={state}
      setInputs={setState}
      ListHeaderComponent={() => <Text style={styles.title}>{title}</Text>}
      SubmitButton={Submit}
      onSubmit={() => onSubmit(state)}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      onLayout={({ nativeEvent }) => setModalProps({ style: {
        left: (Layout.window.width - nativeEvent.layout.width) / 2,
        top: (Layout.window.height - nativeEvent.layout.height) / 2
      }})}
      scrollEnabled={false}
    />
  )
};

/**
 * Generates props to pass to global Modal component.
 *
 * Uses InputModalContent to generate props for a center spring
 * modal containing validated inputs, a title, and a submit button.
 *
 * @see InputModalContent
 *
 * @param {string}   title         String to be displayed at the top of the modal.
 * @param {Object[]} inputData     Data to be passed to InputsList.
 * @param {string}   buttonTitle   String to display in submit button.
 * @param {Function} onSubmit      Function to execute when submit button is pressed.
 * @param {Function} setModalProps Function to change/set props for top-level modal.
 *
 * @returns {{ children: React.ReactElement, type: string }} Props to pass to top-level modal.
 */
const inputModalProps = (title, inputData, buttonTitle, onSubmit, setModalProps) => ({
  type: ModalTypes.CENTER_SPRING_MODAL,
  children: (
    <InputModalContent
      inputData={inputData}
      title={title}
      buttonTitle={buttonTitle}
      onSubmit={onSubmit}
      setModalProps={setModalProps}
    />
  )
});

export default inputModalProps;

const styles = StyleSheet.create({
  container: {
    width: Layout.window.width - 125,
    backgroundColor: Colors.backgroundColor,
    padding: 30,
    borderRadius: 10,
  },
  contentContainer: {
    paddingHorizontal: 0
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
    marginBottom: 20,
    textAlign: "center",
    color: Colors.primaryText
  }
});