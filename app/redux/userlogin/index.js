/* ------------ NETWORK ------------ */
import axios from 'axios';
import horizonApiAxios from '../../services/restclient/horizonApiAxios';
/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";

import globals from "../../common/globals"

/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	userInfo: [],
	loginError: '',
	myFollowings: [],
	myFollowers: [],
	userProfileInfo: [],
	blockList: [],
	muteList: [],
	restrictList: [],
	closefriendslist: []

};

import { set } from '../../storage';

/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.LOGIN_REQUEST:
			return {
				requesting: true
			};

		case TYPES.LOGIN_SUCCESS:
			return {
				requesting: false, userInfo: action.data.user
			};

		case TYPES.LOGIN_FAILURE:
			return {
				...state, requesting: false, loginError: action.message
			};

		case TYPES.USER_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.USER_SUCCESS:
			return {
				...state, requesting: false, userProfileInfo: action.data.user
			};

		case TYPES.USER_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.USER_UPDATE_PREFERENCE_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.USER_UPDATE_PREFERENCE_SUCCESS:
			return {
				...state, requesting: false,
			};

		case TYPES.USER_UPDATE_PREFERENCE_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.USER_AUTH_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.USER_AUTH_SUCCESS:

			return {
				...state, requesting: false, userInfo: action.data
			};

		case TYPES.USER_AUTH_FAILURE:
			return {
				...state, requesting: false, loginError: action.message
			};


		case TYPES.USER_GET_FOLLOWING_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.USER_GET_FOLLOWING_SUCCESS:
			return {
				...state, requesting: false, myFollowings: action?.data?.blocks
			};

		case TYPES.USER_GET_FOLLOWING_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};


		case TYPES.USER_GET_FOLLOWERS_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.USER_GET_FOLLOWERS_SUCCESS:
			return {
				...state, requesting: false, myFollowers: action?.data?.blocks
			};

		case TYPES.USER_GET_FOLLOWERS_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.USER_GET_BLOCK_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.USER_GET_BLOCK_SUCCESS:
			return {
				...state, requesting: false, blockList: action?.data?.blocks
			};

		case TYPES.USER_GET_BLOCK_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.USER_GET_RESTRICT_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.USER_GET_RESTRICT_SUCCESS:
			return {
				...state, requesting: false, restrictList: action?.data?.blocks
			};

		case TYPES.USER_GET_RESTRICT_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.USER_GET_MUTE_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.USER_GET_MUTE_SUCCESS:
			return {
				...state, requesting: false, muteList: action?.data?.blocks
			};

		case TYPES.USER_GET_MUTE_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};

		case TYPES.USER_GET_CLOSED_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.USER_GET_CLOSED_SUCCESS:
			return {
				...state, requesting: false, closefriendslist: action?.data?.closes
			};

		case TYPES.USER_GET_CLOSED_FAILURE:
			return {
				...state, requesting: false, error: action.data
			};
		default:
			return state
	}
}



/* ------------ REDUX ACTION CREATORS ------------ */
const loginRequestActionCreator = () => ({ type: TYPES.LOGIN_REQUEST });
const loginSuccessActionCreator = data => ({ type: TYPES.LOGIN_SUCCESS, data });
const loginFailureActionCreator = message => ({ type: TYPES.LOGIN_FAILURE, message });

const userRequestActionCreator = () => ({ type: TYPES.USER_REQUEST });
const userSuccessActionCreator = data => ({ type: TYPES.USER_SUCCESS, data });
const userFailureActionCreator = message => ({ type: TYPES.USER_FAILURE, message });

const userupdatepreferenceRequestActionCreator = () => ({ type: TYPES.USER_UPDATE_PREFERENCE_REQUEST });
const userupdatepreferenceSuccessActionCreator = data => ({ type: TYPES.USER_UPDATE_PREFERENCE_SUCCESS, data });
const userupdatepreferenceFailureActionCreator = message => ({ type: TYPES.USER_UPDATE_PREFERENCE_FAILURE, message });

