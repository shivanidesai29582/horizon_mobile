import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, Text, View, Image, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LottieView from 'lottie-react-native';
import LoginHeader from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import NoDataScreen from '../NoDataScreen';
import { getByIdPosts } from './../../redux/post'
import { useTheme } from './../../Context';
import { setLikes } from './../../redux/likes';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import Color from "../../common/Color";
import FastImage from 'react-native-fast-image';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PostDetailScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const lottieRef = useRef(null);
    const [postData, setpostData] = useState([]);
    console.log('postData', postData);
    const OnSend = (props?.route?.params?.item?.requestFrom === 'deepLink') ? () => { } : props?.route?.params?.item?.OnSend;
    const setIsLiked = (props?.route?.params?.item?.requestFrom === 'deepLink') ? () => { } : props?.route?.params?.item?.setIsLiked;
    const setLikeCount = (props?.route?.params?.item?.requestFrom === 'deepLink') ? () => { } : props?.route?.params?.item?.setLikeCount;
    const setCommentCount = (props?.route?.params?.item?.requestFrom === 'deepLink') ? () => { } : props?.route?.params?.item?.setCommentCount;
    const setSelectedItem = (props?.route?.params?.item?.requestFrom === 'deepLink') ? () => { } : props?.route?.params?.item?.setSelectedItem;
    const setIsTmpMoreModalVisible = props?.route?.params?.item?.setIsTmpMoreModalVisible;
    const [tmpisLiked, setTmpIsLiked] = useState(postData?.is_liked);
    const [tmplikeCount, setTmpLikeCount] = useState(postData?.likeCount);
    const [tmpCommentCount, setTmpCommentCount] = useState(postData?.total_comment);

    const manageIsLikedFlag = (flag) => {
        setTmpIsLiked(flag);
        setIsLiked(flag);
    }
    const manageIsLikedCount = (flag) => {
        setTmpLikeCount(flag);
        setLikeCount(flag);
    }
    const manageCommentCount = (count) => {
        setTmpCommentCount(count);
        setCommentCount(count);
    }

    useEffect(() => {
        dispatch(getByIdPosts({ id: props?.route?.params?.item?.id })).then((res) => {
            setpostData(res[0]);
            manageIsLikedFlag(res[0]?.is_liked)
            manageIsLikedCount(res[0]?.total_like)
            manageCommentCount(res[0]?.total_comment)
            // setTmpLikeCount(res[0]?.total_like)
        })
    }, [props?.route?.params?.item?.id]);

    const authorObj = { item: { id: postData?.authorId, profile_photo: postData?.author_profile_photo, username: postData?.author_username } };
    const imageWidh = windowWidth - 85;
    var imgHeight = 300;
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            {/* Header */}
            <LoginHeader onBackPress={() => { props.navigation.canGoBack() ? props.navigation.pop() : props.navigation.replace('HomeStack') }} />
            <View style={{ position: 'absolute', right: 0, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Entypo name={'dots-three-horizontal'} color={theme.activeIcon} size={20} onPress={() => {
                    setSelectedItem(postData);
                    setIsTmpMoreModalVisible(true)
                }} />
            </View>
            {
                (!postData || postData.length === 0) ?
                    <NoDataScreen isVisible={(!postData || postData.length === 0)} message="Looks like you dont't search anything yet." />
                    :
                    <>
                        {/* Image */}
                        <View style={{ justifyContent: "center", alignItems: "center", height: windowHeight - 240 }}>
                            {
                                postData?.file_type && postData?.file_type.includes("gif") ?
                                    <FastImage
                                        source={{
                                            uri: postData?.file_url
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                        style={{ width: windowWidth, height: '70%' }}
                                    />
                                    :
                                    <ImageZoom uri={postData?.file_url} style={{ width: windowWidth, height: imgHeight }} />
                            }
                        </View>

                        {/* Footer */}
                        <View style={{ position: 'absolute', bottom: 0, marginVertical: 10 }}>
                            <View style={{ flexDirection: 'row', width: windowWidth, marginBottom: 15, marginHorizontal: 25 }}>
                                <View style={{ width: (postData?.location) ? 10 : 0 }}>
                                    <FontAwesome name={(postData?.location) ? 'map-marker' : ''} color={Color.secondary} size={(postData?.location) ? 12 : 0} />
                                </View>
                                <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: (postData?.location) ? 12 : 0, lineHeight: (postData?.location) ? 15 : 0, color: Color.secondary, textTransform: 'capitalize' }}>
                                    {postData?.location}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: windowWidth, marginBottom: 15, marginHorizontal: 25 }}>
                                <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: (postData?.description) ? 15 : 0, lineHeight: (postData?.description) ? 17 : 0, color: theme.descriptiontextColor }}>
                                    {postData?.description}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: "space-evenly", width: windowWidth, marginBottom: 15 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => {
                                        manageIsLikedCount(tmpisLiked ? tmplikeCount - 1 : tmplikeCount + 1);
                                        manageIsLikedFlag(() => !tmpisLiked)
                                        dispatch(setLikes(postData?.id, 'posts'))
                                    }}><FontAwesome name={tmpisLiked ? "heart" : "heart-o"} color={tmpisLiked ? "#FF0000" : theme.activeIcon} size={20} /></TouchableOpacity>
                                    <Text style={{ paddingLeft: 5, color: theme.textColor }}>{tmplikeCount}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => { props.navigation.navigate('CommentsScreen', { postid: postData?.id, manageCommentCount, currentCnt: tmpCommentCount }) }}>
                                        <FontAwesome name={'comment-o'} color={theme.activeIcon} size={20} />
                                    </TouchableOpacity>
                                    <Text style={{ paddingLeft: 5, color: theme.textColor }}>{tmpCommentCount}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => { OnSend() }}>
                                        <Image style={{ height: 20, width: 20, alignItems: 'center', justifyContent: 'center', tintColor: theme.textColor, transform: ([{ rotateX: '0deg' }, { rotateZ: '40deg' }]) }} source={require('../../Images/send.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </>
            }
        </SafeAreaView>
    );
}

export default PostDetailScreen;
