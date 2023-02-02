/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";

/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	nfts: [],
	trending_nfts: [],
	view_nfts: [],
	nft: [],
	usernfts: [],
	savednfts: [],

};


/* ------------ REDUX REDUCER ------------ */

export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.NFTS_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.NFTS_SUCCESS:
			return {
				...state, requesting: false, nfts: action.data
			};

		case TYPES.NFTS_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.GET_NFTS_BY_ID_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_NFTS_BY_ID_SUCCESS:
			return {
				...state, requesting: false, nft: action.data
			};

		case TYPES.GET_NFTS_BY_ID_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};
		case TYPES.GET_NFTS_BY_USER_ID_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_NFTS_BY_USER_ID_SUCCESS:
			return {
				...state, requesting: false, usernfts: action.data
			};

		case TYPES.GET_NFTS_BY_USER_ID_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.TRENDING_NFTS_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.TRENDING_NFTS_SUCCESS:
			return {
				...state, requesting: false, trending_nfts: action.data
			};

		case TYPES.TRENDING_NFTS_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};
		case TYPES.VIEW_NFTS_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.VIEW_NFTS_SUCCESS:
			return {
				...state, requesting: false, view_nfts: action.data
			};

		case TYPES.VIEW_NFTS_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.GET_SAVED_NFTS_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_SAVED_NFTS_SUCCESS:
			return {
				...state, requesting: false, savednfts: action.data
			};

		case TYPES.GET_SAVED_NFTS_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const nftsRequestActionCreator = () => ({ type: TYPES.NFTS_REQUEST });
const nftsSuccessActionCreator = data => ({ type: TYPES.NFTS_SUCCESS, data });
const nftsFailureActionCreator = message => ({ type: TYPES.NFTS_FAILURE, message });

const getnftsbyidRequestActionCreator = () => ({ type: TYPES.GET_NFTS_BY_ID_REQUEST });
const getnftsbyidSuccessActionCreator = data => ({ type: TYPES.GET_NFTS_BY_ID_SUCCESS, data });
const getnftsbyidFailureActionCreator = message => ({ type: TYPES.GET_NFTS_BY_ID_FAILURE, message });

const getnftsbyuseridRequestActionCreator = () => ({ type: TYPES.GET_NFTS_BY_USER_ID_REQUEST });
const getnftsbyuseridSuccessActionCreator = data => ({ type: TYPES.GET_NFTS_BY_USER_ID_SUCCESS, data });
const getnftsbyuseridFailureActionCreator = message => ({ type: TYPES.GET_NFTS_BY_USER_ID_FAILURE, message });

const trendingnftsRequestActionCreator = () => ({ type: TYPES.TRENDING_NFTS_REQUEST });
const trendingnftsSuccessActionCreator = data => ({ type: TYPES.TRENDING_NFTS_SUCCESS, data });
const trendingnftsFailureActionCreator = message => ({ type: TYPES.TRENDING_NFTS_FAILURE, message });

const viewnftsRequestActionCreator = () => ({ type: TYPES.VIEW_NFTS_REQUEST });
const viewnftsSuccessActionCreator = data => ({ type: TYPES.VIEW_NFTS_SUCCESS, data });
const viewnftsFailureActionCreator = message => ({ type: TYPES.VIEW_NFTS_FAILURE, message });

const getsavednftsRequestActionCreator = () => ({ type: TYPES.GET_SAVED_NFTS_REQUEST });
const getsavednftsSuccessActionCreator = data => ({ type: TYPES.GET_SAVED_NFTS_SUCCESS, data });
const getsavednftsFailureActionCreator = message => ({ type: TYPES.GET_SAVED_NFTS_FAILURE, message });

/* ------------ REDUX ACTIONS ------------ */
const handleNftsSuccess = (data, dispatch) => {
	dispatch(nftsSuccessActionCreator(data));
	return data;
}

const handleNftsError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(nftsFailureActionCreator(error.message));
	return error
}

