import { combineReducers } from "redux";
import Layout, { LayoutState } from "./layout/reducers";
import Filter, { FilterState } from "./filter/reducers";
import Order, { orderSummaryState }  from "./order/reducers";

export type RootState = {
  Layout: LayoutState,
  Filter: FilterState,
  Order: orderSummaryState,
};

export const Reducers = combineReducers({
  Layout,
  Filter,
  Order,
});
