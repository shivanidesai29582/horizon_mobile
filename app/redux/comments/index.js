/* ------------ NETWORK ------------ */
import dayjs from 'dayjs';
import horizonApiAxios from '../../services/restclient/horizonApiAxios';
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from './types';

/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
  comments: [],
};

/* ------------ REDUX REDUCER ------------ */

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.GET_COMMENTS_REQUEST:
    case TYPES.POST_COMMENTS_REQUEST:
      return {
        ...state,
        requesting: true,
      };

    case TYPES.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        requesting: false,
        comments: action.data,
      };

    case TYPES.GET_COMMENTS_FAILURE:
    case TYPES.POST_COMMENTS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.data,
      };

    case TYPES.POST_COMMENTS_SUCCESS:
      return {
        ...state,
        requesting: false,
      };

    default:
      return state;
  }
}

/* ------------ REDUX ACTION CREATORS ------------ */
const getCommentsRequest = () => ({
  type: TYPES.GET_COMMENTS_REQUEST,
});
const getCommentsSuccess = data => ({
  type: TYPES.GET_COMMENTS_SUCCESS,
  data,
});
const getCommentsFail = message => ({
  type: TYPES.GET_COMMENTS_FAILURE,
  message,
});

const postCommentRequest = () => ({
  type: TYPES.POST_COMMENTS_REQUEST,
});
const postCommentSuccess = data => ({
  type: TYPES.POST_COMMENTS_SUCCESS,
  data,
});
const postCommentFailure = message => ({
  type: TYPES.POST_COMMENTS_FAILURE,
  message,
});

const getComments = (id, type = 'reels') => (dispatch, getState) => {
  dispatch(getCommentsRequest());

  return horizonApiAxios
    .get(`/comment/getComment/${id}?type=${type}`)
    .then(response => {
      dispatch(getCommentsSuccess(response?.data?.data))
    })
    .catch(error => {
      dispatch(getCommentsFail(error))
    });
};

const postComment = (data, type = 'reels') => (dispatch, getState) => {
  dispatch(postCommentRequest());
  return horizonApiAxios
    .put(`/comment/addComment?type=${type}`, data)
    .then(response => {
      let user = getState().userlogin?.userInfo
      let comments = getState().comments?.comments || []

      let commentObj = {
        author: { id: user?.id, username: user?.username, profile_photo: user?.profile_photo },
        comment: data.comment,
        created_at: dayjs().utc().format(),
        id: `comment_${new Date().getTime()}`,
        type: "reels",
        type_id: data.reelId,
        updated_at: null
      }

      dispatch(getCommentsSuccess([commentObj, ...comments]))
      // dispatch(postCommentSuccess(response?.data?.data))
      // dispatch(getComments(data.type_id));
    })
    .catch(error => {
      dispatch(postCommentFailure(error))
    });
};


export {
  // Export Actions
  getComments,
  postComment
};
