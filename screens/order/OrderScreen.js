import React from "react";
import OrderInputsList from "../../components/orders/OrderInputsList";

import { DateField } from "../../constants/RequiredOrderFields";
import { READABLE_FORMAT } from "../../constants/Date";
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
  focusedOrder: focusedOrder ? {
    ...orders[focusedOrder],
    date: orders[focusedOrder].date.format(READABLE_FORMAT)
  } : null,
  orderOptions: [DateField].concat(stateConstants.orderOptions)
});

const mapDispatchToProps = (dispatch) => ({
  createOrder: (data, uid) => createOrder(dispatch, data, uid),
  editOrder: (data, id, uid) => editOrder(dispatch, data, id, uid),
  deleteOrder: (id) => deleteOrder(dispatch, id),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);