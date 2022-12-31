import React from "react";
import OrderInputsList from "../../components/orders/OrderInputsList";
import { createOrder, deleteOrder, editOrder } from "../../redux/Actions";
import { connect } from "react-redux";
import { DateField, PresetField } from "../../constants/RequiredFields";

const PresetOrderScreen = ({ focusedOrder, createOrder, editOrder, deleteOrder, navigation }) => {
  const cancelOrder = () => navigation.navigate("Home");
  return (
    <OrderInputsList
      title={"Preset Order"}
      focusedData={focusedOrder}
      orderOptions={{ orderOptions: [DateField, PresetField] }}
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
    date: orders[focusedOrder].date
  } : null,
  uid: user.uid
});

const mapDispatchToProps = (dispatch) => ({
  createOrder: (data, uid, domain) => createOrder(dispatch, data, uid, domain, false),
  editOrder: (data, id, uid, domain) => editOrder(dispatch, data, id, uid, domain, false),
  deleteOrder: (id, domain) => deleteOrder(dispatch, id, domain),
})

export default connect(mapStateToProps, mapDispatchToProps)(PresetOrderScreen);