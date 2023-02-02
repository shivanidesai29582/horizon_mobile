import React, { useState } from 'react';
import { Image, SafeAreaView, Text, Dimensions, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from './../Context';
import Constants from "../common/Constants";
import NoDataScreen from './NoDataScreen';
import Color from '../common/Color';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const NoficationScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: theme.backgroundColor }}>
            {/* rendom notification data add NoDataScreen isVisible value add */}
            {/* <NoDataScreen isVisible={(!closeFriendsList || closeFriendsList.length === 0)} message="Looks like you did not add anyone as a close friend" /> */}
            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <Text style={{ fontSize: 22, lineHeight: 24, fontFamily: Constants.fontFamilyBold, color: theme.textColor }}>Nofications</Text>
            </View>
            <View style={{ marginVertical: 10, borderBottomWidth: 0.3, borderBottomColor: Color.placeHolderGrey }}>
                <Text style={{ fontSize: 18, lineHeight: 20, fontFamily: Constants.fontFamilyBold, color: theme.textColor, paddingBottom: 20, paddingLeft: 8 }}>Today</Text>
                {/* like/comment post/reel */}
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                    <View style={{ height: 50, width: 50 }}>
                        <Image source={require('../Images/reel2.png')} style={{ height: 50, width: 50, borderRadius: 25, }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, maxWidth: windowWidth - 120 }}>
                        <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>shivani_Desai
                            <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}> liked/comments your post/story/Nft/reels.</Text>
                        </Text>
                    </View>
                    <View style={{ flex: 1, height: 50, width: 50, alignItems: "flex-end" }}>
                        <Image source={require('../Images/reel2.png')} style={{ height: 50, width: 50 }} />
                    </View>
                </View>

                {/* follow request
            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <View style={{ height: 50, width: 50 }}>
                    <Image source={require('../Images/reel2.png')} style={{ height: 50, width: 50, borderRadius: 25, }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, justifyContent: 'space-between', paddingTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: windowWidth - 208 }}>
                        <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>shivani_Desai
                            <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}> request to follow you.</Text>
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ padding: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'black' }}>
                            <Text style={{ fontSize: 14, textAlign: 'center' }}>confirm</Text>
                        </View>
                        <View style={{ padding: 5, alignItems: 'center', justifyContent: 'center', marginLeft: 5, borderRadius: 10, borderWidth: 1, borderColor: 'black' }}>
                            <Text style={{ fontSize: 14, textAlign: 'center' }}>delete</Text>
                        </View>
                    </View>
                </View>
            </View> */}

                {/* close-friend request */}
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                    <View style={{ height: 50, width: 50 }}>
                        <Image source={require('../Images/reel2.png')} style={{ height: 50, width: 50, borderRadius: 25, }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, maxWidth: windowWidth - 80 }}>
                        <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>shivani_Desai
                            <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}> add you close friend list.</Text>
                        </Text>
                    </View>
                </View>

                {/* following/ */}
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                    <View style={{ height: 50, width: 50 }}>
                        <Image source={require('../Images/reel2.png')} style={{ height: 50, width: 50, borderRadius: 25, }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, justifyContent: 'space-between', paddingTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: windowWidth - 160 }}>
                            <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>shivani_Desai
                                <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}> started following you.</Text>
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ padding: 5, alignItems: 'center', justifyContent: 'center', marginLeft: 5, borderRadius: 10, borderWidth: 1, borderColor: theme.textColor }}>
                                <Text style={{ fontSize: 14, textAlign: 'center', color: theme.textColor }}>following</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ marginVertical: 10, borderBottomWidth: 0.3, borderBottomColor: Color.placeHolderGrey }}>
                <Text style={{ fontSize: 18, lineHeight: 20, fontFamily: Constants.fontFamilyBold, color: theme.textColor, paddingBottom: 20, paddingLeft: 8 }}>This Week</Text>
                {/* like/comment post/reel */}
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                    <View style={{ height: 50, width: 50 }}>
                        <Image source={require('../Images/reel2.png')} style={{ height: 50, width: 50, borderRadius: 25, }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, maxWidth: windowWidth - 120 }}>
                        <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>shivani_Desai
                            <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}> liked/comments your post/story/Nft/reels.</Text>
                            <Text style={{ fontSize: 14, lineHeight: 16, fontFamily: Constants.fontFamilyRegular, color: Color.placeHolderGrey }}>3w</Text>
                        </Text>
                    </View>
                    <View style={{ flex: 1, height: 50, width: 50, alignItems: "flex-end" }}>
                        <Image source={require('../Images/reel2.png')} style={{ height: 50, width: 50 }} />
                    </View>
                </View>
            </View>

            <View style={{ marginVertical: 10, borderBottomWidth: 0.3, borderBottomColor: Color.placeHolderGrey }}>
                <Text style={{ fontSize: 18, lineHeight: 20, fontFamily: Constants.fontFamilyBold, color: theme.textColor, paddingBottom: 20, paddingLeft: 8 }}>Last Week</Text>
                {/* like/comment post/reel */}
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                    <View style={{ height: 50, width: 50 }}>
                        <Image source={require('../Images/reel2.png')} style={{ height: 50, width: 50, borderRadius: 25, }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, maxWidth: windowWidth - 120 }}>
                        <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>shivani_Desai
                            <Text style={{ fontSize: 16, lineHeight: 18, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}> liked/comments your post/story/Nft/reels.</Text>
                        </Text>
                    </View>
                    <View style={{ flex: 1, height: 50, width: 50, alignItems: "flex-end" }}>
                        <Image source={require('../Images/reel2.png')} style={{ height: 50, width: 50 }} />
                    </View>
                </View>
            </View>
        </SafeAreaView >
    )
}

export default NoficationScreen;

