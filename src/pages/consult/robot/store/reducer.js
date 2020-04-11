import {fromJS} from "immutable";

const defaultState = fromJS({
  session: fromJS({
    id: 0,
    type: 0
  }),
  sessionFaq: fromJS({
    id: 1,
    type: 1
  })
});
export default (state = defaultState, action) => {
  switch (action.type) {
    case "online/change_session_type": //
      return state.set("session", fromJS(action.value));
    case "question/change_sessionFaq_type": //
      return state.set("sessionFaq", fromJS(action.value));
    default:
      return state;
  }
};
