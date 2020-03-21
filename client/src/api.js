export function login(nickname) {
  const payload = { nickname: nickname };
  return fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then(response => response.json());
}
