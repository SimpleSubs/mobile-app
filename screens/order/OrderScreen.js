import React from "react";
import OrderInputsList from "../../components/orders/OrderInputsList";
import { useSelector, useDispatch } from "react-redux";
import { createOrder, deleteOrder, editOrder } from "../../redux/Thunks";
import { isDynamic } from "../../constants/Schedule";

const OrderScreen = ({ navigation }) => {
  const focusedOrder = useSelector(({ orders, focusedOrder }) => focusedOrder && orders[focusedOrder]);
  const orderOptions = useSelector(({ stateConstants }) => stateConstants.orderOptions);
  const dispatch = useDispatch();
  const dynamic = isDynamic(orderOptions);
  return (
    <OrderInputsList
      title={"Custom Order"}
      focusedData={focusedOrder}
      orderOptions={orderOptions}
      cancel={() => navigation.navigate("Home")}
      createNew={(data) => dispatch(createOrder(data, dynamic))}
      editExisting={(data, ids) => dispatch(editOrder(data, ids, dynamic))}
      deleteExisting={(id) => dispatch(deleteOrder(id))}
      deleteMessage={"Delete Order"}
    />
  )
};

export default OrderScreen;