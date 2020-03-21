import { login } from "../api";

export const LOGIN_USER = "LOGIN_USER";
export function requestLoginUser(nickname) {
  return function(dispatch) {
    return login(nickname).then(json => dispatch(successLoginUser(json)));
  };
}

export const SUCCESS_LOGIN_USER = "SUCCESS_LOGIN_USER";
function successLoginUser(result) {
  console.log(result);
  return {
    type: SUCCESS_LOGIN_USER,
    user: result.person
  };
}

export function sessionReducer(
  state = {
    userId: undefined
  },
  action
) {
  switch (action.type) {
    case SUCCESS_LOGIN_USER:
      return Object.assign({}, state, {
        user: action.user
      });
    default:
      return state;
  }
}
