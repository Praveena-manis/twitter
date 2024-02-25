import {
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE
  } from './actionTypes';
const initialState={
    user:{},
    loading: false,
    error: null,
    
}
export const userReducer=(state=initialState,action)=>{
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return{
                ...state,user:action.payload
            };
        case "LOGIN_ERROR":
            return initialState;
        case UPDATE_PROFILE_REQUEST:
             return { ...state, loading: true, error: null };
        case UPDATE_PROFILE_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };
        case UPDATE_PROFILE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }

}