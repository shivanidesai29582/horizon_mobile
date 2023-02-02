/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';

/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";

/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	collections: [],
	trending_collections: [],
	collection: [],
	userCollection: []

};

/* ------------ REDUX REDUCER ------------ */

export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.COLLECTION_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.COLLECTION_SUCCESS:
			return {
				...state, requesting: false, collections: action.data
			};

		case TYPES.COLLECTION_FAILURE:

			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.TRENDING_COLLECTION_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.TRENDING_COLLECTION_SUCCESS:
			return {
				...state, requesting: false, trending_collections: action.data
			};

		case TYPES.TRENDING_COLLECTION_FAILURE:

			return {
				...state, requesting: false, error: action.data
			};
		case TYPES.GET_COLLECTION_BY_ID_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_COLLECTION_BY_ID_SUCCESS:
			return {
				...state, requesting: false, collection: action.data
			};

		case TYPES.GET_COLLECTION_BY_ID_FAILURE:

			return {
				...state, requesting: false, error: action.data
			};
		case TYPES.GET_COLLECTION_BY_USER_ID_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_COLLECTION_BY_USER_ID_SUCCESS:
			return {
				...state, requesting: false, userCollection: action.data
			};

		case TYPES.GET_COLLECTION_BY_USER_ID_FAILURE:

			return {
				...state, requesting: false, error: action.data
			};

		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const collectionRequestActionCreator = () => ({ type: TYPES.COLLECTION_REQUEST });
const collectionSuccessActionCreator = data => ({ type: TYPES.COLLECTION_SUCCESS, data });
const collectionFailureActionCreator = message => ({ type: TYPES.COLLECTION_FAILURE, message });

const getcollectionbyidRequestActionCreator = () => ({ type: TYPES.GET_COLLECTION_BY_ID_REQUEST });
const getcollectionbyidSuccessActionCreator = data => ({ type: TYPES.GET_COLLECTION_BY_ID_SUCCESS, data });
const getcollectionbyidFailureActionCreator = message => ({ type: TYPES.GET_COLLECTION_BY_ID_FAILURE, message });

const getcollectionbyUserIdRequestActionCreator = () => ({ type: TYPES.GET_COLLECTION_BY_USER_ID_REQUEST });
const getcollectionbyUserIdSuccessActionCreator = data => ({ type: TYPES.GET_COLLECTION_BY_USER_ID_SUCCESS, data });
const getcollectionbyUserIdFailureActionCreator = message => ({ type: TYPES.GET_COLLECTION_BY_USER_ID_FAILURE, message });

const tredingcollectionRequestActionCreator = () => ({ type: TYPES.TRENDING_COLLECTION_REQUEST });
const tredingcollectionSuccessActionCreator = data => ({ type: TYPES.TRENDING_COLLECTION_SUCCESS, data });
const tredingcollectionFailureActionCreator = message => ({ type: TYPES.TRENDING_COLLECTION_FAILURE, message });

/* ------------ REDUX ACTIONS ------------ */

const handleGetCollectionByIdSuccess = (data, dispatch) => {

	dispatch(getcollectionbyidSuccessActionCreator(data));
	return data;
}

const handleGetCollectionByIdError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getcollectionbyidFailureActionCreator(error.message));
	return error
}

const getCollectionById = (data) => dispatch => {
	dispatch(getcollectionbyidRequestActionCreator());
	return horizonApiAxios.get(`/collection/${data?.id}`)
		.then(response => handleGetCollectionByIdSuccess(response.data, dispatch))
		.catch(error => handleGetCollectionByIdError(error, dispatch));
};

const handleGetCollectionByUserIdSuccess = (data, dispatch) => {

	dispatch(getcollectionbyUserIdSuccessActionCreator(data));
	return data;
}

const handleGetCollectionByUserIdError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getcollectionbyUserIdFailureActionCreator(error.message));
	return error
}

const getCollectionByUserId = (id, PageNo) => (dispatch, getState) => {
	dispatch(getcollectionbyUserIdRequestActionCreator());
	return horizonApiAxios.get(`/collection/findByAuthorID/${id}/${PageNo}`)
		.then(response => {
			if (PageNo == 1) {
				handleGetCollectionByUserIdSuccess(response.data, dispatch)
			}
			else {
				const olddata = getState().collection?.userCollection;
				dispatch(handleGetCollectionByUserIdSuccess([...olddata, ...response.data], dispatch))
			}
		})
		.catch(error => handleGetCollectionByUserIdError(error, dispatch));
};


const handleCollectionSuccess = (data, dispatch) => {

	dispatch(collectionSuccessActionCreator(data));
	return data;
}

const handleCollectionError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(collectionFailureActionCreator(error.message));
	return error
}

const getCollection = () => dispatch => {

	dispatch(collectionRequestActionCreator());

	return horizonApiAxios.get("/collection")
		.then(response => handleCollectionSuccess(response.data, dispatch))
		.catch(error => handleCollectionError(error, dispatch));
};


const handleTredingCollectionSuccess = (data, dispatch) => {

	dispatch(tredingcollectionSuccessActionCreator(data));
	return data;
}

const handleTredingCollectionError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(tredingcollectionFailureActionCreator(error.message));
	return error
}

const getTrendingCollection = (startFrom = 0, recordSize = 10) => dispatch => {

	dispatch(tredingcollectionRequestActionCreator());

	return horizonApiAxios.get(`/collection/tranding?limit=${recordSize}`)
		.then(response => handleTredingCollectionSuccess(response.data, dispatch))
		.catch(error => handleTredingCollectionError(error, dispatch));
};


export {
	// Export Actions
	getCollection,
	getTrendingCollection,
	getCollectionById,
	getCollectionByUserId
}