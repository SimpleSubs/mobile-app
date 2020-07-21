import { ISO_FORMAT, toReadable } from "./Date";
import inputModalProps from "../components/modals/InputModal";
import { InputTypes, TextTypes } from "./Inputs";
import moment from "moment";

export const DynamicOrderOptions = {
  DATE_OPTIONS: "DATE_OPTIONS",
  PRESET_OPTIONS: "PRESET_OPTIONS"
}

export const EditActions = {
  CHANGE_PASSWORD: "CHANGE_PASSWORD"
}

const isSchoolDay = (date) => date.day() > 0 && date.day() < 6;

export const getDateOptions = (orders, focusedOrder, cutoffTime) => {
  const orderKeys = Object.keys(orders);
  let dateOptions = [];
  let date = moment();
  if (date.isAfter(cutoffTime)) {
    date.add(1, "days");
  }
  for (let i = 0; i < 14; i++) {
    let isoDate = date.format(ISO_FORMAT);
    // date must be a school day (Mon-Fri) and there must be no other order on that date
    if (isSchoolDay(date) && (!orderKeys.includes(isoDate) || (focusedOrder && focusedOrder.key === isoDate))) {
      dateOptions.push(toReadable(isoDate));
    }
    date.add(1, "days");
  }
  return dateOptions;
}

export const openChangePasswordModal = (openModal, setModalProps, changePassword) => (
  openModal(inputModalProps(
    "Change Password",
    [
      {
        key: "oldPassword",
        inputType: InputTypes.TEXT_INPUT,
        textType: TextTypes.PASSWORD,
        placeholder: "Current password"
      },
      {
        key: "newPassword",
        inputType: InputTypes.TEXT_INPUT,
        textType: TextTypes.NEW_PASSWORD,
        placeholder: "New password"
      }
    ],
    { title: "Confirm" },
    changePassword,
    setModalProps
  ))
);