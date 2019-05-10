import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Platform,
  TouchableOpacity
} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const TextOrInput = ({ mutable, value, protect, openModal, updateUserData, keyboardType }) => (
  protect ?
    <ProtectedTextInput value={value} openModal={openModal} /> :
    mutable ?
      <TextInput
        style={styles.textInput}
        onEndEditing={updateUserData}
        keyboardType={keyboardType}
      >
        {value}
      </TextInput> :
      <Text style={styles.text}>{value}</Text>
);

const ProtectedTextInput = ({ value, openModal }) => (
  <View style={styles.passwordView}>
    <TextInput
      editable={false}
      style={[styles.textInput, { backgroundColor: "transparent", marginLeft: 0, paddingRight: 10 }]}
      secureTextEntry
    >
      {value}
    </TextInput>
    <TouchableOpacity onPress={() => openModal(true)}>
      <Ionicons name={`${Platform.OS === "ios" ? "ios" : "md"}-create`} size={32} color={"#000"} />
    </TouchableOpacity>
  </View>
);

export default class SettingsItem extends React.Component {
  render() {
    const screenWidth = Dimensions.get("window").width;
    return (
      <View style={[styles.container, { width: screenWidth }]}>
        <Text style={styles.title}>{this.props.title}</Text>
        <TextOrInput
          mutable={this.props.mutable}
          value={this.props.value}
          protect={this.props.protected}
          openModal={this.props.changeModalState}
          keyboardType={this.props.keyboardType}
          updateUserData={(newData) => this.props.changeUserData(this.props.category, newData)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#cfcfcf",
    borderBottomWidth: 0.25,
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  title: {
    fontFamily: "open-sans-bold",
    paddingHorizontal: 10,
    alignSelf: "center",
    flex: 1,
    fontSize: 16
  },
  text: {
    fontFamily: "open-sans",
    padding: 10,
    flex: 2,
    fontSize: 16
  },
  textInput: {
    backgroundColor: "#e1e1e1",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: "open-sans",
    flex: 2,
    marginHorizontal: 10,
    fontSize: 16
  },
  passwordView: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
    paddingRight: 10
  }
});