/**
 * @file Manages screen for ordering from existing user presets.
 * @author Emily Sturman <emily@sturman.org>
 */
import React from "react";
import OrderInputsList from "../../components/orders/OrderInputsList";
import { createOrder, deleteOrder, editOrder } from "../../redux/Actions";
import { connect } from "react-redux";
import { DateField, PresetField } from "../../constants/RequiredFields";
import { READABLE_FORMAT } from "../../constants/Date";

/**
 * Renders screen for placing orders from existing user presets.
 *
 * Renders order-formatted screen with only date and preset fields; other
 * fields are auto-completed once order is placed.
 *
 * @param {Object|null}                    focusedOrder Order currently being edited (null if creating new order).
 * @param {function(Object,string)}        createOrder  Pushes new order to Firebase.
 * @param {function(Object,string,string)} editOrder    Pushes edits for existing order to Firebase.
 * @param {function(string)}               deleteOrder  Deletes existing order from Firebase.
 * @param {Object}                         navigation   Navigation prop passed by React Navigation.
 *
 * @return {React.ReactElement} Element to render.
 * @constructor
 */
const PresetOrderScreen = ({ focusedOrder, createOrder, editOrder, deleteOrder, navigation }) => {
  const cancelOrder = () => navigation.navigate("Home");
  return (
    <OrderInputsList
      title={"Preset Order"}
      focusedData={focusedOrder}
      orderOptions={[DateField, PresetField]}
      cancel={cancelOrder}
      createNew={createOrder}
      editExisting={editOrder}
      deleteExisting={deleteOrder}
      deleteMessage={"Delete Order"}
    />
  )
};

const mapStateToProps = ({ focusedOrder, orders, user }) => ({
  focusedOrder: focusedOrder ? {
    key: focusedOrder,
    preset: orders[focusedOrder].title,
    date: orders[focusedOrder].date.format(READABLE_FORMAT)
  } : null,
  uid: user.uid
});

const mapDispatchToProps = (dispatch) => ({
  createOrder: (data, uid, domain) => createOrder(dispatch, data, uid, domain),
  editOrder: (data, id, uid, domain) => editOrder(dispatch, data, id, uid, domain),
  deleteOrder: (id, domain) => deleteOrder(dispatch, id, domain),
})

export default connect(mapStateToProps, mapDispatchToProps)(PresetOrderScreen);