/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";


/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	error: "",
	futurevisits: [],
	lastaddedfurutevisit: ''


};


/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.FUTURE_VISITE_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.FUTURE_VISITE_SUCCESS:
			return {
				...state, requesting: false, futurevisits: action.data
			};

		case TYPES.FUTURE_VISITE_FAILURE:
			return {
				...state, requesting: false
			};
		case TYPES.ADD_FUTURE_VISITE_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.ADD_FUTURE_VISITE_SUCCESS:
			return {
				...state, requesting: false, lastaddedfurutevisit: action.data
			};

		case TYPES.ADD_FUTURE_VISITE_FAILURE:
			return {
				...state, requesting: false
			};

		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const getallfuturevisitsRequestActionCreator = () => ({ type: TYPES.FUTURE_VISITE_REQUEST });
const getallfuturevisitsSuccessActionCreator = data => ({ type: TYPES.FUTURE_VISITE_SUCCESS, data });
const getallfuturevisitsFailureActionCreator = (data) => ({ type: TYPES.FUTURE_VISITE_FAILURE, data });

const addfuturevisitsRequestActionCreator = () => ({ type: TYPES.ADD_FUTURE_VISITE_REQUEST });
const addfuturevisitsSuccessActionCreator = data => ({ type: TYPES.ADD_FUTURE_VISITE_SUCCESS, data });
const addfuturevisitsFailureActionCreator = (data) => ({ type: TYPES.ADD_FUTURE_VISITE_FAILURE, data });

/* ------------ REDUX ACTIONS ------------ */

const handleFutureVisitSuccess = (data, dispatch) => {
	dispatch(getallfuturevisitsSuccessActionCreator(data));
	return data;
}

const handleFutureVisitError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getallfuturevisitsFailureActionCreator(error.message));
	return error
}

const getAllFutureVisit = () => dispatch => {
	dispatch(getallfuturevisitsRequestActionCreator());
	return horizonApiAxios.get(`/future-visite/getAll`)
		.then((response) => { handleFutureVisitSuccess(response.data, dispatch) })
		.catch(error => handleFutureVisitError(error, dispatch));
};

const handleAddFutureVisitSuccess = (data, dispatch) => {
	dispatch(addfuturevisitsSuccessActionCreator(data));
	return data;
}

const handleAddFutureVisitError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(addfuturevisitsFailureActionCreator(error.message));
	return error
}

const AddFutureVisit = (data) => dispatch => {
	dispatch(addfuturevisitsRequestActionCreator());
	return horizonApiAxios.post('/future-visite/add', data)
		.then((response) => { handleAddFutureVisitSuccess(response.data, dispatch) })
		.catch(error => handleAddFutureVisitError(error, dispatch));
};

export {
	// Export Actions
	getAllFutureVisit,
	AddFutureVisit
}