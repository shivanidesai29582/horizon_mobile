import { TouchableOpacity, View } from "react-native";
import Color from "../../../common/Color";
import React from 'react';
import AntDesign from "react-native-vector-icons/AntDesign";

export default function ForwardBackButton({ selectedIndex, onBackPress, onForwardPress }) {

    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity disabled={selectedIndex == 0} onPress={onBackPress} style={{ backgroundColor: selectedIndex == 0 ? Color.secondary : Color.secondary, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, paddingVertical: 12, paddingHorizontal: 30, borderWidth: 2, borderLeftColor: Color.secondary, borderTopColor: Color.secondary, borderBottomColor: Color.secondary, borderRightColor: '#FFFFFF', borderRightWidth: 0.5 }}>
                <AntDesign name={'arrowleft'} color={'white'} size={20} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onForwardPress} style={{ backgroundColor: Color.secondary, borderBottomRightRadius: 10, borderTopRightRadius: 10, paddingVertical: 12, paddingHorizontal: 30, borderWidth: 2, borderLeftColor: '#ffffff', borderTopColor: Color.secondary, borderBottomColor: Color.secondary, borderRightColor: Color.secondary, borderLeftWidth: 0.5 }}>
                <AntDesign name={'arrowright'} color={'white'} size={20} />
            </TouchableOpacity>
        </View>
    )
}
