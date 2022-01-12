import { openChangePasswordModal } from "./DataActions";
import AnimatedTouchable from "../components/AnimatedTouchable";
import { Ionicons } from "@expo/vector-icons";
import Colors from "./Colors";
import Layout from "./Layout";
import React from "react";

/**
 * Conditionally renders an edit button
 *
 * Renders create icon within a touchable based on a given edit action.
 *
 * @param {Function}    openModal      Opens the top-level modal.
 * @param {Function}    closeModal     Closes the top-level modal.
 * @param {Function}    setModalProps  Sets top-level modal props.
 * @param {Function}    changePassword Changes password in Firebase Auth.
 *
 * @return {React.ReactElement|null} Icon touchable to render.
 * @constructor
 */
const ChangePasswordButton = ({ openModal, closeModal, setModalProps, changePassword }) => {
  let action;
  const changePasswordAndClose = ({ oldPassword, newPassword }) => {
    closeModal();
    changePassword(oldPassword, newPassword);
  }
  action = () => openChangePasswordModal(openModal, setModalProps, changePasswordAndClose);
  return (
    <AnimatedTouchable endSize={0.8} onPress={action}>
      <Ionicons name={"create-outline"} color={Colors.primaryText} size={Layout.fonts.icon} />
    </AnimatedTouchable>
  );
}

export default ChangePasswordButton;