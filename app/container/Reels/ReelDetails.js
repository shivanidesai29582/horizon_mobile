import React, {useRef, useEffect, useState, useMemo} from 'react';
import {
  View,
  Dimensions,
  AppState,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getReelDetails} from '../../redux/reels';
import ReelItem from './Components/ReelItem';
import {useIsFocused} from '@react-navigation/native';
import {getLikes} from '../../redux/likes';

const ReelDetails = props => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const tradingReelsData = useSelector(state => state?.reels?.trading_reels);
  const likes = useSelector(state => state?.likes?.likes);
  const reelDetails = useSelector(state => state?.reels?.reelDetails);
  console.log("likes",likes);
  useEffect(() => {
    let { reelId } = props?.route?.params
    console.log("reelId",reelId);
    dispatch(getLikes(reelId));
    dispatch(getReelDetails(reelId));
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState.match(/inactive|background/)) {
        setIsReelsFocused(false);
      }
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setIsReelsFocused(true);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [isReelsFocused, setIsReelsFocused] = useState(false);

  const focus = useIsFocused();

  useMemo(() => {
    setIsReelsFocused(focus);
  }, [focus]);

  return (
    <View
      style={{
        width: windowWidth,
        height: Platform.OS === 'ios' ? windowHeight - 60 : windowHeight - 120,
        backgroundColor: 'black',
        // paddingTop: Platform.OS === 'android' ? 25 : 0
      }}>
      {reelDetails.id ? <ReelItem
        item={reelDetails}
        isNext={false}
        visible={true}
        isLiked={likes[reelDetails.id]}
        isVisible={isReelsFocused}
        navigation={props.navigation}
      /> : 
      <View style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={'white'} size={'large'}/>
      </View>}
    </View>
  );
};
export default ReelDetails;
