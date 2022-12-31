import React from "react";
import OrderInputsList from "../../components/orders/OrderInputsList";
import { createOrder, deleteOrder, editOrder } from "../../redux/Actions";
import { connect } from "react-redux";

const OrderScreen = ({ focusedOrder, orderOptions, createOrder, editOrder, deleteOrder, navigation }) => {
  const cancelOrder = () => navigation.navigate("Home");
  return (
    <OrderInputsList
      title={"Custom Order"}
      focusedData={focusedOrder}
      orderOptions={orderOptions}
      cancel={cancelOrder}
      createNew={createOrder}
      editExisting={editOrder}
      deleteExisting={deleteOrder}
      deleteMessage={"Delete Order"}
    />
  )
};

const mapStateToProps = ({ focusedOrder, orders, stateConstants }) => ({
  focusedOrder: focusedOrder ? orders[focusedOrder] : null,
  orderOptions: {
    requireDate: true,
    ...stateConstants.orderOptions
  }
});

const mapDispatchToProps = (dispatch) => ({
  createOrder: (data, uid, domain, dynamicSchedule) => createOrder(dispatch, data, uid, domain, dynamicSchedule),
  editOrder: (data, ids, uid, domain, dynamicSchedule) => editOrder(dispatch, data, ids, uid, domain, dynamicSchedule),
  deleteOrder: (id, domain) => deleteOrder(dispatch, id, domain),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);