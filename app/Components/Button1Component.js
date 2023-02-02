import React, { useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { Constants } from "../common";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';


export default function Button1Component({ children, extratextstyle, title, extraviewstyle, onPress, visible }) {
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
        <TouchableOpacity disabled={visible} onPress={onPress} style={[{ height: visible ? 50 : null, marginTop: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 20, backgroundColor: '#FFFC00', justifyContent: 'center', alignItems: "center", flexDirection: 'row', borderRadius: 30 }, extraviewstyle]}>
            {visible ? <View style={{ marginHorizontal: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                <Animated.View
                    style={[
                        { height: 30, width: 30, backgroundColor: 'transparent', borderRadius: 15, borderTopColor: '#000', borderLeftColor: '#000', borderRightColor: '#000', borderBottomColor: 'transparent', borderWidth: 3 },
                        reanimatedStyle,
                    ]}
                ></Animated.View>
                <Animated.View
                    style={[
                        { height: 16, width: 16, position: 'absolute', backgroundColor: 'transparent', borderRadius: 8, borderTopColor: '#000', borderLeftColor: '#000', borderRightColor: '#000', borderBottomColor: 'transparent', borderWidth: 3 },
                        revreanimatedStyle,
                    ]}
                ></Animated.View>
            </View> :
                <Text style={[{ fontFamily: Constants.fontFamilyMedium, marginHorizontal: 30, color: "#000", fontSize: 18 }, extratextstyle]}>
                    {title}
                </Text>
            }
        </TouchableOpacity>
    );

}