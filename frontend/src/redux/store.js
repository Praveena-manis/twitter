// import {createStore} from 'redux';
// import combineReducer from './combineReducer'
// const store=createStore(combineReducer)
// export default store;
import { createStore } from "redux";
import { combineReducer } from "./combineReducer";
export const store=createStore(
    combineReducer
)
