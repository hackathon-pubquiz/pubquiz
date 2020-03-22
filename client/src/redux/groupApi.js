import {createGroup, joinGroup} from "../api";
import {sessionService} from "redux-react-session";

export function requestGroupCreation(pubId, groupName, public_) {
  return function (dispatch) {
    return createGroup(pubId, groupName, public_)
      .then(groupJson => {
        sessionService.loadUser().then((user) => {
          joinGroup(groupJson.group.id, user.id);
        });
      });
  };
}

export function setGroup(groupJson) {
  sessionService.loadUser().then((user) => {
    user = {...user, group: groupJson};
    sessionService.saveUser(user);
  });
}

export function getGroup() {
  sessionService.loadUser().then((user) => {
    return user.group;
  });
}
