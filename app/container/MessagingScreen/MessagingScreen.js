import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    Image,
    PermissionsAndroid,
    TouchableOpacity, SafeAreaView, FlatList, TextInput
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Header } from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import { getMyFollowing } from './../../redux/userlogin'
import { getChat } from './../../redux/chat';
import { get } from '../../storage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import NoDataScreen from '../NoDataScreen';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import global from "./../../common/globals";
import { hp, normalize, wp } from './../../common/ResponsiveScreen';
import { useTheme } from './../../Context';
import { Color } from '../../common';

import Modal from "react-native-modal";
import LoaderScreen from '../../Components/LoaderScreen';

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import horizonApiAxios from '../../services/restclient/horizonApiAxios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { toast } from "./../../Omni";

const options = {
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    cameraType: 'back',
    includeBase64: false,
    saveToPhotos: false
}
const MessagingScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    let List = useSelector((state) => state?.userlogin?.myFollowings);
    let user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    let chatList = useSelector((state) => state?.chat?.chatList);
    const username = user?.username === null ? "unnamed" : user?.username;
    const [searchString, setSearchString] = useState('');
    const [myFollowingsList, setMyFollowingsList] = useState(null);
    const [loading, setLoading] = useState(false);

    const currentLogedUser = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const currentLogedUserID = currentLogedUser?.id;
    const [reciverUserID, setReciverUserID] = useState();
    const [imageURL, setImageURL] = useState('');
    const [imageModalVisible, setImageModalVisible] = useState(false);
    useEffect(() => {
        setLoading(true);
        dispatch(getChat(user?.id)).then((data) => {
            if (data?.data?.length == 0) {
                dispatch(getMyFollowing()).then(() => { setLoading(false) }).catch(() => { setLoading(false) });
            } else {
                setMyFollowingsList(data?.data)
                setLoading(false)
            }
        }).catch(() => { setLoading(false) });
    }, [isFocused, useFocusEffect]);

    useEffect(() => {
        setMyFollowingsList(chatList?.length == 0 ? List : chatList);
    }, [List, chatList]);

    const OnSearch = (text) => {
        setSearchString(text);
        if (text) {
            const searchData = myFollowingsList?.filter((ele) => ele?.username.toLowerCase().includes(text.toLowerCase()));
            setMyFollowingsList(searchData);
        } else {
            setMyFollowingsList(List);
        }
    }
    const onSendImageHandler = async () => {
        let storageToken = await get('horizon_token');
        let formData = new FormData();

        formData.append("file", {
            uri: imageURL?.uri,
            type: 'image/jpeg',
            name: `dummy${Date.now()}.jpg`
        });

        axios.post(`${global.HORIZON_BASE_URL}/attachments/upload_chat_file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${storageToken}`
            },
        }).then(async (response) => {
            await horizonApiAxios.post(`/addmsg`, {
                from: currentLogedUserID,
                to: reciverUserID,
                message: "  ",
                file_url: { url: response?.data?.data[0]?.url },
                type: response?.data?.data[0]?.type
            }).then(() => {
                setImageModalVisible(false);
            }).catch((error) => {
                setImageModalVisible(false);
            })
        }).catch((error) => { })
    }

    const onImagePic = async (value) => {
        await setImageURL(value);
        await setImageModalVisible(true);
    }

    const requestCameraPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true
                } else {
                    toast("Camera permission denied");
                    return false
                }
            } else {
                return true
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const pickImageFromCamera = async () => {
        if (await requestCameraPermission()) {
            launchCamera(options, (response) => {
                if (response.didCancel) {
                    // console.log('User cancelled image picker')
                } else if (response.error) {
                    // console.log('ImagePicker Error: ', response.error)
                } else if (response.customButton) {
                    // console.log('User tapped custom button: ', response.customButton)
                } else {
                    if (response.assets && response.assets.length > 0) {
                        const value = response.assets[0]
                        if (value) {
                            value.uri = Platform.OS == 'ioss' ? value.uri.replace('file://', '/private') : value.uri
                            value.name = value.fileName
                            onImagePic(value)
                        } else {
                            toast('Something went wrong, please try again, log')
                        }
                    } else {
                        if (response.errorMessage) {
                            toast(response.errorMessage)
                        } else {
                            toast('Something went wrong, please try again')
                        }
                    }
                }
            })
        }
    }

    const MessageComponent = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('IndividualMessage', { item })
            }} style={{ padding: 8, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', backgroundColor: theme.backgroundColor, marginHorizontal: 10, marginVertical: 5, borderRadius: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Image style={{ height: 60, width: 60, borderRadius: 100 }} source={{ uri: item?.profile_photo == null ? global.USER_PROFILE_URL : item?.profile_photo }} />
                    {/* <View style={{ width: 14, height: 14, backgroundColor: item.isActive == 2 ? '#f4cd1f' : item.isActive == 1 ? '#00ec00' : item.isActive == 3 ? '#bebebe' : null, borderRadius: 20, top: 20, right: 12, borderWidth: 2, borderColor: "#fff" }}></View> */}
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: theme.textColor, fontSize: 15, fontFamily: Constants.fontFamilyRegular }}>{item?.username}</Text>
                        {/* <Text style={{ color: item.isRead ? "#fff" : "rgba(236,77,78,0.98)", fontSize: 12, marginTop: 13, fontFamily: Constants.fontFamilyRegular }}>{item.lastMsg}</Text> */}
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ width: wp(9), height: wp(9), alignItems: 'flex-end', justifyContent: 'center' }}
                    onPress={() => {
                        setReciverUserID(item.id);
                        pickImageFromCamera();
                    }}
                >
                    <Image
                        source={require('./../../Images/ic_create_reel_camera.png')}
                        style={{
                            width: wp(6),
                            height: wp(6),
                            tintColor: theme.textColor
                        }}
                    />
                    {/* <Text style={{ color: 'rgba(141,141,141,0.75)', fontSize: 13, fontFamily: Constants.fontFamilyRegular }}>{item.time}</Text>
                    <View style={{ backgroundColor: '#960001', height: 22, width: 22, justifyContent: 'center', borderRadius: 30, marginTop: 10 }}>
                        <Text style={{ fontSize: 13, alignSelf: 'center', color: theme.textColor, fontFamily: Constants.fontFamilyRegular }}>{item.numberOfMsg}</Text>
                        <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />
                    </View> */}
                </TouchableOpacity>
            </TouchableOpacity >
        )
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
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
                    <Image source={imageURL} resizeMode='contain' style={{ aspectRatio: 1, alignSelf: 'center' }} />
                    <TouchableOpacity style={{ alignSelf: 'flex-end', position: 'absolute', bottom: 60, right: 10 }} onPress={() => { onSendImageHandler() }} >
                        {/* <Text style={{ color: Color.secondary, fontFamily: Constants.fontFamilyBold, fontSize: 14, marginHorizontal: 8, }}> Send</Text> */}
                        <MaterialCommunityIcons name={"send"} size={25} color={theme.textColor} style={{ marginHorizontal: 5, alignSelf: 'center' }} />
                    </TouchableOpacity>
                </View>
            </Modal>
            <Header title={username} isShownSearch={false} onBackPress={() => {
                props.navigation.navigate({ name: "HomeScreen", merge: true });
            }} />

            <LoaderScreen visible={loading} />
            <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ borderRadius: 10, borderColor: theme.borderColor, borderWidth: 1, height: 35, alignSelf: 'flex-end', flexDirection: 'row', paddingHorizontal: 10, width: "100%" }}>
                        <Ionicons name={'search'} color={theme.textColor} size={20} style={{ alignSelf: 'center' }} />
                        <View style={{ justifyContent: 'center', width: "100%" }}>
                            <TextInput value={searchString} onSubmitEditing={(text) => { OnSearch(text) }} onChangeText={(text) => OnSearch(text)} style={{ width: "90%", alignSelf: 'flex-start', color: theme.textColor, fontSize: 12, padding: 5, fontFamily: Constants.fontFamilyRegular, paddingLeft: 10 }} placeholderTextColor={'#B9B8BC'} placeholder={'Search'} />
                        </View>
                    </View>
                </View>
            </View>
            {
                myFollowingsList == null ?
                    <NoDataScreen isVisible={myFollowingsList} message="Looks like you dont't search anything yet." />
                    :
                    <FlatList
                        data={myFollowingsList}
                        renderItem={({ item, index }) => {
                            return (
                                MessageComponent({ item })
                            )
                        }}
                    />
            }
        </SafeAreaView>
    );
}

export default MessagingScreen;
