import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Text
} from "react-native";
import CenterSpringModal from "./CenterSpringModal";
import AnimatedTouchable from "../AnimatedTouchable";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";

const InputModal = ({ open, toggleModal, title, inputData, buttonData }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  return (
    <CenterSpringModal
      open={open}
      toggleModal={toggleModal}
      style={{
        left: (Layout.window.width - dimensions.width) / 2,
        top: (Layout.window.height - dimensions.height) / 2
      }}
    >
      <FlatList
        onLayout={({ nativeEvent }) => setDimensions({ ...nativeEvent.layout })}
        style={styles.container}
        contentcontainerStyle={styles.contentContainer}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        data={inputData}
        renderItem={({ item }) => (
          <TextInput placeholderTextColor={Colors.textInputText} style={styles.textInput} {...item} />
        )}
        ListHeaderComponent={() => <Text style={styles.title}>{title}</Text>}
        ListFooterComponent={() => (
          <AnimatedTouchable style={styles.touchable} onPress={buttonData.onPress}>
            <Text style={styles.touchableText}>{buttonData.title}</Text>
          </AnimatedTouchable>
        )}
      />
    </CenterSpringModal>
  )
};

export default InputModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    padding: 30,
    borderRadius: 10,
    width: Layout.window.width - 125
  },
  contentContainer: {
    alignItems: "center",
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
    marginVertical: 10,
    textAlign: "center",
    color: Colors.primaryText
  }
});