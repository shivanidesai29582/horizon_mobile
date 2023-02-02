/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";


/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	error: "",
	userList: [],
	userRecentList: [],

};


/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.SEARCH_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.SEARCH_SUCCESS:
			return {
				...state, requesting: false, userList: action.data
			};

		case TYPES.SEARCH_FAILURE:
			return {
				...state, requesting: false
			};

		case TYPES.RECENT_SEARCH_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.RECENT_SEARCH_SUCCESS:
			return {
				...state, requesting: false, userRecentList: action.data
			};

		case TYPES.RECENT_SEARCH_FAILURE:
			return {
				...state, requesting: false
			};

		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const getSearchRequestActionCreator = () => ({ type: TYPES.SEARCH_REQUEST });
const getSearchSuccessActionCreator = data => ({ type: TYPES.SEARCH_SUCCESS, data });
const getSearchFailureActionCreator = (data) => ({ type: TYPES.SEARCH_FAILURE, data });

const getRecentSearchRequestActionCreator = () => ({ type: TYPES.RECENT_SEARCH_REQUEST });
const getRecentSearchSuccessActionCreator = data => ({ type: TYPES.RECENT_SEARCH_SUCCESS, data });
const getRecentSearchFailureActionCreator = (data) => ({ type: TYPES.RECENT_SEARCH_FAILURE, data });


/* ------------ REDUX ACTIONS ------------ */

const handleGetSearchSuccess = (data, dispatch) => {
	dispatch(getSearchSuccessActionCreator(data));
	return data;
}

const handleGetSearchError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getSearchFailureActionCreator(error.message));
	return error
}

const getSearch = (data) => dispatch => {
	dispatch(getSearchRequestActionCreator());
	return horizonApiAxios.get(`/search/${data}`)
		.then((response) => { handleGetSearchSuccess(response.data, dispatch) })
		.catch(error => handleGetSearchError(error, dispatch));
};

const handleGetRecentSearchSuccess = (data, dispatch) => {
	dispatch(getRecentSearchSuccessActionCreator(data));
	return data;
}

const handleGetRecentSearchError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getRecentSearchFailureActionCreator(error.message));
	return error
}

const getRecentSearch = () => dispatch => {
	dispatch(getRecentSearchRequestActionCreator());
	return horizonApiAxios.get(`/recent-search`)
		.then((response) => { handleGetRecentSearchSuccess(response.data, dispatch) })
		.catch(error => handleGetRecentSearchError(error, dispatch));
};

const addRecentSearch = (data) => dispatch => {
	return horizonApiAxios.post(`/add-search`, data)
		.then((response) => { getRecentSearch() })
		.catch();
};

const removeRecentSearch = (id) => dispatch => {
	return horizonApiAxios.post(`/clear-search/${id?.id}`)
		.then((response) => {  })
		.catch((response) => {
		});
};

const removeAllRecentSearch = () => dispatch => {
	return horizonApiAxios.post(`/clear-all-search`)
		.then((response) => { getRecentSearch() })
		.catch();
};

export {
	// Export Actions
	getSearch,
	getRecentSearch,
	addRecentSearch,
	removeRecentSearch,
	removeAllRecentSearch
}