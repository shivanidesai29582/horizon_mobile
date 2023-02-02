import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';

export default function LoaderScreen(props) {
    const { visible } = props;
    const progress = useSharedValue(0);
    const duration = 80000;
    const reanimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: -((((progress.value) ? progress.value : 0) * 360)) + 'rad' }],
        };
    }, []);
    const revreanimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: ((((progress.value) ? progress.value : 0) * 360)) + 'rad' }],
        };
    }, []);

    useEffect(() => {
        // progress.value = withRepeat(withSpring(0, [{ restSpeedThreshold: 5 }]), -1, false);
        // progress.value = withRepeat(withTiming(1, { duration, easing: Easing.bezier(0.25, 0.1, 0.25, 1), }), -1, false);
        progress.value = withRepeat(withTiming(1, { duration, easing: Easing.bezier(0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1), }), -1, false);
    }, []);
    return (
        <>
            {
                visible && <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', zIndex: 1 }}>
                    <Animated.View
                        style={[
                            { height: 36, width: 36, backgroundColor: 'transparent', borderRadius: 18, borderTopColor: '#1da0f2', borderLeftColor: '#1da0f2', borderRightColor: '#1da0f2', borderBottomColor: 'transparent', borderWidth: 3 },
                            reanimatedStyle,
                        ]}
                    ></Animated.View>
                    <Animated.View
                        style={[
                            { height: 20, width: 20, position: 'absolute', backgroundColor: 'transparent', borderRadius: 15, borderTopColor: '#FFDF00', borderLeftColor: '#FFDF00', borderRightColor: '#FFDF00', borderBottomColor: 'transparent', borderWidth: 3 },
                            revreanimatedStyle,
                        ]}
                    ></Animated.View>
                </View>
            }
        </>
    )
}