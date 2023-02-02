/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";

/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	auctions: [],
	trending_auctions: [],
	auction: [],
};


/* ------------ REDUX REDUCER ------------ */

export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.AUCTION_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.AUCTION_SUCCESS:
			return {
				...state, requesting: false, auctions: action.data
			};

		case TYPES.AUCTION_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.GET_AUCTION_BY_ID_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_AUCTION_BY_ID_SUCCESS:
			return {
				...state, requesting: false, auction: action.data
			};

		case TYPES.GET_AUCTION_BY_ID_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.TRENDING_AUCTION_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.TRENDING_AUCTION_SUCCESS:
			return {
				...state, requesting: false, trending_auctions: action.data
			};

		case TYPES.TRENDING_AUCTION_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.ADD_AUCTION_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.ADD_AUCTION_SUCCESS:
			return {
				...state, requesting: false, auction: action.data
			};

		case TYPES.ADD_AUCTION_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const addauctionRequestActionCreator = () => ({ type: TYPES.ADD_AUCTION_REQUEST });
const addauctionSuccessActionCreator = data => ({ type: TYPES.ADD_AUCTION_SUCCESS, data });
const addauctionFailureActionCreator = message => ({ type: TYPES.ADD_AUCTION_FAILURE, message });

const auctionRequestActionCreator = () => ({ type: TYPES.AUCTION_REQUEST });
const auctionSuccessActionCreator = data => ({ type: TYPES.AUCTION_SUCCESS, data });
const auctionFailureActionCreator = message => ({ type: TYPES.AUCTION_FAILURE, message });

const getauctionbyidRequestActionCreator = () => ({ type: TYPES.GET_AUCTION_BY_ID_REQUEST });
const getauctionbyidSuccessActionCreator = data => ({ type: TYPES.GET_AUCTION_BY_ID_SUCCESS, data });
const getauctionbyidFailureActionCreator = message => ({ type: TYPES.GET_AUCTION_BY_ID_FAILURE, message });

const trendingauctionRequestActionCreator = () => ({ type: TYPES.TRENDING_AUCTION_REQUEST });
const trendingauctionSuccessActionCreator = data => ({ type: TYPES.TRENDING_AUCTION_SUCCESS, data });
const trendingauctionFailureActionCreator = message => ({ type: TYPES.TRENDING_AUCTION_FAILURE, message });

/* ------------ REDUX ACTIONS ------------ */

const handleAddAuctionSuccess = (data, dispatch) => {
	dispatch(addauctionSuccessActionCreator(data));
	return data;
}

const handleAddAuctionError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(addauctionFailureActionCreator(error.message));
	return error;
}

const addAuction = (data) => dispatch => {
	dispatch(addauctionRequestActionCreator());

	return horizonApiAxios.post("/auctions", data)
		.then((response) => { handleAddAuctionSuccess(response.data, dispatch) })
		.catch(error => handleAddAuctionError(error, dispatch));
};



const handleAuctionSuccess = (data, dispatch) => {
	dispatch(auctionSuccessActionCreator(data));
	return data;
}

const handleAuctionError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(auctionFailureActionCreator(error.message));
	return error
}

const getAuction = () => dispatch => {

	dispatch(auctionRequestActionCreator());

	return horizonApiAxios.get("/auctions")
		.then((response) => { handleAuctionSuccess(response.data, dispatch) })
		.catch(error => handleAuctionError(error, dispatch));
};

const handleTrendingAuctionSuccess = (data, dispatch) => {
	dispatch(trendingauctionSuccessActionCreator(data));
	return data;
}

const handleTrendingAuctionError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(trendingauctionFailureActionCreator(error.message));
	return error
}

const getTrendingAuction = (startFrom = 0, recordSize = 10) => dispatch => {

	dispatch(trendingauctionRequestActionCreator());

	return horizonApiAxios.get(`/auctions/tranding?limit=${recordSize}`)
		.then((response) => { handleTrendingAuctionSuccess(response.data, dispatch) })
		.catch(error => handleTrendingAuctionError(error, dispatch));
};

const handleGetByIdAuctionError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getauctionbyidFailureActionCreator(error.message));
	return error
}

const handleGetByIdAuctionSuccess = (data, dispatch) => {
	dispatch(getauctionbyidSuccessActionCreator(data));
	return data;
}

const getByIdAuction = ({ id }) => dispatch => {

	dispatch(getauctionbyidRequestActionCreator());

	return horizonApiAxios.get(`/auctions/${id}`)
		.then((response) => { handleGetByIdAuctionSuccess(response.data, dispatch) })
		.catch(error => handleGetByIdAuctionError(error, dispatch));
};

export {
	// Export Actions
	getAuction,
	getByIdAuction,
	getTrendingAuction,
	addAuction
}