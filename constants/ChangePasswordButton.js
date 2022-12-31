import { openChangePasswordModal } from "./DataActions";
import AnimatedTouchable from "../components/AnimatedTouchable";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "./Colors";
import Layout from "./Layout";
import React from "react";

const ChangePasswordButton = ({ openModal, closeModal, setModalProps, changePassword }) => {
  let action;
  const changePasswordAndClose = ({ oldPassword, newPassword }) => {
    closeModal();
    changePassword(oldPassword, newPassword);
  }
  action = () => openChangePasswordModal(openModal, setModalProps, changePasswordAndClose);
  return (
    <AnimatedTouchable endSize={0.8} onPress={action}>
      <Ionicons name={"create-outline"} color={getColors().primaryText} size={Layout.fonts.icon} />
    </AnimatedTouchable>
  );
}

export default ChangePasswordButton;