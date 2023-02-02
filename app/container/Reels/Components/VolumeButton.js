import React, { useContext, useState, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, DeviceEventEmitter } from 'react-native';
import { AppContext } from '../../../Context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function VolumeButton({ item }) {
  const { isMute, setIsMute } = useContext(AppContext);
  const [viewAnim] = useState(new Animated.Value(0));
  let lastTap = null;
  const timer = useRef(null);

  const onVolumePress = () => {

    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 350;

    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      clearTimeout(timer.current);
      DeviceEventEmitter.emit(`setDoubleTapToLike`, { item });
    } else {
      lastTap = now;
      timer.current = setTimeout(() => {
        setIsMute();
        Animated.timing(viewAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          fadeOut();
        });
      }, DOUBLE_PRESS_DELAY)
    }
  };

  const fadeOut = () => {
    Animated.timing(viewAnim, {
      delay: 500,
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onVolumePress}
      style={styles.touchArea}>
      <Animated.View
        style={[
          styles.muteBtn,
          {
            opacity: viewAnim,
          },
        ]}>
        <Ionicons
          name={isMute ? 'volume-mute' : 'md-volume-medium'}
          style={{ paddingHorizontal: 5 }}
          color={'#fff'}
          size={25}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchArea: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteBtn: {
    position: 'absolute',
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
