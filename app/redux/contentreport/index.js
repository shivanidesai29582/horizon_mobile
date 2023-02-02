/* ------------ NETWORK ------------ */
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";
import { trandingReelsSuccessActionCreator } from "./../reels";
import { getTrendingPostSuccessActionCreator } from "./../post";



/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
  requesting: false,
  error: "",
  reportcategories: [],
};


/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
  switch (action.type) {

    case TYPES.GET_REPORT_CATEGORY_REQUEST:
      return {
        ...state, requesting: true
      };

    case TYPES.GET_REPORT_CATEGORY_SUCCESS:
      return {
        ...state, requesting: false, reportcategories: action.data
      };

    case TYPES.GET_REPORT_CATEGORY_FAILURE:
      return {
        ...state, requesting: false
      };


    default:
      return state
  }
}

/* ------------ REDUX ACTION CREATORS ------------ */
const getReportCategoryRequestActionCreator = () => ({ type: TYPES.GET_REPORT_CATEGORY_REQUEST });
const getReportCategorySuccessActionCreator = data => ({ type: TYPES.GET_REPORT_CATEGORY_SUCCESS, data });
const getReportCategoryFailureActionCreator = (data) => ({ type: TYPES.GET_REPORT_CATEGORY_FAILURE, data });


/* ------------ REDUX ACTIONS ------------ */

const handleReportCategorySuccess = (data, dispatch) => {
  dispatch(getReportCategorySuccessActionCreator(data));
  return data;
}

const handleReportCategoryError = (data, dispatch) => {
  const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
  dispatch(getReportCategoryFailureActionCreator(error.message));
  return error
}

const getReportCategory = () => (dispatch, getState) => {
  dispatch(getReportCategoryRequestActionCreator());
  return horizonApiAxios.get(`/content_report/getReportCategories`)
    .then((response) => {
      handleReportCategorySuccess(response.data, dispatch)

    })
    .catch(error => handleReportCategoryError(error, dispatch));
};

const AddReport = (id, type = 'reels', reportcategory = 'SPAM') => (dispatch, getState) => {
  //once report sucessfully then it's remove from redux store
  return horizonApiAxios
    .put(`/content_report/addDeletereport/${id}/{type}/{category}?type=${type}&category=${reportcategory}`)
    .then(response => {
      const olddata = type === 'reels' ? getState().reels?.trading_reels : getState().post?.posts;
      olddata?.splice(olddata.findIndex(a => a.id === id), 1);
      dispatch(type === 'reels' ? trandingReelsSuccessActionCreator(olddata) : getTrendingPostSuccessActionCreator(olddata))
      return response.data;
    })
    .catch(error => {
    });
};

export {
  // Export Actions
  getReportCategory,
  AddReport
}