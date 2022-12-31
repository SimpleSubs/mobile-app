import React, { useState, useEffect } from "react";
import {
  Text,
  View
} from "react-native";
import InputsList from "../userFields/UserInputsList";
import SubmitButton from "../userFields/SubmitButton";
import createStyleSheet from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ModalTypes from "../../constants/ModalTypes";

/**
 * Modal containing validated inputs and submit button.
 */
const InputModalContent = ({ inputData, setModalProps, title, buttonTitle, onSubmit }) => {
  const [state, setState] = useState({});
  const themedStyles = createStyleSheet(styles);
  const Submit = (props) => <SubmitButton {...props} title={buttonTitle} />;
  const onClose = () => setState({});

  useEffect(() => {
    setModalProps({ onClose });
    return () => setModalProps({ onClose: () => {} });
  }, []);

  return (
    <>
      <View style={themedStyles.spacer} />
      <InputsList
        data={inputData}
        state={state}
        setInputs={setState}
        ListHeaderComponent={() => <Text style={themedStyles.title}>{title}</Text>}
        SubmitButton={Submit}
        onSubmit={onSubmit}
        style={themedStyles.container}
        contentContainerStyle={themedStyles.contentContainer}
        scrollEnabled={false}
      />
      <View style={themedStyles.spacer} />
    </>
  )
};

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

const styles = (Colors) => ({
  container: {
    width: Layout.window.width - 125,
    maxWidth: 500,
    backgroundColor: Colors.backgroundColor,
    padding: 30,
    borderRadius: 10
  },
  spacer: {
    flex: 100000000
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