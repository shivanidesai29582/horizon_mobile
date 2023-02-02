/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";


/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	error: "",
	illustrations: [],
	lastaddedfurutevisit: ''

};


/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.ILLUSTRATION_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.ILLUSTRATION_SUCCESS:
			return {
				...state, requesting: false, illustrations: action.data
			};

		case TYPES.ILLUSTRATION_FAILURE:
			return {
				...state, requesting: false,error :action.data
			};
		case TYPES.ADD_ILLUSTRATION_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.ADD_ILLUSTRATION_SUCCESS:
			return {
				...state, requesting: false, lastaddedfurutevisit: action.data
			};

		case TYPES.ADD_ILLUSTRATION_FAILURE:
			return {
				...state, requesting: false ,error :action.data
			};
		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const getallillustrationRequestActionCreator = () => ({ type: TYPES.ILLUSTRATION_REQUEST });
const getallillustrationSuccessActionCreator = data => ({ type: TYPES.ILLUSTRATION_SUCCESS, data });
const getallillustrationFailureActionCreator = (data) => ({ type: TYPES.ILLUSTRATION_FAILURE, data });

const addillustrationRequestActionCreator = () => ({ type: TYPES.ADD_ILLUSTRATION_REQUEST });
const addillustrationSuccessActionCreator = data => ({ type: TYPES.ADD_ILLUSTRATION_SUCCESS, data });
const addillustrationFailureActionCreator = (data) => ({ type: TYPES.ADD_ILLUSTRATION_FAILURE, data });

/* ------------ REDUX ACTIONS ------------ */

const handleIllustrationSuccess = (data, dispatch) => {
	dispatch(getallillustrationSuccessActionCreator(data));
	return data;
}

const handleIllustrationError = (data, dispatch) => {
	dispatch(getallillustrationFailureActionCreator(data.message));
	return data.message;
}

const getAllIllustration = () => dispatch => {
	dispatch(getallillustrationRequestActionCreator());
	return horizonApiAxios.get(`/future-visite/getAll`)
		.then((response) => { handleIllustrationSuccess(response.data, dispatch) })
		.catch(error => handleIllustrationError(error, dispatch));
};

const handleAddIllustrationSuccess = (data, dispatch) => {
	dispatch(addillustrationSuccessActionCreator(data));
	return data;
}

const handleAddIllustrationError = (data, dispatch) => {
	dispatch(getallillustrationFailureActionCreator(data.message));
	return data.message;
}

const AddIllustration = (data) => dispatch => {
	dispatch(addillustrationRequestActionCreator());
	return horizonApiAxios.post('/illustration/add',data)
		.then((response) => { handleAddIllustrationSuccess(response.data, dispatch) })
		.catch(error => handleAddIllustrationError(error, dispatch));
};

export {
	// Export Actions
	getAllIllustration,
	AddIllustration
}