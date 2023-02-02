import React from 'react';
import {
    TouchableOpacity,
    Text,
} from 'react-native';
import Constants from "../common/Constants";
import { Color } from "../common";


export default function MyButtonComponent({ children, disable, extratextstyle, title, extraviewstyle, onPress }) {
    return (
        <TouchableOpacity disabled={disable} onPress={onPress} style={[{ paddingVertical: 5, borderRadius: 30, marginHorizontal: 10, backgroundColor: Color.secondary }, extraviewstyle]}>
            <Text style={[{ fontFamily: Constants.fontFamilyMedium, paddingVertical: 6, color: '#fff', alignSelf: 'center', paddingHorizontal: 15 }, extratextstyle]}>
                {title}
            </Text>
            {children}
        </TouchableOpacity>
    )

}

