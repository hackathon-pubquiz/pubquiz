export function login(pubId, nickname) {
  const payload = { pubId, nickname };
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
  const payload = { pubId, groupName, public: public_ };
  return fetch("/api/group", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then(response => response.json());
}
