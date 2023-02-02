/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";


/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	error: "",
	posts: [],
	lastaddedtrendingpost: '',
	userposts: [],
	post: [],
	savedposts: [],

};


/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.POST_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.POST_SUCCESS:
			return {
				...state, requesting: false, posts: action.data
			};

		case TYPES.POST_FAILURE:
			return {
				...state, requesting: false
			};

		case TYPES.ADD_POST_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.ADD_POST_REQUEST:
			return {
				...state, requesting: false, lastaddedtrendingpost: action.data
			};

		case TYPES.ADD_POST_FAILURE:
			return {
				...state, requesting: false
			};
		case TYPES.EDIT_POST_REQUEST:
			return {
				...state, requesting: true
			};
		case TYPES.EDIT_POST_REQUEST:
			return {
				...state, requesting: false, lastaddedtrendingpost: action.data
			};
		case TYPES.EDIT_POST_FAILURE:
			return {
				...state, requesting: false
			};
		case TYPES.GET_POST_BY_USER_ID_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_POST_BY_USER_ID_SUCCESS:
			return {
				...state, requesting: false, userposts: action.data
			};

		case TYPES.GET_POST_BY_USER_ID_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.GET_POST_BY_ID_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_POST_BY_ID_SUCCESS:
			return {
				...state, requesting: false, post: action.data
			};

		case TYPES.GET_POST_BY_ID_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.GET_SAVED_POST_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.GET_SAVED_POST_SUCCESS:
			return {
				...state, requesting: false, savedposts: action.data
			};

		case TYPES.GET_SAVED_POST_FAILURE:
			return {
				...state, requesting: false
			};

		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const getTrendingPostRequestActionCreator = () => ({ type: TYPES.POST_REQUEST });
const getTrendingPostSuccessActionCreator = data => ({ type: TYPES.POST_SUCCESS, data });
const getTrendingPostFailureActionCreator = (data) => ({ type: TYPES.POST_FAILURE, data });

const addPostRequestActionCreator = () => ({ type: TYPES.ADD_POST_REQUEST });
const addPostSuccessActionCreator = data => ({ type: TYPES.ADD_POST_REQUEST, data });
const addPostFailureActionCreator = (data) => ({ type: TYPES.ADD_POST_FAILURE, data });

const editPostRequestActionCreator = () => ({ type: TYPES.EDIT_POST_REQUEST });
const editPostSuccessActionCreator = data => ({ type: TYPES.EDIT_POST_REQUEST, data });
const editPostFailureActionCreator = (data) => ({ type: TYPES.EDIT_POST_FAILURE, data });

const getpostsbyuseridRequestActionCreator = () => ({ type: TYPES.GET_POST_BY_USER_ID_REQUEST });
const getpostsbyuseridSuccessActionCreator = data => ({ type: TYPES.GET_POST_BY_USER_ID_SUCCESS, data });
const getpostsbyuseridFailureActionCreator = message => ({ type: TYPES.GET_POST_BY_USER_ID_FAILURE, message });

const getpostsbyidRequestActionCreator = () => ({ type: TYPES.GET_POST_BY_ID_REQUEST });
const getpostsbyidSuccessActionCreator = data => ({ type: TYPES.GET_POST_BY_ID_SUCCESS, data });
const getpostsbyidFailureActionCreator = message => ({ type: TYPES.GET_POST_BY_ID_FAILURE, message });

const deletepostRequestActionCreator = () => ({ type: TYPES.DELETE_POST_REQUEST });
const deletepostSuccessActionCreator = data => ({ type: TYPES.DELETE_POST_SUCCESS, data });
const deletepostFailureActionCreator = message => ({ type: TYPES.DELETE_POST_FAILURE, message });


const getsavedostsRequestActionCreator = () => ({ type: TYPES.GET_SAVED_POST_REQUEST });
const getsavedostsSuccessActionCreator = data => ({ type: TYPES.GET_SAVED_POST_SUCCESS, data });
const getsavedostsFailureActionCreator = message => ({ type: TYPES.GET_SAVED_POST_FAILURE, message });

/* ------------ REDUX ACTIONS ------------ */

const handlePostSuccess = (data, dispatch) => {
	dispatch(getTrendingPostSuccessActionCreator(data));
	return data;
}

const handlePostError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getTrendingPostFailureActionCreator(error.message));
	return error
}

const getTrendingtPost = (pageNo = 1) => (dispatch, getState) => {
	dispatch(getTrendingPostRequestActionCreator());
	return horizonApiAxios.get(`/posts/getTrandingPosts/${pageNo}`)
		.then((response) => {
			if (pageNo == 1) {
				handlePostSuccess(response.data, dispatch)
			}
			else {
				const olddata = getState().post?.posts;
				dispatch(handlePostSuccess([...olddata, ...response.data], dispatch))
			}
		})
		.catch(error => handlePostError(error, dispatch));
};

