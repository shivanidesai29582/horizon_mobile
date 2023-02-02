/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';

/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from './types';

/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
  requesting: false,
  trading_reels: [],
  reelDetails: {},
  userreels: [],
  reelCategory: [],
  savedreels: [],
};

/* ------------ REDUX REDUCER ------------ */

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.TRADING_REELS_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case TYPES.TRADING_REELS_SUCCESS:
      return {
        ...state,
        requesting: false,
        trading_reels: action.data,
      };

    case TYPES.TRADING_REELS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.data,
      };
    case TYPES.GET_REELS_BY_USER_ID_REQUEST:
      return {
        ...state,
        requesting: true,
      };
    case TYPES.EDIT_REELS_REQUEST:
      return {
        ...state, requesting: true
      };
    case TYPES.EDIT_REELS_REQUEST:
      return {
        ...state, requesting: false, trading_reels: action.data
      };
    case TYPES.EDIT_REELS_FAILURE:
      return {
        ...state, requesting: false
      };

    case TYPES.GET_REELS_BY_USER_ID_SUCCESS:
      return {
        ...state,
        requesting: false,
        userreels: action.data,
      };

    case TYPES.TRADING_REELS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.data,
      };

    case TYPES.GET_REEL_DETAILS_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case TYPES.GET_REEL_DETAILS_SUCCESS:
      return {
        ...state,
        requesting: false,
        reelDetails: action.data,
      };

    case TYPES.GET_REEL_DETAILS_FAIL:
      return {
        ...state,
        requesting: false,
        error: action.data,
      };
    case TYPES.GET_REELS_CATEGORY_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case TYPES.GET_REELS_CATEGORY_SUCCESS:
      return {
        ...state,
        requesting: false,
        reelCategory: action.data,
      };

    case TYPES.GET_REELS_CATEGORY_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.data,
      };
    case TYPES.GET_SAVED_REELS_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case TYPES.GET_SAVED_REELS_SUCCESS:
      return {
        ...state,
        requesting: false,
        savedreels: action.data,
      };

    case TYPES.GET_SAVED_REELS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.data,
      };
    default:
      return state;
  }
}

/* ------------ REDUX ACTION CREATORS ------------ */
const trandingReelsRequestActionCreator = () => ({ type: TYPES.TRADING_REELS_REQUEST, });
const trandingReelsSuccessActionCreator = data => ({ type: TYPES.TRADING_REELS_SUCCESS, data, });
const trandingReelsFailureActionCreator = message => ({ type: TYPES.TRADING_REELS_FAILURE, message, });

const editReelsRequestActionCreator = () => ({ type: TYPES.EDIT_REELS_REQUEST });
const editReelsSuccessActionCreator = data => ({ type: TYPES.EDIT_REELS_REQUEST, data });
const editReelsFailureActionCreator = (data) => ({ type: TYPES.EDIT_REELS_FAILURE, data });

const GetReelsByUserIdRequestActionCreator = () => ({ type: TYPES.GET_REELS_BY_USER_ID_REQUEST, });
const GetReelsByUserIdSuccessActionCreator = data => ({ type: TYPES.GET_REELS_BY_USER_ID_SUCCESS, data, });
const GetReelsByUserIdFailureActionCreator = message => ({ type: TYPES.GET_REELS_BY_USER_ID_FAILURE, message, });

const getReelDetailsRequest = () => ({ type: TYPES.GET_REEL_DETAILS_REQUEST, });
const getReelDetailsSuccess = data => ({ type: TYPES.GET_REEL_DETAILS_SUCCESS, data, });
const getReelDetailsFail = message => ({ type: TYPES.GET_REEL_DETAILS_FAIL, message, });

const GetReelCategoryRequestActionCreator = () => ({ type: TYPES.GET_REELS_CATEGORY_REQUEST, });
const GetReelCategorySuccessActionCreator = data => ({ type: TYPES.GET_REELS_CATEGORY_SUCCESS, data, });
const GetReelCategoryFailureActionCreator = message => ({ type: TYPES.GET_REELS_CATEGORY_FAILURE, message, });

