/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";


/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	error: "",
	chatList: [],

};


/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.CHAT_REQUEST:
			return {
				...state, requesting: true, chatList: []
			};

		case TYPES.CHAT_SUCCESS:
			return {
				...state, requesting: false, chatList: action.data?.data
			};

		case TYPES.CHAT_FAILURE:
			return {
				...state, requesting: false, chatList: []
			};

		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const getChatRequestActionCreator = () => ({ type: TYPES.CHAT_REQUEST });
const getChatSuccessActionCreator = data => ({ type: TYPES.CHAT_SUCCESS, data });
const getChatFailureActionCreator = (data) => ({ type: TYPES.CHAT_FAILURE, data });



/* ------------ REDUX ACTIONS ------------ */

const handleGetChatSuccess = (data, dispatch) => {
	dispatch(getChatSuccessActionCreator(data));
	return data;
}

const handleGetChatError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getChatFailureActionCreator(error.message));
	return error
}

const getChat = (id) => dispatch => {
	dispatch(getChatRequestActionCreator());
	return horizonApiAxios.get(`/getusers/${id}`)
		.then((response) => { return handleGetChatSuccess(response.data, dispatch) })
		.catch(error => handleGetChatError(error, dispatch));
};


export {
	// Export Actions
	getChat,
}