const handleAddPostSuccess = (data, dispatch) => {
	dispatch(addPostSuccessActionCreator(data));
	return data;
}

const handleAddPostError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(addPostFailureActionCreator(error.message));
	return error;
}

const AddPost = (data) => dispatch => {
	dispatch(addPostRequestActionCreator());
	return horizonApiAxios.post('/posts/create_post', data)
		.then((response) => {
			return handleAddPostSuccess(response.data, dispatch)
		})
		.catch(error => {
			return handleAddPostError(error, dispatch)
		});
};

/* ------------ REDUX ACTIONS ------------ */
const handleGetByUserIdPostsSuccess = (data, dispatch) => {
	dispatch(getpostsbyuseridSuccessActionCreator(data));
	return data;
}

const handleGetByUserIdPostsError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getpostsbyuseridFailureActionCreator(error.message));
	return error
}

const getByUserIdPosts = (id, PageNo) => (dispatch, getState) => {
	dispatch(getpostsbyuseridRequestActionCreator());

	return horizonApiAxios.get(`/posts/getPostsByAuthorID/${id}/${PageNo}`)
		.then((response) => {
			if (PageNo == 1) {
				handleGetByUserIdPostsSuccess(response.data, dispatch)
			}
			else {
				const olddata = getState().posts?.userposts;
				dispatch(handleGetByUserIdPostsSuccess([...olddata, ...response.data], dispatch))
			}
			return response.data
		})
		.catch(error => handleGetByUserIdPostsError(error, dispatch));
};

/* ------------ REDUX ACTIONS ------------ */
const handleGetByIdPostsSuccess = (data, dispatch) => {
	dispatch(getpostsbyidSuccessActionCreator(data));
	return data;
}

const handleGetByIdPostsError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getpostsbyidFailureActionCreator(error.message));
	return error
}

const getByIdPosts = ({ id }) => (dispatch, getState) => {
	dispatch(getpostsbyidRequestActionCreator());

	return horizonApiAxios.get(`/posts/${id}`)
		.then((response) => {
			handleGetByIdPostsSuccess(response.data, dispatch)
			return response.data
		})
		.catch(error => { handleGetByIdPostsError(error, dispatch) });
};

// Delete Post
const handleDeletePostSuccess = (data, dispatch) => {
	dispatch(deletepostSuccessActionCreator(data));
	return data;
}

const handleDeletePostError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(deletepostFailureActionCreator(error.message));
	return error;
}

const Deletepost = (id, state) => (dispatch, getState) => {
	dispatch(deletepostRequestActionCreator());
	return horizonApiAxios.delete(`/posts/deleteposts/${id}`)
		.then((response) => {
			if (state == 'tranding') // Tranding Posts
			{
				const olddata = getState().post?.posts;
				var newdata = olddata.filter(x => {
					return x.id != id;
				})
				dispatch(handlePostSuccess([...newdata], dispatch))
			}
			else // User Post (Profile Page)
			{
				const olddata = getState().post?.userposts;
				var newdata = olddata.filter(x => {
					return x.id != id;
				})
				dispatch(handleGetByUserIdPostsSuccess([...newdata], dispatch))
			}
			// return handleDeletePostSuccess(response.data, dispatch)
		})
		.catch(error => {
			return handleDeletePostError(error, dispatch)
		});
};

//-----------------------------------------------

const handleSavedPostSuccess = (data, dispatch) => {
	dispatch(getsavedostsSuccessActionCreator(data));
	return data;
}

const handleSavedPostError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(getsavedostsFailureActionCreator(error.message));
	return error
}

const getSavedPost = (id, pageNo = 1) => (dispatch, getState) => {

	dispatch(getsavedostsRequestActionCreator());
	return horizonApiAxios.get(`/content_collection/findByAuthorID/${id}/{type}/${pageNo}?type=posts`)
		.then((response) => {
			if (pageNo == 1) {
				handleSavedPostSuccess(response.data, dispatch)
			}
			else {
				const olddata = getState().post?.savedposts;
				dispatch(handleSavedPostSuccess([...olddata, ...response.data], dispatch))
			}
		})
		.catch(error => handleSavedPostError(error, dispatch));
};

// ---------------------- EDIT POST ------------------
const handleEditPostSuccess = (data, dispatch) => {
	dispatch(editPostSuccessActionCreator(data));
	return data;
}

const handleEditPostError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(editPostFailureActionCreator(error.message));
	return error;
}

const EditPost = (data, id) => dispatch => {
	dispatch(editPostRequestActionCreator());
	return horizonApiAxios.put(`/posts/updatemetadata/${id}`, data)
		.then((response) => {
			return handleEditPostSuccess(response.data, dispatch)
		})
		.catch(error => {
			return handleEditPostError(error, dispatch)
		});
};

export {
	// Export Actions
	getTrendingtPost,
	AddPost,
	getByUserIdPosts,
	getByIdPosts,
	Deletepost,
	getSavedPost,
	EditPost,
	getTrendingPostSuccessActionCreator
}