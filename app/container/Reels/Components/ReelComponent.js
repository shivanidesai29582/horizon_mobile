import {Image, TouchableOpacity} from "react-native";
import React from 'react';

export default function ReelComponent({item,onPress}) {

    return (
        <TouchableOpacity onPress={onPress} style={{marginVertical:5,margin:5,flexDirection:'row',alignItems:'center'}}>
            <Image source={item} style={{width: 80, height: undefined, aspectRatio: 0.91,borderRadius:15}}/>
        </TouchableOpacity>
    )
}



