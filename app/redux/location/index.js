/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";


/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	error: "",
	recentactivitys: [],
	nearbyusers: [],
	placesList: []

};


/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.GET_RECENT_ACTIVITY_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_RECENT_ACTIVITY_SUCCESS:
			return {
				...state, requesting: false, recentactivitys: action.data
			};

		case TYPES.GET_RECENT_ACTIVITY_FAILURE:
			return {
				...state, requesting: false
			};
		case TYPES.NEAR_BY_USER_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.NEAR_BY_USER_SUCCESS:
			return {
				...state, requesting: false, nearbyusers: action.data?.users
			};

		case TYPES.NEAR_BY_USER_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};
		case TYPES.GET_PLACES_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_PLACES_SUCCESS:
			return {
				...state, requesting: false, placesList: action.data?.location
			};

		case TYPES.GET_PLACES_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const getRecentActivityRequestActionCreator = () => ({ type: TYPES.GET_RECENT_ACTIVITY_REQUEST });
const getRecentActivitySuccessActionCreator = data => ({ type: TYPES.GET_RECENT_ACTIVITY_SUCCESS, data });
const getRecentActivityFailureActionCreator = (data) => ({ type: TYPES.GET_RECENT_ACTIVITY_FAILURE, data });

const getNearByUserRequestActionCreator = () => ({ type: TYPES.NEAR_BY_USER_REQUEST });
const getNearByUserSuccessActionCreator = data => ({ type: TYPES.NEAR_BY_USER_SUCCESS, data });
const getNearByUserFailureActionCreator = (data) => ({ type: TYPES.NEAR_BY_USER_FAILURE, data });

const getPlacesRequestActionCreator = () => ({ type: TYPES.GET_PLACES_REQUEST });
const getPlacesSuccessActionCreator = data => ({ type: TYPES.GET_PLACES_SUCCESS, data });
const getPlacesFailureActionCreator = (data) => ({ type: TYPES.GET_PLACES_FAILURE, data });

/* ------------ REDUX ACTIONS ------------ */

const handleGetRecentActivitySuccess = (data, dispatch) => {
	dispatch(getRecentActivitySuccessActionCreator(data));
	return data;
}

const handleGetRecentActivityError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getRecentActivityFailureActionCreator(error.message));
	return error
}

const getRecentActivity = () => dispatch => {
	dispatch(getRecentActivityRequestActionCreator());
	return horizonApiAxios.get(`/location/getRecentActivity?limit=10`)
		.then((response) => { handleGetRecentActivitySuccess(response.data, dispatch) })
		.catch(error => handleGetRecentActivityError(error, dispatch));
};

const handleGetNearByUserSuccess = (data, dispatch) => {
	dispatch(getNearByUserSuccessActionCreator(data));
	return data;
}

const handleGetNearByUserError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getNearByUserFailureActionCreator(error.message));
	return error
}

const getNearByUser = (data) => dispatch => {
	dispatch(getNearByUserRequestActionCreator());
	return horizonApiAxios.post('/location/nearByUser', data)
		.then((response) => { handleGetNearByUserSuccess(response.data, dispatch) })
		.catch(error => handleGetNearByUserError(error, dispatch));
};

const handleGetPlaceSuccess = (data, dispatch) => {
	dispatch(getPlacesSuccessActionCreator(data));
	return data;
}

const handleGetPlaceError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getPlacesFailureActionCreator(error.message));
	return error
}

const getPlaces = () => dispatch => {
	dispatch(getPlacesRequestActionCreator());
	return horizonApiAxios.get('/location/getLocation')
		.then((response) => { handleGetPlaceSuccess(response.data, dispatch) })
		.catch(error => handleGetPlaceError(error, dispatch));
};


export {
	// Export Actions
	getRecentActivity,
	getNearByUser,
	getPlaces
}