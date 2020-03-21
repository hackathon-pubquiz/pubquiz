import { login } from "../api";
import { sessionService } from "redux-react-session";

export function requestLoginUser(nickname) {
  return function(dispatch) {
    return login(nickname).then(json => {
      console.log("Logging in this user");
      console.log(json);
      console.log(json.person);
      sessionService
        .saveSession({ token: json.token })
        .then(() => {
          console.log("Logging in this user");
          console.log(json.person);
          sessionService
            .saveUser(json.person)
            // .then(() => {
            //   history.push("/");
            // })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    });
  };
}

export function requestLogoutUser() {
  return function(dispatch) {
    return () => {
      sessionService.deleteSession();
      sessionService.deleteUser();
      // history.push("/login");
    };
  };
}
