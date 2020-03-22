
const SET_SOCKET_ID = "SET_SOCKET_ID";
export function setSocketId(socketId) {
  return {
    type: SET_SOCKET_ID,
    socketId
  };
}

export function socketReducer(
  state = {
    socketId: ''
  },
  action
) {
  switch (action.type) {
    case SET_SOCKET_ID:
      return Object.assign({}, state, {
        socketId: action.socketId
      });
    default:
      return state;
  }
}
