import React from "react";
import OrderInputsList from "../../components/orders/OrderInputsList";
import { createOrder, deleteOrder, editOrder } from "../../redux/Thunks";
import { useDispatch, useSelector } from "react-redux";
import { DateField, PresetField } from "../../constants/RequiredFields";

const PresetOrderScreen = ({ navigation }) => {
  const focusedOrder = useSelector(({ orders, focusedOrder }) => focusedOrder && {
    key: focusedOrder,
    preset: orders[focusedOrder].title,
    date: orders[focusedOrder].date
  });
  const dispatch = useDispatch();
  return (
    <OrderInputsList
      title={"Preset Order"}
      focusedData={focusedOrder}
      orderOptions={{ orderOptions: [DateField, PresetField] }}
      cancel={() => navigation.navigate("Home")}
      createNew={(data) => dispatch(createOrder(data, false))}
      editExisting={(data, ids) => dispatch(editOrder(data, ids, false))}
      deleteExisting={(id) => dispatch(deleteOrder(id, false))}
      deleteMessage={"Delete Order"}
    />
  )
};

export default PresetOrderScreen;