import {setGroup} from "./redux/groupApi";

export function login(pubId, nickname) {
  const payload = {pubId, nickname};
  return fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then(response => response.json());
}

export function fetchGroup(groupID) {
  return fetch("/api/group/" + groupID.toString(), {
    method: "GET",
  }).then(response => response.json());
}

export function createGroup(pubId, groupName, public_) {
  const payload = {pubId, groupName, public: public_};
  return fetch("/api/group", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then(response => response.json());
}

export function joinGroup(groupId, userId, socketId) {
  const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      groupId,
      userId,
      socketId
    })
  };

  return fetch(
    "/api/group/join",
    requestOptions
  ).then(response => response.json()).then((groupJson) => {
    setGroup(groupJson);
    return true;
  });
};

export function fetchGroupMembers(groupID) {
  return fetch("/api/persons/" + groupID.toString(), {
    method: "GET",
  }).then(response => response.json());
}