/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";


/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	error: "",
	stories: [],
	lastaddedstorie: ''

};


/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.STORIES_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.STORIES_SUCCESS:
			return {
				...state, requesting: false, stories: action.data
			};

		case TYPES.STORIES_FAILURE:
			return {
				...state, requesting: false
			};
		case TYPES.ADD_STORIES_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.ADD_STORIES_SUCCESS:
			return {
				...state, requesting: false, lastaddedstorie: action.data
			};

		case TYPES.ADD_STORIES_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const getallstoriesRequestActionCreator = () => ({ type: TYPES.STORIES_REQUEST });
const getallstoriesSuccessActionCreator = data => ({ type: TYPES.STORIES_SUCCESS, data });
const getallstoriesFailureActionCreator = (data) => ({ type: TYPES.STORIES_FAILURE, data });

const addstoriesRequestActionCreator = () => ({ type: TYPES.ADD_STORIES_REQUEST });
const addstoriesSuccessActionCreator = data => ({ type: TYPES.ADD_STORIES_SUCCESS, data });
const addstoriesFailureActionCreator = (data) => ({ type: TYPES.ADD_STORIES_FAILURE, data });

/* ------------ REDUX ACTIONS ------------ */

const handleStoriesSuccess = (data, dispatch) => {
	dispatch(getallstoriesSuccessActionCreator(data));
	return data;
}

const handleStoriesError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getallstoriesFailureActionCreator(error.message));
	return error
}

const getAllStories = () => dispatch => {
	dispatch(getallstoriesRequestActionCreator());
	return horizonApiAxios.get(`/stories/getAll`)
		.then((response) => { handleStoriesSuccess(response.data, dispatch) })
		.catch(error => handleStoriesError(error, dispatch));
};

const handleAddStoriesSuccess = (data, dispatch) => {
	dispatch(addstoriesSuccessActionCreator(data));
	return data;
}

const handleAddStoriesError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(addstoriesFailureActionCreator(error.message));
	return error
}

const addStorie = (data) => dispatch => {
	dispatch(addstoriesRequestActionCreator());
	return horizonApiAxios.post('/stories/add', data)
		.then((response) => { handleAddStoriesSuccess(response.data, dispatch) })
		.catch(error => handleAddStoriesError(error, dispatch));
};

export {
	// Export Actions
	getAllStories,
	addStorie
}