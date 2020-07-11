import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "../components/AnimatedTouchable";
import SettingsItem from "../components/SettingsItem";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import InputModal from "../components/modals/InputModal";
import SettingsList from "../components/SettingsList";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

import { editUserData, openModal, setModalProps, closeModal } from "../redux/Actions";
import { connect } from "react-redux";
import inputModalProps from "../components/modals/InputModal";
import InputTypes from "../constants/InputTypes";

const ChangePasswordModal = ({ open, toggleModal }) => {
  const [email, setEmail] = useState("");
  return (
    <InputModal
      open={open}
      toggleModal={toggleModal}
      title={"Reset password"}
      inputData={[
        { value: email, type: "password", placeholder: "Current password", onChangeText: (text) => setEmail(text) },
        { value: email, type: "newPassword", placeholder: "New password", onChangeText: (text) => setEmail(text) },
        { value: email, type: "confirmPassword", placeholder: "Confirm new password", onChangeText: (text) => setEmail(text) }
      ]}
      buttonData={{ onPress: () => toggleModal(!open), title: "Send email" }}
    />
  )
};

const SettingsScreen = ({ navigation }) => {
  const inset = useSafeArea();
  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <View style={styles.header}>
        <AnimatedTouchable style={styles.button} endSize={0.8} onPress={() => navigation.navigate("Home")}>
          <Ionicons name={"ios-arrow-back"} color={Colors.primaryText} size={Layout.fonts.icon} />
        </AnimatedTouchable>
        <Text style={styles.headerText}>Settings</Text>
        <Ionicons
          style={styles.button}
          name={"md-square-outline"}
          color={Colors.backgroundColor}
          size={Layout.fonts.icon}
        />
      </View>
      <SettingsList />
    </View>
  )
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  header: {
    paddingVertical: 10,
    backgroundColor: Colors.backgroundColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10
  },
  headerText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
    textAlign: "center",
    color: Colors.primaryText
  },
  button: {
    padding: 10
  },
  flatList: {
    flex: 1,
    backgroundColor: Colors.mode === "LIGHT" ? Colors.backgroundColor : Colors.scrollViewBackground
  },
  contentContainer: {
    paddingTop: 10
  }
});