const userauthRequestActionCreator = () => ({ type: TYPES.USER_AUTH_REQUEST });
const userauthSuccessActionCreator = data => ({ type: TYPES.USER_AUTH_SUCCESS, data });
const userauthFailureActionCreator = message => ({ type: TYPES.USER_AUTH_FAILURE, message });

const userFollowingRequestActionCreator = () => ({ type: TYPES.USER_GET_FOLLOWING_REQUEST });
const userFollowingSuccessActionCreator = data => ({ type: TYPES.USER_GET_FOLLOWING_SUCCESS, data });
const userFollowingFailureActionCreator = message => ({ type: TYPES.USER_GET_FOLLOWING_FAILURE, message });

const userFollowerRequestActionCreator = () => ({ type: TYPES.USER_GET_FOLLOWERS_REQUEST });
const userFollowerSuccessActionCreator = data => ({ type: TYPES.USER_GET_FOLLOWERS_SUCCESS, data });
const userFollowerFailureActionCreator = message => ({ type: TYPES.USER_GET_FOLLOWERS_FAILURE, message });

const userBlockListRequestActionCreator = () => ({ type: TYPES.USER_GET_BLOCK_REQUEST });
const userBlockListSuccessActionCreator = data => ({ type: TYPES.USER_GET_BLOCK_SUCCESS, data });
const userBlockListFailureActionCreator = message => ({ type: TYPES.USER_GET_BLOCK_FAILURE, message });

const userRedtrictRequestActionCreator = () => ({ type: TYPES.USER_GET_RESTRICT_REQUEST });
const userRedtrictSuccessActionCreator = data => ({ type: TYPES.USER_GET_RESTRICT_SUCCESS, data });
const userRedtrictFailureActionCreator = message => ({ type: TYPES.USER_GET_RESTRICT_FAILURE, message });

const userMuteRequestActionCreator = () => ({ type: TYPES.USER_GET_MUTE_REQUEST });
const userMuteSuccessActionCreator = data => ({ type: TYPES.USER_GET_MUTE_SUCCESS, data });
const userMuteFailureActionCreator = message => ({ type: TYPES.USER_GET_MUTE_FAILURE, message });

const closeFriendsRequestActionCreator = () => ({ type: TYPES.USER_GET_CLOSED_REQUEST });
const closeFriendsSuccessActionCreator = data => ({ type: TYPES.USER_GET_CLOSED_SUCCESS, data });
const closeFriendsFailureActionCreator = message => ({ type: TYPES.USER_GET_CLOSED_FAILURE, message });

/* ------------ REDUX ACTIONS ------------ */


const handleUserAuthSuccess = (data, dispatch) => {

	set('userInfo', data);

	dispatch(userauthSuccessActionCreator(data));
	return data;
}

const handleUserAuthError = (error, dispatch) => {
	set('userInfo', '');
	dispatch(userauthFailureActionCreator(error?.response?.data?.message));
	return error;
}

const userAuth = () => dispatch => {

	dispatch(userauthRequestActionCreator());

	return horizonApiAxios.get(`/auth/me`)
		.then(response => handleUserAuthSuccess(response.data, dispatch))
		.catch(error => handleUserAuthError(error, dispatch));
};

const handleLoginSuccess = (data, navigateToPage, dispatch, credentials) => {

	set('horizon_token', data.token, true);
	set('userInfo', data.user);

	dispatch(loginSuccessActionCreator(data));

	if (navigateToPage != null) {
		Navigation.reset(navigateToPage);
	}

	return data;
}

const handleLoginError = (error, dispatch) => {


	dispatch(loginFailureActionCreator(error?.response?.data?.message));

	return error;
}

const login = (credentials, navigateToPage = null) => dispatch => {

	dispatch(loginRequestActionCreator());

	return axios.post(`${globals.HORIZON_BASE_URL}/auth/login`, credentials)
		.then(response => handleLoginSuccess(response.data, navigateToPage, dispatch, credentials))
		.catch(error => handleLoginError(error, dispatch));
};

const loginwithPhone = (credentials, navigateToPage = null) => dispatch => {

	dispatch(loginRequestActionCreator());

	return axios.post(`${globals.HORIZON_BASE_URL}/auth/loginwithmobile`, credentials)
		.then(response => handleLoginSuccess(response.data, navigateToPage, dispatch, credentials))
		.catch(error => handleLoginError(error, dispatch));
};

