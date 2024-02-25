// import { combineReducers } from "redux";
// import { userReducer } from "./userReducer";

// const rootReducer=combineReducers({
//     user:userReducer,
// })
// export default rootReducer;
import { combineReducers } from "redux";
import { userReducer } from "./userReducer";

export const combineReducer = combineReducers({ userReducer: userReducer });