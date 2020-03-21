import { login } from "../api";
import { sessionService } from "redux-react-session";

export function requestLoginUser(nickname) {
  return function(dispatch) {
    return login(nickname).then(json => {
      sessionService
        .saveSession({ token: json.token })
        .then(() => {
          sessionService
            .saveUser(json.user)
            // .then(() => {
            //   history.push("/");
            // })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    });
  };
}

export const logout = () => {
  return () => {
    return sessionApi
      .logout()
      .then(() => {
        sessionService.deleteSession();
        sessionService.deleteUser();
        // history.push("/login");
      })
      .catch(err => {
        throw err;
      });
  };
};
