import { createSlice } from "@reduxjs/toolkit";
import {ISO_FORMAT, parseISO} from "../../../constants/Date";
import {
  getCutoffDate,
  getLunchSchedule,
  getScheduleGroups,
  getUserLunchSchedule,
  OrderScheduleTypes
} from "../../../constants/Schedule";
import moment from "moment";

export const ordersSlice = createSlice({
  name: "orders",
  initialState: {},
  reducers: {
    /**
     * Update order state from data pulled from Firestore collection
     */
    updateOrders: (state, action) => {
      const { user, stateConstants } = state;
      if (!stateConstants || stateConstants.orderSchedule || !stateConstants.lunchSchedule || !user) {
        return;
      }
      const { orderSchedule } = stateConstants;
      const lunchSchedule = getUserLunchSchedule(stateConstants.lunchSchedule, user);
      const collectionData = {};
      const cutoffDate = getCutoffDate(orderSchedule);
      const docs = action.payload;
      for (const { uid, ...data } of docs) {
        if (parseISO(data.date).isSameOrAfter(cutoffDate)) {
          collectionData[data.id] = data;
        }
      }
      if (orderSchedule.scheduleType === OrderScheduleTypes.CUSTOM && Object.keys(collectionData).length > 0) {
        const orders = {};
        const dates = docs.map(({ date }) => moment(date));
        const allScheduleGroups = getScheduleGroups(
          getLunchSchedule(
            orderSchedule,
            lunchSchedule,
            moment().format(ISO_FORMAT),
            moment.max(dates).format(ISO_FORMAT)
          ),
          lunchSchedule.schedule
        );
        const collectionDataKeys = Object.keys(collectionData);
        allScheduleGroups.forEach((group) => {
          const relevantKeys = collectionDataKeys.filter((key) => group.includes(collectionData[key].date));
          const key = group[0];
          if (relevantKeys.length > 0) {
            orders[key] = { date: group, multipleOrders: true, key, keys: relevantKeys };
            for (const id of relevantKeys) {
              orders[key][collectionData[id].date] = collectionData[id];
            }
          }
        });
        return orders;
      } else {
        return collectionData;
      }
    }
  }
});

export const { updateOrders } = ordersSlice.actions;

export default ordersSlice.reducer;