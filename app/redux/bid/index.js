/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";


/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	error: "",
	statuscode: 401


};


/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.ADD_BID_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.ADD_BID_SUCCESS:
			return {
				...state, requesting: false, statuscode: action?.data?.statusCode, error: action.data?.message
			};

		case TYPES.ADD_BID_FAILURE:
			return {
				...state, requesting: false, error: action?.data 
			};
		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const addbidRequestActionCreator = () => ({ type: TYPES.ADD_BID_REQUEST });
const addbidSuccessActionCreator = data => ({ type: TYPES.ADD_BID_SUCCESS, data });
const addbidFailureActionCreator = (data) => ({ type: TYPES.ADD_BID_FAILURE, data });

/* ------------ REDUX ACTIONS ------------ */

const handleAddBidSuccess = (data, dispatch) => {
	dispatch(addbidSuccessActionCreator(data));
	return data;
}

const handleAddBidError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(addbidFailureActionCreator(error.message));
	return error
}

const AddBid = (data) => dispatch => {
	dispatch(addbidRequestActionCreator());
	return horizonApiAxios.post('/bids', data)
		.then((response) => { handleAddBidSuccess(response, dispatch) })
		.catch(error => {handleAddBidError(error, dispatch)});
};

export {
	// Export Actions
	AddBid
}