export const LOGIN_USER = "LOGIN_USER";
function loginUser(userId) {
  return {
    type: LOGIN_USER,
    userId: userId
  };
}

export function sessionReducer(
  state = {
    userId: undefined
  },
  action
) {
  switch (action.type) {
    case LOGIN_USER:
      return Object.assign({}, state, {
        userId: action.userId
      });
    default:
      return state;
  }
}
