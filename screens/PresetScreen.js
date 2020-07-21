import React from "react";

import { createPreset, editPreset, deletePreset, unfocusPreset } from "../redux/Actions";
import { connect } from "react-redux";
import OrderInputsList from "../components/orders/OrderInputsList";
import { TitleField } from "../constants/RequiredOrderFields";

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
  )
};

const mapStateToProps = ({ focusedPreset, orderPresets, stateConstants, user }) => ({
  focusedPreset: focusedPreset ? orderPresets[focusedPreset] : null,
  orderPresets,
  orderOptions: [TitleField].concat(stateConstants.orderOptions),
  uid: user.uid
});

const mapDispatchToProps = (dispatch) => ({
  unfocusPreset: () => dispatch(unfocusPreset()),
  createPreset: (data, uid) => createPreset(dispatch, data, uid),
  editPreset: (data, id, uid) => editPreset(dispatch, data, id, uid),
  deletePreset: (id, uid) => deletePreset(dispatch, id, uid)
})

export default connect(mapStateToProps, mapDispatchToProps)(PresetScreen);