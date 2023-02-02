import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    FlatList,
    Dimensions,
    DeviceEventEmitter,
    Animated,
    StyleSheet,
    Switch
} from 'react-native';
import Modal from "react-native-modal";
import ButtonComponent from "../../Components/ButtonComponent";
import LoaderScreen from "../../Components/LoaderScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Constants from "../../common/Constants";
import Color from "../../common/Color";
import { get } from '../../storage';
import { useDispatch, useSelector } from 'react-redux';
import global from "./../../common/globals";
import { putUserUpdate, getMyFollowing, getByUserId, addFollow, removeFollow, userAuth, addRestrict, addBlock, addMute, removeBlock, removeRestrict, removeMute, addCloseFriend, removeCloseFriend, getMyCloseFriends, getRestrictList, getMuteList } from './../../redux/userlogin';
import { getCollectionByUserId } from './../../redux/collection';
import { getByUserIdNfts } from './../../redux/nft';
import { getReelsByUserID } from './../../redux/reels';
import { getByUserIdPosts } from './../../redux/post';
import PagerView from 'react-native-pager-view';
import ImagePickerDialog from '../../Components/ImagePickerDialog';
import PostMenu from '../../Components/PostMenu';
import ShareModal from '../../Components/ShareModal';
import axios from 'axios';
import { useTheme } from './../../Context';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';
import NoDataScreen from './../NoDataScreen';

const { width } = Dimensions.get("window");
const windowWidth = Dimensions.get('window').width;
const { event, ValueXY } = Animated;


