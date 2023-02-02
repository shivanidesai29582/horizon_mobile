import React from 'react';
import { Image, Dimensions } from 'react-native';
import Draggable from 'react-native-draggable';
import global from './../common/globals';
const { width, height } = Dimensions.get('window');
const ChatIcon = (props) => {

    return (<Draggable
            x={200}
            y={300}
            minY={50}
            maxY={height - 100}
        >
            <Image style={{ height: 45, width: 45, borderRadius: 30, borderWidth: 1, position: 'absolute' }} source={{ uri: global.USER_PROFILE_URL }} />
        </Draggable>);


}

export default ChatIcon;
