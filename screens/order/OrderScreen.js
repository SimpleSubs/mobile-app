/**
 * @file Manages main order screen (in between for custom/preset order screens)
 * @author Emily Sturman <emily@sturman.org>
 */
import React from "react";
import OrderInputsList from "../../components/orders/OrderInputsList";
import { DateField } from "../../constants/RequiredFields";
import { READABLE_FORMAT } from "../../constants/Date";
import { createOrder, deleteOrder, editOrder } from "../../redux/Actions";
import { connect } from "react-redux";

/**
 * Renders main order screen to navigate to either sub-screen (custom or preset order).
 *
 * @param {Object|null}                    focusedOrder Currently focused order (null if new order is being created).
 * @param {Array}                          orderOptions Fields for order ingredients.
 * @param {function(Object,string)}        createOrder  Pushes new order to Firebase.
 * @param {function(Object,string,string)} editOrder    Pushes edits for existing order to Firebase.
 * @param {function(string)}               deleteOrder  Deletes existing order from Firebase.
 * @param {Object}                         navigation   Navigation prop passed by React Navigation.
 *
 * @return {React.ReactElement} Element to render.
 * @constructor
 */
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
  orderOptions: [
    DateField,
    ...stateConstants.orderOptions
  ]
});

const mapDispatchToProps = (dispatch) => ({
  createOrder: (data, uid, domain) => createOrder(dispatch, data, uid, domain),
  editOrder: (data, id, uid, domain) => editOrder(dispatch, data, id, uid, domain),
  deleteOrder: (id, domain) => deleteOrder(dispatch, id, domain),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);