const deleteReelRequestActionCreator = () => ({ type: TYPES.DELETE_REEL_REQUEST });
const deleteReelSuccessActionCreator = data => ({ type: TYPES.DELETE_REEL_SUCCESS, data });
const deleteReelFailureActionCreator = message => ({ type: TYPES.DELETE_REEL_FAILURE, message });

const getSavedReelsRequestActionCreator = () => ({ type: TYPES.GET_SAVED_REELS_REQUEST, });
const getSavedReelsSuccessActionCreator = data => ({ type: TYPES.GET_SAVED_REELS_SUCCESS, data, });
const getSavedReelsFailureActionCreator = message => ({ type: TYPES.GET_SAVED_REELS_FAILURE, message, });

/* ------------ REDUX ACTIONS ------------ */
const handleTrandingReelsSuccess = (data, dispatch) => {
  dispatch(trandingReelsSuccessActionCreator(data));
  return data;
};

const handleTrandingReelsError = (data, dispatch) => {
  const error =
    data.hasOwnProperty('response') && data.response != undefined
      ? data.response.data
      : data;
  dispatch(trandingReelsFailureActionCreator(error.message));
  return error;
};

const getTrandingReels = (pageNo = 1, FirstReel = 0) => (dispatch, getState) => {

  dispatch(trandingReelsRequestActionCreator());
  return horizonApiAxios
    .get(`/reels/getTrandingReels/${pageNo}/${FirstReel}`)
    .then(response => {

      if (pageNo == 1) {
        handleTrandingReelsSuccess(response.data, dispatch)
      }
      else {
        const olddata = getState().reels?.trading_reels;
        dispatch(handleTrandingReelsSuccess([...olddata, ...response.data], dispatch))
      }

      return response.data


    })
    .catch(error => handleTrandingReelsError(error, dispatch));
};

const handleGetReelsByUserIdSuccess = (data, dispatch) => {
  dispatch(GetReelsByUserIdSuccessActionCreator(data));
  return data;
};

const handleGetReelsByUserIdError = (data, dispatch) => {
  const error =
    data.hasOwnProperty('response') && data.response != undefined
      ? data.response.data
      : data;
  dispatch(GetReelsByUserIdFailureActionCreator(error.message));
  return error;
};

const getReelsByUserID = (id, PageNo, returnOnlyNewData) => (dispatch, getState) => {
  dispatch(GetReelsByUserIdRequestActionCreator());
  return horizonApiAxios
    .get(`/reels/getReelsByAuthorID/${id}/${PageNo}`)
    .then(response => {

      if (PageNo == 1) {
        handleGetReelsByUserIdSuccess(response.data, dispatch)
      }
      else {
        if (returnOnlyNewData) { }
        else {
          const olddata = getState().reels?.userreels;
          dispatch(handleGetReelsByUserIdSuccess([...olddata, ...response.data], dispatch))
        }
      }

      return response.data


    })
    .catch(error => handleGetReelsByUserIdError(error, dispatch));
};

const getReelDetails = (id) => dispatch => {
  dispatch(getReelDetailsRequest());
  return horizonApiAxios
    .get(`/reels/${id}`)
    .then(response => {
      dispatch(getReelDetailsSuccess(response?.data));
    })
    .catch(error => {
      dispatch(getReelDetailsFail());
    });
};

const addReel = (data) => dispatch => {

  return horizonApiAxios
    .post('/reels/create_reel', data)
    .then(response => {
    })
    .catch(error => {
    });
};

const editReel = (data, id) => dispatch => {

  return horizonApiAxios.put(`/reels/updatemetadata/${id}`, data)
    .then(response => {
    })
    .catch(error => {
    });
};

