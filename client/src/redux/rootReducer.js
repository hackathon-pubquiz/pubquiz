import {combineReducers} from "redux";
import {sessionReducer} from "redux-react-session";
import {quizReducer} from "./quizReducer";
import {socketReducer} from "./socketReducer";

export default combineReducers({
  session: sessionReducer,
  quiz: quizReducer,
  socket: socketReducer,
});
