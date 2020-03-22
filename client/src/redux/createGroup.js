import { createGroup } from "../api";

export const SUCCESS_CREATE_GROUP = "SUCCESS_CREATE_GROUP";
function successCreateGroup(json) {
  return {
    type: SUCCESS_CREATE_GROUP,
    rawData: json
  };
}

export function requestGroupCreation(pubId, groupName, public_) {
  return function(dispatch) {
    return createGroup(pubId, groupName, public_).then(json => dispatch(successCreateGroup(json)));
  };
}

export function createGroupReducer(
  state = {
    group: {}
  },
  action
) {
  switch (action.type) {
    case SUCCESS_CREATE_GROUP:
      return Object.assign({}, state, {
        group: action.rawData
      });
    default:
      return state;
  }
}
