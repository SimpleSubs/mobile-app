import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text
} from "react-native";
import AnimatedTouchable from "../AnimatedTouchable";
import InputsList from "../userFields/UserInputsList";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ModalTypes from "../../constants/ModalTypes";

const InputModalContent = ({ inputData, setModalProps, title, buttonData, onSubmit }) => {
  const [state, setState] = useState({});

  const SubmitButton = ({ onPress }) => (
    <AnimatedTouchable style={styles.touchable} onPress={onPress} {...buttonData}>
      <Text style={styles.touchableText}>{buttonData.title}</Text>
    </AnimatedTouchable>
  );

  const onClose = () => {
    setState({});
  }

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
      SubmitButton={SubmitButton}
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

const inputModalProps = (title, inputData, buttonData, onSubmit, setModalProps) => ({
  type: ModalTypes.CENTER_SPRING_MODAL,
  children: (
    <InputModalContent
      inputData={inputData}
      title={title}
      buttonData={buttonData}
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
  textInput: {
    flex: 1,
    backgroundColor: Colors.textInputColor,
    padding: 15,
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.body,
    marginVertical: 10,
    borderRadius: 10,
    color: Colors.primaryText
  },
  touchable: {
    borderRadius: 100,
    backgroundColor: Colors.accentColor,
    padding: 20,
    marginTop: 20
  },
  touchableText: {
    color: Colors.textOnBackground,
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center"
  },
  loginButton: {
    borderRadius: 100,
    backgroundColor: Colors.accentColor,
    padding: 20,
    marginBottom: 20,
    marginTop: 50
  },
  loginButtonText: {
    color: Colors.textOnBackground,
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center"
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
    marginBottom: 20,
    textAlign: "center",
    color: Colors.primaryText
  }
});