const handleUserSuccess = (data, dispatch) => {
	dispatch(userSuccessActionCreator(data));
	return data;
}

const handleUserError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(userFailureActionCreator(error.message));
	return error
}

const getByUserId = ({ id }) => dispatch => {

	dispatch(userRequestActionCreator());

	return horizonApiAxios.get(`/getUserById/${id}`)
		.then((response) => { handleUserSuccess(response.data, dispatch) })
		.catch(error => handleUserError(error, dispatch));
};

const handleUserUpdatePreferenceSuccess = (data, dispatch) => {
	dispatch(userupdatepreferenceSuccessActionCreator(data));
	userAuth();
	return data;
}

const handleUserUpdatePreferenceError = (data, dispatch) => {

	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;

	dispatch(userupdatepreferenceFailureActionCreator(error.message));
	return error;
}

const putUserPreference = (preference) => dispatch => {

	dispatch(userupdatepreferenceRequestActionCreator());

	return horizonApiAxios.put(`${globals.HORIZON_BASE_URL}/updateuser`, { preference: preference })
		.then(response => handleUserUpdatePreferenceSuccess(response.data, dispatch))
		.catch(error => handleUserUpdatePreferenceError(error, dispatch));
};

const putUserUpdate = (data) => dispatch => {
	dispatch(userupdatepreferenceRequestActionCreator());
	return horizonApiAxios.put(`${globals.HORIZON_BASE_URL}/updateuser`, data)
		.then(response => handleUserUpdatePreferenceSuccess(response.data, dispatch))
		.catch(error => handleUserUpdatePreferenceError(error, dispatch));
};

const handleUserFollowingSuccess = (data, dispatch) => {
	dispatch(userFollowingSuccessActionCreator(data));
	return data;
}

const handleUserFollowingError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(userFollowingFailureActionCreator(error.message));
	return error
}

const getMyFollowing = () => dispatch => {

	dispatch(userFollowingRequestActionCreator());

	return horizonApiAxios.get(`/follow/my-following`)
		.then((response) => { return handleUserFollowingSuccess(response.data, dispatch) })
		.catch(error => handleUserFollowingError(error, dispatch));
};

const handleUserFollowerSuccess = (data, dispatch) => {
	dispatch(userFollowerSuccessActionCreator(data));
	return data;
}

const handleUserFollowerError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(userFollowerFailureActionCreator(error.message));
	return error
}

const getMyFollower = () => dispatch => {

	dispatch(userFollowerRequestActionCreator());

	return horizonApiAxios.get(`/follow/my-followers`)
		.then((response) => { handleUserFollowerSuccess(response.data, dispatch) })
		.catch(error => handleUserFollowerError(error, dispatch));
};

const addFollow = (id) => dispatch => {
	return horizonApiAxios.post(`/follow`, id)
		.then((response) => {
			userAuth();
		})
		.catch((response) => {
		});
};

const removeFollow = (id) => dispatch => {
	return horizonApiAxios.post('follow/remove-following', id)
		.then((response) => {
			userAuth();
		})
		.catch((response) => {
		});
};

const handleUserBlocklistSuccess = (data, dispatch) => {
	dispatch(userBlockListSuccessActionCreator(data));
	return data;
}

const handleUserBlocklistError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(userBlockListFailureActionCreator(error.message));
	return error
}

const getBlockList = () => dispatch => {

	dispatch(userBlockListRequestActionCreator());

	return horizonApiAxios.get(`useropration/block`)
		.then((response) => { handleUserBlocklistSuccess(response.data, dispatch) })
		.catch(error => handleUserBlocklistError(error, dispatch));
};

const addBlock = (id) => dispatch => {
	return horizonApiAxios.post(`/useropration/block`, id)
		.then((response) => {
			userAuth();
		})
		.catch((response) => {
		});
};

const removeBlock = (id) => dispatch => {
	return horizonApiAxios.delete(`useropration/block/${id}`)
		.then((response) => {
			getBlockList();
		})
		.catch((response) => {
		});
};

