import { Text, TouchableOpacity, View } from "react-native";
import React from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from "../../common/Constants";
import { useTheme } from './../../Context';

export default function LoginHeader({ onBackPress }) {
    const { theme } = useTheme();

    return (
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, width: '100%' }}>
            <TouchableOpacity onPress={onBackPress} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: theme.activeIcon, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={'md-chevron-back'} color={theme.activeIcon} size={20} />
            </TouchableOpacity>

        </View>
    )
}

export function Header({ onBackPress, title, isShownSearch = true, isShownBack = true, colors }) {
    const { theme } = useTheme();

    return (
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10 }}>
            {isShownBack ? <TouchableOpacity onPress={onBackPress} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: theme.textColor, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={'md-chevron-back'} color={colors ? colors : theme.activeIcon} size={20} />
            </TouchableOpacity> : null}

            <Text style={{ color: colors ? colors : theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 22, flex: 1, textAlign: 'center', alignSelf: 'center' }}>{title}</Text>
            {isShownSearch ? <TouchableOpacity style={{ height: 30, width: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={'search'} color={theme.activeIcon} size={20} />
            </TouchableOpacity> : <View style={{ width: 30 }} />}
        </View>
    )
}
