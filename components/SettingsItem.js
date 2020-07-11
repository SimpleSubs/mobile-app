import React,{ useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from "react-native";
import AnimatedTouchable from "./AnimatedTouchable";
import CenterSpringModal from "./modals/CenterSpringModal";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { TYPE_MAPS } from "../constants/UserFields";

const SettingsValue = ({ password, editable, toggleModal, ...props }) => (
  <View style={[styles.textInputContainer, !editable && styles.nonEditableInput]}>
    <TextInput
      placeholderTextColor={Colors.textInputText}
      style={[styles.textInput, !editable ? styles.nonEditableInput : {}]}
      editable={editable && !password}
      {...props}
    />
    {password && editable ?
      <AnimatedTouchable endSize={0.8} onPress={() => toggleModal(true)}>
        <Ionicons name={"md-create"} color={Colors.primaryText} size={Layout.fonts.icon} style={styles.editIcon} />
      </AnimatedTouchable> :
      null
    }
  </View>
);

const SettingsItem = ({ title, placeholder, type, value, onChangeText, openModal, closeModal }) => {
  const password = type === "password";
  const editable = TYPE_MAPS[type].settingsEditable;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <SettingsValue
        value={value}
        password={password}
        editable={editable}
        onChangeText={onChangeText}
        toggleModal={toggleModal}
        placeholder={placeholder}
        {...TYPE_MAPS[type]}
      />
    </View>
  )
};

export default SettingsItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center"
  },
  title: {
    fontFamily: "josefin-sans-bold",
    color: Colors.primaryText,
    fontSize: Layout.fonts.title,
    flex: 1
  },
  textInputContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  textInput: {
    color: Colors.primaryText,
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.title,
    flex: 1,
    backgroundColor: Colors.mode === "LIGHT" ? Colors.textInputColor : Colors.backgroundColor,
    borderRadius: 7,
    padding: 15
  },
  nonEditableInput: {
    backgroundColor: "transparent"
  },
  editIcon: {
    marginLeft: 15
  }
});