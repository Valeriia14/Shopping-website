import { FilterUpdateProps, TYPES } from "./actions";
import { PropAction } from "../props";

const initial_substate = {
  limit: 10,
  count: 0,
  offset: 0
}

export type FilterState = {
  users: any;
  orders: any;
};

const initial_state: FilterState = {
  users: { ...initial_substate, sortBy: "", query: "", filterBy: "" },
  orders: { ...initial_substate, sortBy: "", search: "", filterBy: "", timeRange: "" }
}

export default (state: FilterState = initial_state, actions: PropAction) => {
  switch (actions.type) {
    case TYPES.UPDATE:
      const updateProps: FilterUpdateProps = actions.props;
      return {
        ...state,
        [updateProps.key]: updateProps.value
      };
    default:
      return state;
  }
}