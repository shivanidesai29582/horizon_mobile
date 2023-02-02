import { combineReducers } from 'redux';

import registration from './registration'
import userlogin from './userlogin'
import auction from './auction'
import collection from './collection'
import nft from './nft'
import storie from './storie'
import futurevisit from './futurevisit'
import illustration from './illustration'
import mediaupload from './mediaupload'
import reels from './reels';
import likes from './likes';
import comments from './comments';
import bid from './bid';
import search from './search';
import chat from './chat';
import post from './post';
import location from './location';
import contentreport from './contentreport';

const appReducer = combineReducers({
  registration,
  userlogin,
  auction,
  collection,
  nft,
  storie,
  futurevisit,
  illustration,
  mediaupload,
  reels,
  bid,
  search,
  chat,
  likes,
  comments,
  location,
  post,
  contentreport
});

export default (state, action) => {
  return appReducer(state, action);
};
