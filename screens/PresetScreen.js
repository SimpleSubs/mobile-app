import React from "react";
import { createPreset, editPreset, deletePreset } from "../redux/Thunks";
import { unfocusPreset } from "../redux/features/orders/focusedPresetSlice";
import { useSelector, useDispatch } from "react-redux";
import OrderInputsList from "../components/orders/OrderInputsList";
import { TitleField } from "../constants/RequiredFields";

const PresetScreen = ({ navigation }) => {
  const focusedPreset = useSelector(({ focusedPreset, orderPresets }) => (
    focusedPreset && orderPresets[focusedPreset]
  ));
  const orderOptions = useSelector(({ stateConstants }) => ({
    ...stateConstants.orderOptions,
    orderOptions: [
      TitleField,
      ...stateConstants.orderOptions.orderOptions
    ]
  }));
  const dispatch = useDispatch();

  const cancelPreset = () => {
    dispatch(unfocusPreset());
    navigation.navigate("Order Settings");
  };

  return (
    <OrderInputsList
      title={focusedPreset ? "Edit Preset" : "Create Preset"}
      focusedData={focusedPreset}
      orderOptions={orderOptions}
      cancel={cancelPreset}
      createNew={(data, dynamicSchedule) => dispatch(createPreset(data, dynamicSchedule))}
      editExisting={(data, ids) => dispatch(editPreset(data, ids[0]))}
      deleteExisting={(id) => dispatch(deletePreset(id))}
      deleteMessage={"Delete Preset"}
    />
  );
};

export default PresetScreen;