import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar, Platform } from 'react-native';
import Video from 'react-native-video';
import {
  wp,
} from '../../../common/ResponsiveScreen';
import { AppContext } from '../../../Context';
import ReelFooter from './ReelFooter';
import ReelHeader from './ReelHeader';
import VolumeButton from './VolumeButton';

const ReelItem = ({ item, isVisible, isFocus, isNext, index, navigation }) => {
  const { isMute } = useContext(AppContext);
  const videoRef = useRef(null);
  const [videoload, setvideoload] = useState(true);
  // const { videoOuter, videoView } = styles;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const screenHeight = Dimensions.get('screen').height;
  const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

  useEffect(() => {
    if (!isVisible && isNext && videoRef) {
      videoRef.current.seek(0);
    }
  }, [isVisible, isNext]);


  const videoError = error => {
    // Manage error here
  };
  return (
    <View
      style={{
        width: windowWidth,
        height: windowHeight - 50,
        // position: 'relative',
        // paddingBottom: (windowHeight * 20) / 100,
      }}>
      <Video
        ref={videoRef}
        fullscreenAutorotate={false}
        source={{ uri: item?.video_url }}
        poster={item?.thumbnail_url == null || item?.thumbnail_url === 'string' ? "https://horizonmobileapp.s3.ap-south-1.amazonaws.com/images/9Pkw_MF6Q.png" : item?.thumbnail_url}
        autoPlay={true}
        repeat={true}
        // onBuffer={console.log('buffering........', index)}
        // onLoad={console.log('******** onLoad........', item)}
        // bufferConfig={{
        //   minBufferMs: 100,
        //   maxBufferMs: 100,
        //   bufferForPlaybackMs: 100,
        //   bufferForPlaybackAfterRebufferMs: 100
        // }}
        // onLoadStart={console.log('onLoadStart........', index)}
        // onReadyForDisplay={console.log('onReadyForDisplay........', isVisible ? index : '')}
        // onProgress={(p) => { console.log('********* onProgress', p) }}
        onError={videoError}
        resizeMode={'cover'}
        posterResizeMode={'cover'}
        muted={(!isVisible && true) || isMute}
        style={{
          width: windowWidth,
          height: windowHeight,
        }}
        playInBackground={false}
        paused={!isVisible}
        ignoreSilentSwitch={'ignore'}
      />
      {/* <VolumeButton item={item} /> */}
      <ReelFooter item={item} navigation={navigation} />
      <ReelHeader item={item} navigation={navigation} />

    </View>
  );
};

const styles = StyleSheet.create({
  videoView: {
    width: wp(100),
    opacity: 1,
  },
  videoOuter: {
    width: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default React.memo(ReelItem);
