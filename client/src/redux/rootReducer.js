import { combineReducers } from "redux";
import { sessionReducer } from "redux-react-session";
import { quizReducer } from "./quizReducer";

export default combineReducers({
  session: sessionReducer,
  quiz: quizReducer,
});
