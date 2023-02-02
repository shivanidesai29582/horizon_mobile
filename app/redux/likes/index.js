/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';

/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from './types';

/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
  likes: {},
};

/* ------------ REDUX REDUCER ------------ */

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.GET_LIKE_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case TYPES.GET_LIKE_SUCCESS:
      return {
        ...state,
        requesting: false,
        likes: { ...state.likes, ...action.data },
      };

    case TYPES.GET_LIKE_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.data,
      };

    case TYPES.SET_LIKE_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case TYPES.SET_LIKE_SUCCESS:
      return {
        ...state,
        requesting: false,
        likes: { ...state.likes, ...action.data },
      };

    case TYPES.SET_LIKE_FAILURE:
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
const getLikesRequest = () => ({
  type: TYPES.GET_LIKE_REQUEST,
});
const getLikesSuccess = data => ({
  type: TYPES.GET_LIKE_SUCCESS,
  data,
});
const getLikesFail = message => ({
  type: TYPES.GET_LIKE_FAILURE,
  message,
});

const setLikesRequest = () => ({
  type: TYPES.SET_LIKE_REQUEST,
});
const setLikesSuccess = data => ({
  type: TYPES.SET_LIKE_SUCCESS,
  data,
});
const setLikesFail = message => ({
  type: TYPES.SET_LIKE_FAILURE,
  message,
});

const getLikes = (id, type = 'reels') => dispatch => {
  dispatch(getLikesRequest());
  return horizonApiAxios
    .get(`/like/checkLike/${id}/{type}?type=${type}`)
    .then(response => {
      let likeObj = {}
      likeObj[id] = response?.data?.data
      dispatch(getLikesSuccess(likeObj))
    })
    .catch(error => {
      dispatch(getLikesFail(error))
    });
};

const setLikes = (id, type = 'reels') => (dispatch, getState) => {
  dispatch(setLikesRequest());
  let isLiked = getState().likes?.likes[id];
  return horizonApiAxios
    .put(`/like/addDeletelike/${id}/{type}?type=${type}`)
    .then(response => {
      let likeObj = {}
      likeObj[id] = !isLiked
      dispatch(setLikesSuccess(likeObj))
    })
    .catch(error => {
      dispatch(setLikesFail(error))
    });
};

export {
  // Export Actions
  getLikes,
  setLikes
};