const getNfts = (startFrom = 0, recordSize = 10) => dispatch => {

	dispatch(nftsRequestActionCreator());

	return horizonApiAxios.get(`/nfts?limit=${recordSize}`)
		.then((response) => { handleNftsSuccess(response.data, dispatch) })
		.catch(error => handleNftsError(error, dispatch));
};


const handleTrendingNftsSuccess = (data, dispatch) => {
	dispatch(trendingnftsSuccessActionCreator(data));
	return data;
}

const handleTrendingNftsError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(trendingnftsFailureActionCreator(error.message));
	return error
}

const getTrendingNfts = (startFrom = 0, recordSize = 10) => dispatch => {

	dispatch(trendingnftsRequestActionCreator());

	return horizonApiAxios.get(`/nfts/tranding?limit=${recordSize}`)
		.then((response) => { handleTrendingNftsSuccess(response.data, dispatch) })
		.catch(error => handleTrendingNftsError(error, dispatch));
};

// Add View Nft Details
const handleViewNftsSuccess = (data, dispatch) => {
	dispatch(viewnftsSuccessActionCreator(data));
	return data;
}

const handleViewNftsError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(viewnftsFailureActionCreator(error.message));
	return error
}

const addViewNfts = ({ id }) => dispatch => {

	dispatch(viewnftsRequestActionCreator());

	return horizonApiAxios
		.put(`/view/addview/${id}/{type}?type=nfts`)
		.then((response) => { handleViewNftsSuccess(response.data, dispatch) })
		.catch(error => handleViewNftsError(error, dispatch));
};
//------------------------------


const handleGetByIdNftsError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getnftsbyidFailureActionCreator(error.message));
	return error
}

const handleGetByIdNftsSuccess = (data, dispatch) => {
	dispatch(getnftsbyidSuccessActionCreator(data));
	return data;
}

const getByIdNfts = ({ id }) => dispatch => {

	dispatch(getnftsbyidRequestActionCreator());

	return horizonApiAxios.get(`/nfts/${id}`)
		.then((response) => { handleGetByIdNftsSuccess(response.data, dispatch) })
		.catch(error => handleGetByIdNftsError(error, dispatch));
};

const handleGetByUserIdNftsError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getnftsbyuseridFailureActionCreator(error.message));
	return error
}

const handleGetByUserIdNftsSuccess = (data, dispatch) => {
	dispatch(getnftsbyuseridSuccessActionCreator(data));
	return data;
}

const getByUserIdNfts = (id, PageNo) => (dispatch, getState) => {

	dispatch(getnftsbyuseridRequestActionCreator());

	return horizonApiAxios.get(`/nfts/findByAuthorID/${id}/${PageNo}`)
		.then((response) => {
			if (PageNo == 1) {
				handleGetByUserIdNftsSuccess(response.data, dispatch)
			}
			else {
				const olddata = getState().nft?.usernfts;
				dispatch(handleGetByUserIdNftsSuccess([...olddata, ...response.data], dispatch))
			}
		})
		.catch(error => handleGetByUserIdNftsError(error, dispatch));
};

const handleGetSavedNftsError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getsavednftsFailureActionCreator(error.message));
	return error
}

const handleGetSavedNftsSuccess = (data, dispatch) => {
	dispatch(getsavednftsSuccessActionCreator(data));
	return data;
}

const getSavedNfts = (id, pageNo = 1) => (dispatch, getState) => {

	dispatch(getsavednftsRequestActionCreator());

	return horizonApiAxios.get(`/content_collection/findByAuthorID/${id}/{type}/${pageNo}?type=nfts`)
		.then((response) => {
			if (pageNo == 1) {
				handleGetSavedNftsSuccess(response.data, dispatch)
			}
			else {
				const olddata = getState().nft?.usernfts;
				dispatch(handleGetSavedNftsSuccess([...olddata, ...response.data], dispatch))
			}
		})
		.catch(error => handleGetSavedNftsError(error, dispatch));
};

export {
	// Export Actions
	getNfts,
	getByIdNfts,
	getTrendingNfts,
	getByUserIdNfts,
	addViewNfts,
	getSavedNfts
}