const ProfileComponent = (props) => {
    const { theme } = useTheme();
    const { user, requestFrom } = props;
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const timer = useRef(null);
    const scrollY = new ValueXY();
    const [requesting, setrequesting] = useState(true);
    const [startFrom, setstartFrom] = useState(1);

    //Post
    const [selectedItem, setSelectedItem] = useState([]);
    const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
    const [isSendModalVisible, setIsSendModalVisible] = useState(false);

    const [parallaxHeight, setParallaxHeight] = useState(400);
    const [loading, setLoading] = useState(false);
    const [isProfile, setIsProfile] = useState(true);

    // Manage User settings
    const [isFollowing, setIsFollowing] = useState(false);
    const [isCloseFriends, setIsCloseFriends] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isMute, setIsMute] = useState(false);
    const [isRestrict, setIsRestrict] = useState(false);

    // Manage Modals
    const [modalVisible, setModalVisible] = useState(false);
    const [storyModalVisible, setStoryModalVisible] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [userSettingmodalVisible, setUserSettingModalVisible] = useState(false);
    const [storyImagePosition, setStoryImagePosition] = useState(0);


    useEffect(() => {
        dispatch(userAuth());
        if (requestFrom === 'UserProfile') {
            setLoading(true);
            dispatch(getMyCloseFriends());
            dispatch(getRestrictList());
            dispatch(getMuteList());
            dispatch(getByUserId({ id: user?.id })).then(() => { setLoading(false) });
        }
    }, [isFocused, useFocusEffect]);

    useEffect(() => {
        const GetPaginationData = async () => {
            await dispatch(getByUserIdPosts(user?.id, startFrom));
            await dispatch(getCollectionByUserId(user?.id, startFrom));
            await dispatch(getByUserIdNfts(user?.id, startFrom));
            await dispatch(getReelsByUserID(user?.id, startFrom));
            await setrequesting(false);
        };
        GetPaginationData();
    }, [user, startFrom]);


    useEffect(() => {
        DeviceEventEmitter.addListener('setProfileStack', () => {
            onRefresh();
        });
    }, [1])


    const PostsArray = useSelector((state) => state?.post?.userposts);
    const NFTArray = useSelector((state) => state?.nft?.usernfts);
    const ReelsArray = useSelector((state) => state?.reels?.userreels);
    const CollectionArray = useSelector((state) => state?.collection?.userCollection);
    const myFollowingsList = useSelector((state) => state?.userlogin?.myFollowings);
    const AllstoriesArray = user?.stories;

    const iFlashstoriesArray = AllstoriesArray?.filter((ele) => ele?.status === 'Saved');
    const iArchivedstoriesArray = AllstoriesArray?.filter((ele) => ele?.status !== 'Active');
    const activeArrayLength = AllstoriesArray?.filter((ele) => ele?.status === 'Active')?.length;

    const profileImage = { uri: user?.profile_photo == null ? global.USER_PROFILE_URL : user?.profile_photo };
    let currentLoggeduser = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const currentLogedUserID = currentLoggeduser?.id;
    const posts = (user?.postCount && user?.postCount !== null) ? user?.postCount : 0;
    const followers = user?.total_followers === null ? 0 : user?.total_followers;
    const following = user?.total_following === null ? 0 : user?.total_following;
    const name = user?.first_name === null ? "unnamed" : `${user?.first_name}`;
    const username = user?.username === null ? "unnamed" : user?.username;
    const description = user?.professional_summery;
    const coverImage = { uri: user?.cover_photo == null ? global.COLLECTION_IMAGE_URL1 : user?.cover_photo };

    //follower/following user setting
    let closeFriendsList = useSelector((state) => state?.userlogin?.closefriendslist);
    let muteList = useSelector((state) => state?.userlogin?.muteList);
    let restrictList = useSelector((state) => state?.userlogin?.restrictList);

    useEffect(() => {
        setIsFollowing(myFollowingsList?.findIndex((ele) => ele?.id === user?.id) > -1 ? true : false);
        setIsFollowing(currentLogedUserID?.following?.findIndex((ele) => ele?.id === user?.id) > -1 ? true : false);
        setIsCloseFriends(closeFriendsList?.findIndex((ele) => ele?.id === user?.id) > -1 ? true : false);
        setIsMute(muteList?.findIndex((ele) => ele?.id === user?.id) > -1 ? true : false);
        setIsRestrict(restrictList?.findIndex((ele) => ele?.id === user?.id) > -1 ? true : false);
    }, [user, currentLogedUserID]);

    const onEndReached = () => {
        setrequesting(true);
        setstartFrom(startFrom + 1);
    };

    const OpenStoryModel = (index) => {

        setStoryImagePosition(index);
        setStoryModalVisible(true);
    }

    const OpenModel = (value) => {
        setIsProfile(value);
        setModalVisible(true);
    }

    const onImageUpload = async (photouri) => {
        setLoading(true);
        let storageToken = await get('horizon_token');

        let formData = new FormData();

        formData.append("file", {
            uri: photouri,
            type: 'image/jpeg',
            name: `dummy${Date.now()}.jpg`
        });

        axios.post(`${global.HORIZON_BASE_URL}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${storageToken}`
            },
        }
        ).then((response) => {
            const data = isProfile ? { profile_photo: `${response?.data?.image}` } : { cover_photo: `${response?.data?.image}` }
            dispatch(putUserUpdate(data)).then(() => {
                setModalVisible(false);
                dispatch(userAuth()).then(() => {
                    setLoading(false);

                })

            })
        }).catch((error) => {
            setModalVisible(false);
            setLoading(false);

        })

    }

    const onImageRemove = async () => {
        const data = isProfile ? { profile_photo: null } : { cover_photo: null }
        dispatch(putUserUpdate(data)).then(() => {
            setModalVisible(false);
            dispatch(userAuth())
        })
    }

    //User Settings for follower/Following
    const OnFollow = () => {
        dispatch(addFollow({ id: `${user?.id}` }))
        setIsFollowing(true);
    }

    const OnUnFollow = () => {
        dispatch(removeFollow({ id: user?.id }))
        setIsFollowing(false);
        setModalVisible(false);
    }

    const OnAddCloseFriend = () => {
        dispatch(addCloseFriend(`${user?.id}`))
        setIsCloseFriends(true);
    }

    const OnRemoveCloseFriend = () => {
        dispatch(removeCloseFriend(user?.id))
        setIsCloseFriends(false);
    }

    const toggleMute = () => {
        isMute ? OnRemoveMute() : OnAddMute();
        setIsMute(previousState => !previousState);
    }

    const toggleRestrict = () => {
        isRestrict ? OnRemoveRestrict() : OnAddRestrict();
        setIsRestrict(previousState => !previousState);
    }

    const OnAddMute = () => {
        dispatch(addMute({ muted_user_id: `${user?.id}` }))
    }

    const OnAddRestrict = () => {
        dispatch(addRestrict({ restricted_user_id: `${user?.id}` }))
    }

    const OnRemoveMute = () => {
        dispatch(removeMute(user?.id))
    }

    const OnRemoveRestrict = () => {
        dispatch(removeRestrict(user?.id))
    }

    const OnAddBlock = () => {
        dispatch(addBlock({ blocked_user_id: `${user?.id}` })).then(() => {
            setIsBlocked(true);
            OnUnFollow();
            toast(`${username}` + " Blocked")
        })
    }

    const OnRemoveBlock = () => {
        dispatch(removeBlock(user?.id)).then(() => {
            setIsBlocked(false);
            setIsFollowing(false);
            toast(`${username}` + " Unblocked")
        })
    }
    //---------------------------------------------------------------

    const onRefresh = useCallback(() => {
        dispatch(userAuth());
    }, []);

    const onLayout = (e) => {
        setParallaxHeight(e.nativeEvent.layout.height);
    }

    const setHeaderSize = () => null;

    const renderHeader = () => (
        <View />
    );

    const renderForeground = () => {
        const [startTitleFade, finishTitleFade] = [450, 455];

        const titleOpacity = scrollY.y.interpolate({
            inputRange: [0, startTitleFade, finishTitleFade],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        return (<Animated.View style={{ opacity: titleOpacity }} onLayout={onLayout}>
            <View style={{}}>

                <TouchableOpacity onPress={() => { (user?.id === currentLogedUserID) ? OpenModel(false) : () => { } }}>
                    <ImageBackground source={coverImage} style={{ width: '100%', height: undefined, aspectRatio: 3.50 }}>
                        <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>

                            {/* Back Button */}
                            {(requestFrom === 'UserProfile') &&
                                <TouchableOpacity onPress={() => { props.navigation.pop() }} style={{ height: 30, width: 30, borderRadius: 18, borderWidth: 1, borderColor: theme.textColor, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}>
                                    <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />
                                </TouchableOpacity>
                            }
                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 18, flex: 1, paddingLeft: 17 }}>{username}</Text>
                            {(user?.id === currentLogedUserID) &&
                                <TouchableOpacity style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.8} onPress={() => { setSettingsModalVisible(true) }}>
                                    <View style={{ height: 35, width: 35, borderRadius: 35, backgroundColor: 'rgba(242, 242, 242, 0.3);', justifyContent: 'center', alignItems: 'center' }} >
                                        <Image source={require('../../Images/ic_menu.png')} style={{
                                            height: 25, width: 25, tintColor: 'white', transform: [
                                                { scaleX: -1 }
                                            ]
                                        }} tintColor={theme.textColor} />
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
                <View style={{ marginHorizontal: 20 }}>
                    {ProfileTopComponent()}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: windowWidth - 40, marginBottom: 5 }}>
                            <View style={{ width: '50%' }}>
                                <Text style={{ fontSize: 16, color: theme.textColor, fontFamily: Constants.fontFamilyMedium, width: windowWidth - 145 }} numberOfLines={1}>{name}</Text>
                                <Text style={{ fontSize: 14, color: theme.textColor, fontFamily: Constants.fontFamilyRegular, width: windowWidth - 145 }}>{description}</Text>
                            </View>
                            {/* Edit Profile button */}
                            {user?.id === currentLogedUserID &&
                                <ButtonComponent onPress={() => { props.navigation.navigate('EditProfile') }} extraviewstyle={{ height: 40, backgroundColor: Color.secondary, borderRadius: 40, marginBottom: 10 }} extratextstyle={{ paddingVertical: 5 }} title={"Edit Profile"} />
                            }

                            {/* user follow button */}
                            {user?.id !== currentLogedUserID &&
                                <View style={{ right: 0, flexDirection: 'row', justifyContent: 'flex-end' }}>

                                    {isBlocked ?
                                        <TouchableOpacity onPress={() => { OnRemoveBlock() }} style={[{ width: 120, justifyContent: 'center', borderRadius: 10, borderColor: theme.textColor, paddingVertical: 2, height: 30, borderWidth: 1 }]}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                <Text style={[{ fontFamily: Constants.fontFamilySemiBold, color: theme.textColor, alignSelf: 'center', fontSize: 16 }]}>Unblock</Text>
                                            </View>
                                        </TouchableOpacity>
                                        : isFollowing ?

                                            <TouchableOpacity onPress={() => { setUserSettingModalVisible(true) }} style={[{ width: 130, justifyContent: 'center', borderRadius: 40, borderColor: theme.textColor, paddingVertical: 2, paddingHorizontal: 5, height: 35, borderWidth: 1 }]}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10 }}>
                                                    <Text style={[{ fontFamily: Constants.fontFamilySemiBold, color: theme.textColor, alignSelf: 'center', fontSize: 16 }]}>Following</Text>
                                                    <Ionicons name={'md-chevron-down'} color={theme.textColor} size={25} style={{ marginLeft: 4 }} />
                                                </View>
                                            </TouchableOpacity>

                                            :

                                            <TouchableOpacity onPress={() => { OnFollow(true) }} style={[{ width: 120, justifyContent: 'center', borderRadius: 40, backgroundColor: Color.secondary, marginVertical: 2, paddingVertical: 7 }]}>

                                                <Text style={[{ fontFamily: Constants.fontFamilySemiBold, color: 'white', alignSelf: 'center', fontSize: 16 }]}>Follow</Text>

                                            </TouchableOpacity>}
                                    {isFollowing ? <TouchableOpacity onPress={() => { props.navigation.navigate('MessagingStack', { screen: 'IndividualMessage', params: { item: props?.route?.params?.item } }) }} style={{ height: 30, width: 45, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={require('./../../Images/message.png')} style={{ resizeMode: 'contain', height: 30, width: 30, tintColor: theme.textColor }} />
                                    </TouchableOpacity> : null}
                                </View>
                            }
                        </View>
                    </View>


                    {/* Story */}

                    {AllstoriesArray?.length !== 0 ? <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>

                        <TouchableOpacity style={{ height: 60, width: 60, justifyContent: 'center' }} onPress={() => { props.navigation.navigate('IFlashStoriesAddScreen', { iArchivedstoriesArray }) }} >

                            <Image source={require('../../Images/ic_story1.png')} style={{ resizeMode: 'contain', alignSelf: 'center', height: 50, width: 50, tintColor: theme.textColor }} />

                            <Text style={{ alignSelf: 'center', fontSize: 12, marginTop: 4, color: theme.textColor, fontFamily: Constants.fontFamilyRegular }}>i flash</Text>

                        </TouchableOpacity>

                        <FlatList
                            horizontal={true}
                            data={iFlashstoriesArray}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (

                                    <TouchableOpacity style={{ justifyContent: 'center', marginHorizontal: 5 }} onPress={() => { OpenStoryModel(index) }}>

                                        <View style={{ height: 50, width: 50, borderRadius: 100, borderWidth: 0.5, borderColor: theme.borderColor, justifyContent: 'center', alignSelf: 'center' }}>
                                            <Image source={{ uri: (item?.image_url === "undefined" || item?.image_url === "null") ? global.COLLECTION_IMAGE_URL2 : item?.image_url }} style={{ height: 45, width: 45, borderRadius: 100, alignSelf: "center" }} />
                                        </View>

                                        <Text numberOfLines={1} style={{ fontSize: 12, color: theme.textColor, fontFamily: Constants.fontFamilyRegular, marginTop: 4, alignSelf: 'center' }}>

                                            {item?.caption.length < 8
                                                ? `${item?.caption}`
                                                : `${item?.caption.substring(0, 8)}...`}
                                        </Text>

                                    </TouchableOpacity>

                                )
                            }} />


                    </View> : null}


                </View>

            </View>
        </Animated.View >)

    }

    const renderItem = ({ image }) => {
        return (
            <View>
                <Image source={image} style={{ alignSelf: 'center', resizeMode: 'contain', height: 20, width: 20, tintColor: theme.textColor }} />
            </View>
        )
    };

    const OnPostSend = () => {
        dispatch(getMyFollowing()).then(() => {
            setIsSendModalVisible(true);
        });
    }

    const PostComponent = () => {

        return (
            <>
                {(!PostsArray || PostsArray.length === 0)
                    ?
                    <View style={{ marginTop: -250 }}>
                        <NoDataScreen isVisible={(!PostsArray || PostsArray.length === 0)} message="Looks like you dont't have any Post." />
                    </View>
                    :
                    <FlatList
                        horizontal={false}
                        numColumns={2}
                        data={PostsArray}
                        scrollEnabled={false}
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            const isLiked = item?.isLiked ? item?.isLiked : item?.is_liked;
                            const likeCount = item?.likeCount ? item?.likeCount : item?.total_like;

                            item.isLiked = isLiked;
                            item.setIsLiked = () => { };
                            item.likeCount = likeCount;
                            item.setLikeCount = () => { };
                            item.OnSend = OnPostSend;
                            item.setCommentCount = () => { };
                            item.setSelectedItem = setSelectedItem;
                            item.setIsTmpMoreModalVisible = setIsMoreModalVisible;
                            return (
                                <TouchableOpacity onPress={() => { props.navigation.navigate('PostDetailScreen', { item: item }) }} >
                                    <Image style={{ height: (windowWidth / 2), width: (windowWidth / 2) - 4, margin: 2 }} source={{ uri: item?.file_url == null ? global.COLLECTION_IMAGE_URL2 : item?.file_url }} />
                                </TouchableOpacity>
                            )
                        }}
                    />
                }
            </>
        );
    };

    const NFTComponent = () => {

        return (
            <>
                {(!NFTArray || NFTArray.length === 0)
                    ?
                    <View style={{ marginTop: -250 }}>
                        <NoDataScreen isVisible={(!NFTArray || NFTArray.length === 0)} message="Looks like you dont't have any NFT." />
                    </View>
                    :
                    <FlatList
                        horizontal={false}
                        numColumns={2}
                        data={NFTArray}
                        scrollEnabled={false}
                        scrollEventThrottle={1}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => { props.navigation.navigate('NFTDetailScreen', { item }) }}>
                                    <Image style={{ height: (windowWidth / 2), width: (windowWidth / 2) - 4, margin: 2 }} source={{ uri: item?.image_url == null ? global.COLLECTION_IMAGE_URL2 : item?.image_url }} onPress={() => { props.navigation.navigate('NFTDetailScreen', { item }) }} />
                                </TouchableOpacity>
                            )
                        }} />
                }
            </>
        );
    };

    const ReelsComponent = () => {
        return (
            <>
                {(!ReelsArray || ReelsArray.length === 0)
                    ?
                    <View style={{ marginTop: -250 }}>
                        <NoDataScreen isVisible={(!ReelsArray || ReelsArray.length === 0)} message="Looks like you dont't have any reels." />
                    </View>
                    :
                    <FlatList
                        horizontal={false}
                        numColumns={2}
                        data={ReelsArray}
                        scrollEnabled={false}
                        scrollEventThrottle={1}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => { props.navigation.navigate('ProfileReelScreen', { item: { from: 'profile', page: startFrom, currentIndex: index } }) }}>
                                    <Image resizeMode='cover' style={{ height: 400, width: (width / 2) - 4, margin: 2 }} source={{ uri: (item?.thumbnail_url === "" || item?.thumbnail_url == null) ? global.COLLECTION_IMAGE_URL2 : item?.thumbnail_url }} />
                                </TouchableOpacity>
                            )
                        }} />
                }
            </>
        )
    }

    const CollectionsComponent = () => {

        return (
            <>
                {(!CollectionArray || CollectionArray.length === 0)
                    ?
                    <View style={{ marginTop: -250 }}>
                        <NoDataScreen isVisible={(!CollectionArray || CollectionArray.length === 0)} message="Looks like you dont't have any collection." />
                    </View>
                    :
                    <FlatList
                        horizontal={false}
                        numColumns={2}
                        data={CollectionArray}
                        scrollEnabled={false}
                        scrollEventThrottle={1}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => { props.navigation.navigate('CollectionProfileScreen', { item }) }}>
                                    <Image onPress={() => { props.navigation.navigate('CollectionProfileScreen', { item }) }} style={{ height: (windowWidth / 2), width: (windowWidth / 2) - 4, margin: 2 }} source={{ uri: item?.collection_logo_image == null ? global.COLLECTION_IMAGE_URL2 : item?.collection_logo_image }} />
                                </TouchableOpacity>
                            )
                        }} />
                }
            </>
        )
    }

    const routes = [
        { content: PostComponent(), icon: renderItem({ image: require("../../Images/home.png") }) },
        { content: NFTComponent(), icon: renderItem({ image: require("../../Images/nft.png") }) },
        { content: ReelsComponent(), icon: renderItem({ image: require("../../Images/reel.png") }) },
        { content: CollectionsComponent(), icon: renderItem({ image: require("../../Images/file.png") }) }];


    const ProfileTopComponent = () => {
        return (

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', top: -15 }}>


                <View style={{ borderWidth: activeArrayLength === 0 ? 0 : 2.5, borderColor: Color.secondary, borderRadius: 42.5, height: 85, width: 85, justifyContent: 'center', position: 'absolute', left: -10, top: -30 }}>
                    <TouchableOpacity onPress={() => { (user?.id === currentLogedUserID) ? OpenModel(true) : () => { } }} style={{ height: 80, width: 80, borderRadius: 40, alignSelf: "center" }}>
                        <Image source={profileImage} style={{ height: 75, width: 75, borderRadius: 40, alignSelf: "center", marginTop: 2 }} />
                    </TouchableOpacity>

                </View>


                <View style={{ flex: 1, backgroundColor: Color.secondary }} />
                <View style={{ alignItems: 'center', marginTop: 15, }}>

                    <Text style={{ fontSize: 20, fontFamily: Constants.fontFamilyBold, color: theme.textColor }}>{posts}</Text>
                    <Text style={{ color: theme.textColor, textTransform: 'capitalize', marginTop: 0, fontFamily: Constants.fontFamilyBold }}>speire</Text>
                </View>
                <TouchableOpacity style={{ alignItems: 'center', marginTop: 15, marginHorizontal: 20 }} onPress={() => { props.navigation.navigate('UserFriendsList', { Type: 'Followers' }) }}>
                    <Text style={{ fontSize: 20, fontFamily: Constants.fontFamilyBold, color: theme.textColor }}>{followers}</Text>
                    <Text style={{ color: theme.textColor, textTransform: 'capitalize', marginTop: 0, fontFamily: Constants.fontFamilyBold }}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', marginTop: 15 }} onPress={() => { props.navigation.navigate('UserFriendsList', { Type: 'Following' }) }}>
                    <Text style={{ fontSize: 20, fontFamily: Constants.fontFamilyBold, color: theme.textColor }}>{following}</Text>
                    <Text style={{ color: theme.textColor, textTransform: 'capitalize', marginTop: 0, fontFamily: Constants.fontFamilyBold }}>Following</Text>
                </TouchableOpacity>
            </View>

        )
    };

    // When any one change in this page also check UserProfile page because both page are same

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

            {/* Image upload Dialog */}
            <ImagePickerDialog
                isModalVisible={modalVisible}
                setModalVisibility={setModalVisible}
                onImagePic={(value) => {
                    onImageUpload(value?.uri)

                }}
                isImageView={true}
                onViewImage={() => {
                    setModalVisible(false);
                    setTimeout(() => {
                        setImageModalVisible(true);
                    }, 400)
                }}
                onRemoveImage={(value) => {
                    value ? onImageRemove() : null;
                }}
            />

            {/* Image Preview Modal */}
            <Modal
                transparent={true}
                isVisible={imageModalVisible}
                swipeDirection='down'
                onSwipeComplete={() => {
                    setImageModalVisible(false);
                }}
                style={{
                    margin: 0,

                }}>
                <View style={{ justifyContent: 'center', backgroundColor: theme.modalBackgroundColor, flex: 1 }} >
                    <Image source={isProfile ? profileImage : coverImage} resizeMode='contain' style={{ aspectRatio: 1, paddingVertical: 12, }} />
                </View>

            </Modal>

            {/* Story View Modal */}
            <Modal
                transparent={true}
                isVisible={storyModalVisible}
                swipeDirection='down'
                onSwipeComplete={() => {
                    clearTimeout(timer.current);
                    setStoryModalVisible(false);
                }}
                style={{ margin: 0 }}
            >
                <PagerView style={{ backgroundColor: theme.modalBackgroundColor, flex: 1 }} initialPage={storyImagePosition} onPageSelected={() => {
                    timer.current = setTimeout(() => {
                        setStoryModalVisible(false)
                    }, 5000)
                }}>

                    {iFlashstoriesArray && iFlashstoriesArray.map((item, index) => {
                        return (<View style={{ justifyContent: 'center' }} key={index + 1}>
                            <Image source={{ uri: (item?.image_url === "undefined" || item?.image_url === "null") ? global.COLLECTION_IMAGE_URL2 : item?.image_url }} resizeMode='contain' style={{ aspectRatio: 1, paddingVertical: 12, }} />
                        </View>)
                    })}

                </PagerView>

            </Modal>

            {/* Profile Setting Modal */}
            <Modal
                transparent={true}
                isVisible={settingsModalVisible}
                // backdropColor={'transparent'}
                onRequestClose={() => {
                    setSettingsModalVisible(false);
                }}
                onBackdropPress={() => {
                    setSettingsModalVisible(false);
                }}
                style={{
                    margin: 0,
                    bottom: 0,
                    position: 'absolute',
                    width: '100%',

                }}>

                <View style={{ backgroundColor: theme.modalBackgroundColor, borderTopRightRadius: 20, borderTopLeftRadius: 20, paddingBottom: 20 }}>


                    <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                        <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                            setSettingsModalVisible(false)
                            props.navigation.navigate('SettingsScreen')
                        }} >
                            <Ionicons name={'md-settings-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                            setSettingsModalVisible(false)
                            props.navigation.navigate('AwardsScreen')

                        }}>
                            <SimpleLineIcons name={'trophy'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Awards</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                            setSettingsModalVisible(false)
                            props.navigation.navigate('RewardsScreen')
                        }}>
                            <Ionicons name={'gift-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Rewards</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                            setSettingsModalVisible(false);
                            props.navigation.navigate('UserCollection');
                        }}>
                            <Ionicons name={'md-save-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Saved</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                            setSettingsModalVisible(false)
                            props.navigation.navigate('CloseFriendsScreen')
                        }}>
                            {/* <Ionicons name={'heart-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} /> */}
                            <Image source={require('../../Images/ic_close_friends.png')} style={{ resizeMode: 'contain', height: 25, width: 25, marginRight: 8, tintColor: theme.activeIcon }} />
                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Close Friends</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                            setSettingsModalVisible(false);
                            props.navigation.navigate('ReferalScreen')

                        }}>
                            {/* <Ionicons name={'heart-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} /> */}
                            <Image source={require('../../Images/ic_referal.png')} style={{ resizeMode: 'contain', height: 25, width: 25, marginRight: 8, tintColor: theme.activeIcon }} />
                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Horizon referal program</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                            setSettingsModalVisible(false)
                            props.navigation.navigate('WebviewScreen', { url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019' })
                        }}>
                            <Ionicons name={'md-information-circle-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>COVID-19 Information Center</Text>
                        </TouchableOpacity>


                    </View>

                </View>

            </Modal>

            {/* Follower/Follwed user Setting (Mute, unfollow, block) */}
            <Modal
                transparent={true}
                isVisible={userSettingmodalVisible}
                onRequestClose={() => {
                    setUserSettingModalVisible(false);
                }}
                onBackdropPress={() => {
                    setUserSettingModalVisible(false);
                }}
                style={{
                    margin: 0,
                    bottom: 0,
                    position: 'absolute',
                    width: '100%'
                }}>

                <View style={{ backgroundColor: theme.modalBackgroundColor, borderTopRightRadius: 20, borderTopLeftRadius: 20, paddingBottom: 20 }}>

                    {/* <TouchableOpacity style={{ marginTop: 10 }} >
                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 18, textAlign: 'center', alignSelf: 'center' }}>{username}</Text>
                    </TouchableOpacity>
                    
                    <View style={{ width: "40%", height: 1, alignSelf: 'center', backgroundColor: Color.yellow }}></View> */}
                    <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                        <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => { isCloseFriends ? OnRemoveCloseFriend() : OnAddCloseFriend() }}>
                            <View>
                                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>{isCloseFriends ? "Close friend" : "Add to close friends list"}</Text>
                                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 17, }}>(iFollow)</Text>
                            </View>

                            <Image source={require('./../../Images/ic_close_friends.png')} style={{ resizeMode: 'contain', height: 35, width: 35, marginRight: 8, tintColor: isCloseFriends ? Color.yellow : theme.textColor }} />

                        </TouchableOpacity>
                        <TouchableOpacity disabled style={{ marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between' }} >

                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Mute</Text>
                            {/* <MaterialIcons name={'navigate-next'} color={theme.textColor} size={25} style={{ marginRight: 5 }} /> */}

                            <Switch
                                style={{ alignSelf: 'center', transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                                trackColor={{ true: theme.trackActiveColor, false: theme.trackDisableColor }}
                                thumbColor={isMute ? theme.toggleActiveButtonColor : theme.toggleDisableButtonColor}
                                onValueChange={toggleMute}
                                value={isMute}>

                            </Switch>


                        </TouchableOpacity>

                        <TouchableOpacity disabled style={{ marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Restrict</Text>
                            <Switch
                                style={{ alignSelf: 'center', transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                                trackColor={{ true: theme.trackActiveColor, false: theme.trackDisableColor }}
                                thumbColor={isRestrict ? theme.toggleActiveButtonColor : theme.toggleDisableButtonColor}
                                onValueChange={toggleRestrict}
                                value={isRestrict}>

                            </Switch>

                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => { OnAddBlock() }}>

                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Block</Text>
                            {/* <MaterialIcons name={'navigate-next'} color={theme.textColor} size={25} style={{ marginRight: 5 }} /> */}

                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 15 }} onPress={() => { OnUnFollow() }}><Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Unfollow</Text></TouchableOpacity>

                    </View>

                </View>

            </Modal>

            <LoaderScreen visible={loading} />

            <StickyParallaxHeader
                foreground={renderForeground()}
                header={renderHeader()}
                tabs={routes}
                deviceWidth={width}
                parallaxHeight={parallaxHeight}
                scrollEvent={event([{ nativeEvent: { contentOffset: { y: scrollY.y } } }], {
                    useNativeDriver: false,
                })}
                decelerationRate='normal'
                snapStartThreshold={20}
                snapStopThreshold={40}
                onEndReachedThreshold={0.5}
                onEndReached={!requesting ? onEndReached : null}
                snapValue={5}
                headerSize={setHeaderSize}
                headerHeight={0}
                tabsContainerStyle={styles(theme).tabBar}
                tabTextContainerStyle={styles(theme).tabContainer}
                tabWrapperStyle={styles(theme).tabsWrapper}
                tabUnderlineColor={Color.secondary} />

            <PostMenu navigation={props.navigation} selectedItem={selectedItem} isMoreModalVisible={isMoreModalVisible} setIsMoreModalVisible={setIsMoreModalVisible} currentLogedUserID={currentLogedUserID} />

            <ShareModal isSendModalVisible={isSendModalVisible} setModalVisibility={setIsSendModalVisible} userData={myFollowingsList} OnSend={OnPostSend} />

        </SafeAreaView>
    );
}

const styles = (theme) => StyleSheet.create({
    tabBar: {
        width: '100%',
        backgroundColor: theme.backgroundColor,
        marginBottom: 10
    },
    tabContainer: {
        height: 40,
    },
    tabsWrapper: {
        flex: 1,
    }
});

export default ProfileComponent;