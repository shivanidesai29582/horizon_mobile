/* ------------ NETWORK ------------ */
import axios from 'axios';

/* ------------ REDUX ACTION TYPES ------------ */
import * as TYPES from "./types";

import globals from "./../../common/globals"
import { get } from "./../../storage"
import { toast } from '../../Omni';

/* ------------ REDUX INITIAL STATE ------------ */
const initialState = {
	requesting: false,
	mediaData: [],
	mediaError: ""
};

/* ------------ REDUX REDUCER ------------ */
export default function reducer(state = initialState, action) {
	switch (action.type) {

		case TYPES.MEDIA_REQUEST:
			return {
				...state, requesting: true
			};

		case TYPES.MEDIA_SUCCESS:
			return {
				...state, requesting: false, mediaData: action.data
			};

		case TYPES.MEDIA_FAILURE:
			return {
				...state, requesting: false, mediaError: action.data
			};
		default:
			return state
	}
}

/* ------------ REDUX ACTION CREATORS ------------ */
const mediaRequestActionCreator = () => ({ type: TYPES.MEDIA_REQUEST });
const mediaSuccessActionCreator = data => ({ type: TYPES.MEDIA_SUCCESS, data });
const mediaFailureActionCreator = (data) => ({ type: TYPES.MEDIA_FAILURE, data });

/* ------------ REDUX ACTIONS ------------ */

const handleMediaSuccess = (data, dispatch) => {

	dispatch(mediaSuccessActionCreator(data));

	return data;
}

const handleMediaError = (data, navigation, dispatch) => {
	const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
	dispatch(mediaFailureActionCreator(error.message));
	return error;
}

const imageUpload = (fileurl) => async (dispatch) => {

	dispatch(mediaRequestActionCreator());

	let storageToken = await get('horizon_token');

	let formData = new FormData();

	formData.append("file", {
		uri: fileurl,
		type: 'image/jpeg',
		name: `dummy${Date.now()}.jpg`
	});


	return axios.post(`${globals.HORIZON_BASE_URL}/attachments`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
			'Authorization': `Bearer ${storageToken}`
		},

	}
	).then((response) => {
		handleMediaSuccess(response.data, dispatch)
	}).catch((error) => { handleMediaError(error, dispatch) })


};

const videoUpload = (metaData) => async (dispatch) => {

	dispatch(mediaRequestActionCreator());

	let storageToken = await get('horizon_token');
	let formData = new FormData();
	let { videoUri, title, description, duration } = metaData
	formData.append("attachment", {
		uri: videoUri,
		type: 'video/mp4',
		name: `r_${new Date().getTime()}.mp4`
	});
	formData.append("title", title);
	formData.append("description", description);
	formData.append("duration", duration);


	return new Promise(function (resolve, reject) {
		axios.post(`${globals.HORIZON_BASE_URL}/attachments/create_reels`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': `Bearer ${storageToken}`
			},
		}
		).then((response) => {
			resolve(response);
			toast('Reel shared successfully')
		}).catch((error) => {
			reject(error);
			if (error.data && error.data.message) {
				toast(error.data.message)
			}
			handleMediaError(error, dispatch)
		})
	});
};


export {
	// Export Actions
	imageUpload,
	videoUpload
}