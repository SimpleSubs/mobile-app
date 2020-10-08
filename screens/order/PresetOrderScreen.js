import React from "react";
import OrderInputsList from "../../components/orders/OrderInputsList";

import { createOrder, deleteOrder, editOrder } from "../../redux/Actions";
import { connect } from "react-redux";
import { DateField, PresetField } from "../../constants/RequiredOrderFields";
import {READABLE_FORMAT} from "../../constants/Date";

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

const mapStateToProps = ({ focusedOrder, orders, orderPresets, user }) => ({
  focusedOrder: focusedOrder ? {
    key: focusedOrder,
    preset: orders[focusedOrder].title,
    date: orders[focusedOrder].date.format(READABLE_FORMAT)
  } : null,
  orderPresets,
  uid: user.uid
});

const mapDispatchToProps = (dispatch) => ({
  createOrder: (data, uid) => createOrder(dispatch, data, uid),
  editOrder: (data, id, uid) => editOrder(dispatch, data, id, uid),
  deleteOrder: (id) => deleteOrder(dispatch, id),
})

export default connect(mapStateToProps, mapDispatchToProps)(PresetOrderScreen);