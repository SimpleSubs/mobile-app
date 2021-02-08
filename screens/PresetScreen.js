/**
 * @file Manages screen for creating and editing user presets.
 * @author Emily Sturman <emily@sturman.org>
 */
import React from "react";
import { createPreset, editPreset, deletePreset, unfocusPreset } from "../redux/Actions";
import { connect } from "react-redux";
import OrderInputsList from "../components/orders/OrderInputsList";
import { TitleField } from "../constants/RequiredFields";

/**
 * Renders screen for creating and editing user presets.
 *
 * Uses OrderInputsList (same as order screens) to allow for adding ingredients
 * to presets and titling them (all presets MUST have a unique title).
 *
 * @param {Object|null}                    focusedPreset Preset being currently edited (null if creating new preset).
 * @param {Object[]}                       orderOptions  Array of order fields required/asked for order.
 * @param {function()}                     unfocusPreset Sets state-wide focusedPreset to null.
 * @param {function(Object,string)}        createPreset  Pushes a new preset to Firebase.
 * @param {function(Object,string,string)} editPreset    Pushes edits to exiting preset to Firebase.
 * @param {function(string,string)}        deletePreset  Deletes existing preset from Firebase.
 * @param {Object}                         navigation    Navigation object passed by React Navigation.
 *
 * @return {React.ReactElement} Element to render.
 * @constructor
 */
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
  orderOptions: [
    TitleField,
    ...stateConstants.orderOptions
  ]
});

const mapDispatchToProps = (dispatch) => ({
  unfocusPreset: () => dispatch(unfocusPreset()),
  createPreset: (data, uid, domain) => createPreset(dispatch, data, uid, domain),
  editPreset: (data, id, uid, domain) => editPreset(dispatch, data, id, uid, domain),
  deletePreset: (id, domain, uid) => deletePreset(dispatch, id, uid, domain)
})

export default connect(mapStateToProps, mapDispatchToProps)(PresetScreen);