const handleReelsCategorySuccess = (data, dispatch) => {
  dispatch(GetReelCategorySuccessActionCreator(data));
  return data;
};

const handleReelsCategoryError = (data, dispatch) => {
  const error =
    data.hasOwnProperty('response') && data.response != undefined
      ? data.response.data
      : data;
  dispatch(GetReelCategoryFailureActionCreator(error.message));
  return error;
};

const getReelCategory = () => (dispatch, getState) => {

  dispatch(GetReelCategoryRequestActionCreator());
  return horizonApiAxios
    .get(`/reels/getLanguageAndCategory`)
    .then(response => {
      handleReelsCategorySuccess(response.data, dispatch)
      return response.data;
    })
    .catch(error => handleReelsCategoryError(error, dispatch));
};

const handleGetSavedReelsSuccess = (data, dispatch) => {
  dispatch(getSavedReelsSuccessActionCreator(data));
  return data;
};

const handleGetSavedReelsError = (data, dispatch) => {
  const error =
    data.hasOwnProperty('response') && data.response != undefined
      ? data.response.data
      : data;
  dispatch(getSavedReelsFailureActionCreator(error.message));
  return error;
};

const getSavedReels = (id, pageNo = 1) => (dispatch, getState) => {

  dispatch(getSavedReelsRequestActionCreator());
  return horizonApiAxios.get(`/content_collection/findByAuthorID/${id}/{type}/${pageNo}?type=reels`)
    .then(response => {

      if (pageNo == 1) {
        handleGetSavedReelsSuccess(response.data, dispatch)
      }
      else {
        const olddata = getState().reels?.savedreels;
        dispatch(handleGetSavedReelsSuccess([...olddata, ...response.data], dispatch))
      }

      return response.data


    })
    .catch(error => handleGetSavedReelsError(error, dispatch));
};

// Delete Reel
const handleDeleteReelSuccess = (data, dispatch) => {
  dispatch(deletereelSuccessActionCreator(data));
  return data;
}

const handleDeleteReelError = (data, dispatch) => {
  const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
  dispatch(deleteReelFailureActionCreator(error.message));
  return error;
}

const Deletereel = (id, state) => (dispatch, getState) => {
  dispatch(deleteReelRequestActionCreator());
  return horizonApiAxios.delete(`/reels/deletereels/${id}`)
    .then((response) => {
      if (state == 'tranding') // Tranding Reels
      {
        const olddata = getState().reels?.trading_reels;
        var newdata = olddata.filter(x => {
          return x.id != id;
        })
        dispatch(handleTrandingReelsSuccess([...newdata], dispatch))
      }
      else // User Reels (Profile Page)
      {
        const olddata = getState().reels?.userreels;
        var newdata = olddata.filter(x => {
          return x.id != id;
        })
        dispatch(handleGetReelsByUserIdSuccess([...newdata], dispatch))
      }
    })
    .catch(error => {
      return handleDeleteReelError(error, dispatch)
    });
};


// ---------------------- EDIT POST ------------------
const handleEditReelsSuccess = (data, dispatch) => {
  dispatch(editReelsSuccessActionCreator(data));
  return data;
}

const handleEditReelsError = (data, dispatch) => {
  const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
  dispatch(editReelsFailureActionCreator(error.message));
  return error;
}

const EditReel = (data, id) => dispatch => {
  dispatch(editReelsRequestActionCreator());
  return horizonApiAxios.put(`/posts/updatemetadata/${id}`, data)
    .then((response) => {
      return handleEditReelsSuccess(response.data, dispatch)
    })
    .catch(error => {
      return handleEditReelsError(error, dispatch)
    });
};

//-----------------------------------------------

export {
  // Export Actions
  getTrandingReels,
  addReel,
  getReelDetails,
  getReelsByUserID,
  getReelCategory,
  getSavedReels,
  Deletereel,
  EditReel,
  trandingReelsSuccessActionCreator
};