const handleUserRestrictSuccess = (data, dispatch) => {
	dispatch(userRedtrictSuccessActionCreator(data));
	return data;
}

const handleUserRestrictError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(userRedtrictFailureActionCreator(error.message));
	return error
}

const getRestrictList = () => dispatch => {

	dispatch(userRedtrictRequestActionCreator());

	return horizonApiAxios.get(`useropration/restrict`)
		.then((response) => { handleUserRestrictSuccess(response.data, dispatch) })
		.catch(error => handleUserRestrictError(error, dispatch));
};

const addRestrict = (id) => dispatch => {
	return horizonApiAxios.post(`useropration/restrict`, id)
		.then((response) => {
			userAuth();
		})
		.catch((response) => {
		});
};

const removeRestrict = (id) => dispatch => {
	return horizonApiAxios.delete(`useropration/restrict/${id}`)
		.then((response) => {
			getRestrictList();
		})
		.catch((response) => {
		});
};

const handleUserMuteSuccess = (data, dispatch) => {
	dispatch(userMuteSuccessActionCreator(data));
	return data;
}

const handleUserMuteError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(userMuteFailureActionCreator(error.message));
	return error
}

const getMuteList = () => dispatch => {

	dispatch(userMuteRequestActionCreator());

	return horizonApiAxios.get(`useropration/mute`)
		.then((response) => { handleUserMuteSuccess(response.data, dispatch) })
		.catch(error => handleUserMuteError(error, dispatch));
};

const addMute = (id) => dispatch => {
	return horizonApiAxios.post(`useropration/mute`, id)
		.then((response) => {
			// userAuth();
		})
		.catch((response) => {
		});
};

const removeMute = (id) => dispatch => {
	return horizonApiAxios.delete(`useropration/mute/${id}`)
		.then((response) => {
			// getMuteList();
		})
		.catch((response) => {
		});
};


const handleCloseFriendsSuccess = (data, dispatch) => {
	dispatch(closeFriendsSuccessActionCreator(data));
	return data;
}

const handleCloseFriendsError = (data, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(closeFriendsFailureActionCreator(error.message));
	return error
}

const getMyCloseFriends = () => dispatch => {

	dispatch(closeFriendsRequestActionCreator());

	return horizonApiAxios.get(`/closefriend/closeFriendList`)
		.then((response) => { handleCloseFriendsSuccess(response.data, dispatch) })
		.catch(error => handleCloseFriendsError(error, dispatch));
};

const addCloseFriend = (id) => dispatch => {
	return horizonApiAxios.get(`/closefriend/addIntoCloseFriend/${id}`)
		.then((response) => {
			userAuth();
		})
		.catch((response) => {
		});
};

const removeCloseFriend = (id) => dispatch => {
	return horizonApiAxios.delete(`/closefriend/removeFromCloseFriend/${id}`)
		.then((response) => {
			userAuth();
		})
		.catch((response) => {
		});
};

const changePassword = (data) => dispatch => {
	dispatch(loginRequestActionCreator());
	return horizonApiAxios.post(`/auth/change-password`, data)
		.then(response => {
			// handleLoginSuccess(response.data);
			return response.data;
		})
		.catch(error => handleLoginError(error, dispatch));
};

const addReport = (data) => dispatch => {
	return horizonApiAxios.post(`/reportproblem/add`, data)
		.then((response) => {
		})
		.catch((response) => {
		});
};

const addFavCollection = (id, type) => dispatch => {
	return horizonApiAxios.put(`/content_collection/addDeletecollection/${id}/{type}?type=${type}`)
		.then((response) => {
		})
		.catch((response) => {
		});
};
export {
	// Export Actions
	login,
	loginwithPhone,
	getByUserId,
	putUserPreference,
	userAuth,
	putUserUpdate,
	addFollow,
	removeFollow,
	getMyFollowing,
	getMyFollower,
	getBlockList,
	addBlock,
	removeBlock,
	getRestrictList,
	addRestrict,
	removeRestrict,
	getMuteList,
	addMute,
	removeMute,
	getMyCloseFriends,
	addCloseFriend,
	removeCloseFriend,
	changePassword,
	addReport,
	addFavCollection
}