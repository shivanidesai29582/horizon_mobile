import { Image, Text, View } from "react-native";
import React from 'react';
import Constants from "../../../common/Constants";
import global from "./../../../common/globals"
import { useTheme } from './../../../Context';

export default function BidItem({ item }) {
    const { theme } = useTheme();


    return (
        <View style={{ borderRadius: 10, borderWidth: 1, borderColor: theme.borderColor, marginVertical: 5, padding: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: item?.created_user_photo == null ? global.USER_PROFILE_URL : item?.created_user_photo }}
                style={{ width: 30, height: 30, aspectRatio: 1, borderRadius: 15 }} />
            <Text numberOfLines={1} style={{
                color: theme.textColor,
                flex: 1,
                fontFamily: Constants.fontFamilyMedium,
                includeFontPadding: false,
                paddingHorizontal: 10,
                fontSize: 14
            }}>{item?.created_by}</Text>

            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../../Images/fectoricon.png')}
                        style={{ width: 30, height: 30, aspectRatio: 1 }} />
                    <Text numberOfLines={1} style={{
                        color: theme.textColor,
                        fontFamily: Constants.fontFamilyBold,
                        includeFontPadding: false,
                        fontSize: 16
                    }}>{item?.cryptoType}</Text>
                </View>
                <Text numberOfLines={1} style={{
                    color: '#B9B8BC',
                    fontFamily: Constants.fontFamilyMedium,
                    includeFontPadding: false,
                    padding: 0,
                    paddingHorizontal: 10,
                    fontSize: 12
                }}>{item?.cryptoCost == null ? 0 : item?.cryptoCost}</Text>
            </View>
        </View>
    )
}



