import React from "react";
import { createPreset, editPreset, deletePreset, unfocusPreset } from "../redux/Actions";
import { connect } from "react-redux";
import OrderInputsList from "../components/orders/OrderInputsList";
import { TitleField } from "../constants/RequiredFields";

const PresetScreen = ({ focusedPreset, orderOptions, unfocusPreset, createPreset, editPreset, deletePreset, navigation }) => {
  const cancelPreset = () => {
    unfocusPreset();
    navigation.navigate("Order Settings");
  };
  return (
    <OrderInputsList
      title={focusedPreset ? "Edit Preset" : "Create Preset"}
      focusedData={focusedPreset}
      orderOptions={orderOptions}
      cancel={cancelPreset}
      createNew={createPreset}
      editExisting={editPreset}
      deleteExisting={deletePreset}
      deleteMessage={"Delete Preset"}
    />
  );
};

const mapStateToProps = ({ focusedPreset, orderPresets, stateConstants }) => ({
  focusedPreset: focusedPreset ? orderPresets[focusedPreset] : null,
  orderPresets,
  orderOptions: {
    ...stateConstants.orderOptions,
    orderOptions: [
      TitleField,
      ...stateConstants.orderOptions.orderOptions
    ]
  }
});

const mapDispatchToProps = (dispatch) => ({
  unfocusPreset: () => dispatch(unfocusPreset()),
  createPreset: (data, uid, domain) => createPreset(dispatch, data, uid, domain),
  editPreset: (data, id, uid, domain) => editPreset(dispatch, data, id[0], uid, domain),
  deletePreset: (id, domain, uid) => deletePreset(dispatch, id, uid, domain)
})

export default connect(mapStateToProps, mapDispatchToProps)(PresetScreen);