/* ------------ NETWORK ------------ */
import axios from 'axios';

/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";

import globals from "./../../common/globals"

/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	userInfo: [],
	email: '',
	username: '',
	password: ''
};

import { set } from '../../storage';

/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.RESET_STATE:
			return {};

		case TYPES.SIGNUP_REQUEST:
			return {
				requesting: true
			};

		case TYPES.SIGNUP_SUCCESS:
			return {
				requesting: false, userInfo: action.data.user
			};

		case TYPES.SIGNUP_FAILURE:
			return {
				...state, requesting: false
			};

		case (TYPES.LOGOUT_SUCCESS || TYPES.LOGOUT_FAILURE):
			return {
				...initialState
			};

		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const resetState = () => ({ type: TYPES.RESET_STATE });
const signupRequestActionCreator = () => ({ type: TYPES.SIGNUP_REQUEST });
const signupSuccessActionCreator = data => ({ type: TYPES.SIGNUP_SUCCESS, data });
const signupFailureActionCreator = (data) => ({ type: TYPES.SIGNUP_FAILURE, data });

/* ------------ REDUX ACTIONS ------------ */
const reset_state = () => dispatch => dispatch(resetState());

const handleSignupSuccess = (data, dispatch) => {

	set('horizon_token', data.token, true)
	set('userInfo', data.user)

	dispatch(signupSuccessActionCreator(data));
	return data;
}

const handleSignupError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(signupFailureActionCreator(error.message));
	return error;
}

const signup = (credentials) => dispatch => {
	dispatch(signupRequestActionCreator());
	return axios.post(`${globals.HORIZON_BASE_URL}/auth/register`, credentials)
		.then(response => handleSignupSuccess(response.data, dispatch))
		.catch(error => handleSignupError(error, dispatch));
};

const signupwithmobile = (credentials) => dispatch => {
	dispatch(signupRequestActionCreator());
	return axios.post(`${globals.HORIZON_BASE_URL}/auth/register_phone`, credentials)
		.then(response => handleSignupSuccess(response.data, dispatch))
		.catch(error => handleSignupError(error, dispatch));
};

export {
	// Export Action Creators
	resetState,
	signupFailureActionCreator,
	// Export Actions
	reset_state,
	signup,
	signupwithmobile
}