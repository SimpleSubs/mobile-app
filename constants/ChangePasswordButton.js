import { changePasswordModalProps } from "./DataActions";
import AnimatedTouchable from "../components/AnimatedTouchable";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "./Colors";
import { changePassword } from "../redux/Thunks";
import { openModal, closeModal } from "../redux/features/display/modalSlice";
import { clearOperation, setKey } from "../redux/features/display/modalOperationsSlice";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./Layout";
import React from "react";
import uuid from "react-native-uuid";

const ChangePasswordButton = () => {
  const { key, returnValue } = useSelector(({ modalOperations }) => modalOperations);
  const dispatch = useDispatch();
  const [modalId, setModalId] = React.useState();

  const openChangePasswordModal = () => {
    dispatch(setKey(modalId));
    dispatch(openModal(changePasswordModalProps));
  };

  React.useEffect(() => {
    if (key === modalId && returnValue && returnValue.oldPassword && returnValue.newPassword) {
      dispatch(closeModal());
      dispatch(changePassword(returnValue.oldPassword, returnValue.newPassword));
      dispatch(clearOperation());
    }
  }, [returnValue, modalId]);

  React.useEffect(() => setModalId(uuid.v4()), []);

  return (
    <AnimatedTouchable endSize={0.8} onPress={openChangePasswordModal}>
      <Ionicons name={"create-outline"} color={getColors().primaryText} size={Layout.fonts.icon} />
    </AnimatedTouchable>
  );
}

export default ChangePasswordButton;