import { configureStore } from "@reduxjs/toolkit";
import domainReducer from "./features/auth/domainSlice";
import focusedOrderReducer from "./features/orders/focusedOrderSlice";
import focusedPresetReducer from "./features/orders/focusedPresetSlice";
import hasAuthenticatedReducer from "./features/auth/hasAuthenticatedSlice";
import infoMessageReducer from "./features/display/infoMessageSlice";
import loadingReducer from "./features/display/loadingSlice";
import modalReducer from "./features/display/modalSlice";
import modalOperationsReducer from "./features/display/modalOperationsSlice";
import orderPresetsReducer from "./features/orders/orderPresetsSlice";
import ordersReducer from "./features/orders/ordersSlice";
import stateConstantsReducer from "./features/auth/stateConstantsSlice";
import userReducer from "./features/auth/userSlice";
import isUpdatingUserReducer from "./features/auth/isUpdatingUser";

const store = configureStore({
  reducer: {
    domain: domainReducer,
    focusedOrder: focusedOrderReducer,
    focusedPreset: focusedPresetReducer,
    hasAuthenticated: hasAuthenticatedReducer,
    isUpdatingUser: isUpdatingUserReducer,
    infoMessage: infoMessageReducer,
    loading: loadingReducer,
    modal: modalReducer,
    modalOperations: modalOperationsReducer,
    orderPresets: orderPresetsReducer,
    orders: ordersReducer,
    stateConstants: stateConstantsReducer,
    user: userReducer
  }
});

export default store;