// actions/userActions.js
import axios from 'axios';
import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE
} from './actionTypes';
import { BASE_URL } from '../config';

export const updateProfile = (name, location) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/user/updatedetails`,
      { name, location },
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    );
    const { data } = response;
    
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.updatedUser });
  } catch (error) {
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.response.data.message });
  }
};
