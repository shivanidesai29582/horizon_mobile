import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import React from 'react';
import Constants from "../../../common/Constants";
import global from "./../../../common/globals";
import { useTheme } from './../../../Context';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

var width = Dimensions.get('window').width;

export default function AuctionItem({ item, onPress }) {
    const { theme } = useTheme();
    const author = item?.author;

    return (
        <TouchableOpacity onPress={onPress} style={{ borderRadius: 10, margin: 5, backgroundColor: theme.homeFlatListItemColor }}>
            <Image source={{ uri: item?.auctionImage == null ? global.COLLECTION_IMAGE_URL2 : item?.auctionImage }}
                style={{
                    height: item?.id % 2 === 0 ? 150 : 280,
                    borderRadius: 10,
                    alignSelf: 'stretch',
                }} />
            <View style={{ flexDirection: 'row', padding: 10, marginBottom: 5, width: '100%' }}>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{
                        color: theme.textColor,
                        fontFamily: Constants.fontFamilySemiBold,
                        includeFontPadding: false,
                        padding: 0,
                        fontSize: 12,
                        width: (width * 0.4)
                    }}>{item?.name}</Text>

                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 3 }}>
                            <Image source={{ uri: (author?.profile_photo === undefined || author?.profile_photo === null) ? global.USER_PROFILE_URL : author?.profile_photo }} style={{ width: 20, height: undefined, aspectRatio: 1.05, borderRadius: 35 }} />
                            <Text numberOfLines={1} style={{
                                color: theme.textColor,
                                fontFamily: Constants.fontFamilyRegular,
                                marginLeft: 10,
                                fontSize: 12,
                                width: (width * 0.24)
                            }}>{author?.username === null || undefined ? "unnamed" : author?.username}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            {/* <Text style={{
                                color: '#969598',
                                fontFamily: Constants.fontFamilyMedium,
                                marginLeft: 10,
                                fontSize: 7
                            }}>Current Bid</Text> */}
                            <FontAwesome5 name={'gavel'} color={theme.activeIcon} size={20} style={{
                                marginLeft: 5,
                                fontSize: 14,
                                marginTop: 2
                            }} />
                            <Text style={{
                                color: theme.textColor,
                                fontFamily: Constants.fontFamilyMedium,
                                marginLeft: 5,
                                fontSize: 14,
                                textAlign: 'center'
                            }}>{item?.highest_bid == null ? item?.start_bid : item?.highest_bid}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

