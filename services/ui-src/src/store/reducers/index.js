/**
 * Central location for combining reducers
 */

import { combineReducers } from "redux";
import formReducer from "./formReducer";
import userReducer from "./user/userReducer";

const rootReducer = combineReducers({ form: formReducer, user: userReducer });

export default rootReducer;
