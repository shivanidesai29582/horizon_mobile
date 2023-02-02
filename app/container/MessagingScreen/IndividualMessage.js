import React, { useEffect, useRef, useState } from 'react';
import { Text, Keyboard, View, Image, Platform, PermissionsAndroid, SafeAreaView, Dimensions, KeyboardAvoidingView, TextInput, ScrollView, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import { get } from '../../storage';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { toast } from "./../../Omni";
import io from "socket.io-client";
import global from '../../common/globals';
import { useSelector } from 'react-redux';
import LoginHeader from "../Components/LoginHeader";
import horizonApiAxios from '../../services/restclient/horizonApiAxios';
import { Color } from '../../common';
import Constants from "../../common/Constants";
import LoaderScreen from '../../Components/LoaderScreen';
import NoDataScreen from '../NoDataScreen';
import { useTheme } from './../../Context';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const options = {
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    cameraType: 'back',
    includeBase64: false,
    saveToPhotos: false

}


const IndividualMessage = (props) => {
    const { theme } = useTheme();
    const scrollViewRef = useRef(null);
    const socketRef = useRef();
    console.log('socketRef', socketRef);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    console.log('arrivalMessage', arrivalMessage);
    const [keyboardStatus, setKeyboardStatus] = useState(undefined);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [imageViewModalVisible, setImageViewModalVisible] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [imageViewURL, setImageViewURL] = useState('');
    const [msg, setMsg] = useState('');
    const currentLogedUser = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const [messages, setMessages] = useState([]);
    console.log('messages', messages);
    const currentLogedUserID = currentLogedUser?.id;
    const ReciverUserID = props?.route?.params?.item?.id;
    console.log('ReciverUserID', props?.route?.params?.item, props?.route?.params?.item?.id);
    const [loading, setLoading] = useState(false);
    var imgHeight = 300;

    // const [dataItem, setData] = useState([]);
    // const [emojiItem, setEmoji] = useState(false);
    // const [emojiSearchString, setEmojiSearchString] = useState('');
    // const [requesting, setrequesting] = useState(true);
    const [isGIF, setIsGIF] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [gifsearchString, setGifSearchString] = useState('');
    const [gifNextString, setGifNextString] = useState();
    const [requesting, setrequesting] = useState(true);
    const [gifItem, setGif] = useState(false);
    const [dataItem, setData] = useState([]);

    useEffect(async () => {

        if (currentLogedUser) {
            socketRef.current = io(global.BASE_URL);
            socketRef.current.emit("add-user", currentLogedUserID);
        }
        await horizonApiAxios.post(`/getmsg`, { from: `${currentLogedUserID}`, to: `${ReciverUserID}` })
            .then((response) => {
                console.log("************* response", response, response.data);
                setMessages(response.data);
            })

        return () => {
            socketRef.current.disconnect();
        }

    }, []);

    useEffect(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
    }, [keyboardStatus, messages, arrivalMessage]);


    useEffect(() => {
        socketRef.current.on("msg-recieve", (msg) => {
            // setArrivalMessage({ fromSelf: false, message: msg?.msg, file_url: { url: msg?.file_url }, type: msg?.type });
            setArrivalMessage({
                fromSelf: false,
                message: msg?.msg,
                is_read: false,
                file_url: { url: msg?.file_url },
                type: msg?.type,
                created_at: msg?.created_at
            })
            console.log('msg_recieve', msg);
        });

    }, []);


    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus("Keyboard Shown");
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus("Keyboard Hidden");
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // useEffect(() => {
    //     OnEmojiSearch('');
    // }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const onSendHandler = async () => {

        const currentDate = new Date().toLocaleString().replace(',', '');
        console.log(currentDate);
        socketRef.current.emit("send-msg", {
            to: ReciverUserID,
            from: currentLogedUserID,
            msg,
            is_read: false,
            file_url: null,
            type: "text",
            created_at: currentDate
        });

        await horizonApiAxios.post(`/addmsg`, {
            from: currentLogedUserID,
            to: ReciverUserID,
            message: msg,
        }).then(() => {
            const msgs = [...messages];
            msgs.push({ fromSelf: true, message: msg, is_read: false, file_url: null, type: "text", created_at: currentDate });
            setMessages(msgs);
            setMsg('');
        })


    }

    const onSendImageHandler = async () => {
        setLoading(true);
        // if (isGIF) {
        //     console.log('isGIF', isGIF);
        //     const data = { file_url: imageURL?.uri, description, file_type: 'image/gif', source: 'tenor' }
        // } else {
        let storageToken = await get('horizon_token');
        const currentDate = new Date().toLocaleString().replace(',', '');
        let formData = new FormData();

        formData.append("file", {
            uri: imageURL?.uri,
            type: isGIF ? 'image/gif' : 'image/jpeg',
            name: isGIF ? `dummy${Date.now()}.gif` : `dummy${Date.now()}.jpg`
        });

        axios.post(`${global.HORIZON_BASE_URL}/attachments/upload_chat_file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${storageToken}`
            },
        }).then(async (response) => {

            socketRef.current.emit("send-msg", {
                to: ReciverUserID,
                from: currentLogedUserID,
                msg,
                file_url: response?.data?.data[0]?.url,
                type: response?.data?.data[0]?.type,
                is_read: false,
                created_at: currentDate
            });

            await horizonApiAxios.post(`/addmsg`, {
                from: currentLogedUserID,
                to: ReciverUserID,
                message: "  ",
                file_url: { url: response?.data?.data[0]?.url },
                type: response?.data?.data[0]?.type
            }).then(() => {
                const msgs = [...messages];
                msgs.push({ fromSelf: true, message: msg, file_url: { url: response?.data?.data[0]?.url }, type: response?.data?.data[0]?.type, is_read: false, created_at: currentDate });
                setMessages(msgs);
                setMsg('');
                setImageModalVisible(false);
                setLoading(false);
            }).catch((error) => {
                setImageModalVisible(false);
                setLoading(false);
            })

        }).catch((error) => {
            setImageModalVisible(false);
            setLoading(false);
        })
        // }


    }


    const profileImage = { uri: props?.route?.params?.item?.profile_photo == null ? global.USER_PROFILE_URL : props?.route?.params?.item?.profile_photo };
    const chatGroup = props?.route?.params?.item?.username;
    const onlinePeople = 7;
    const totalPeople = 12;


    const onImagePic = async (value) => {
        await setImageURL(value);
        await setImageModalVisible(true);
    }

    const onImagePress = (value) => {
        setImageViewURL({ uri: value })
        setImageViewModalVisible(true);
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
                            toast('Something went wrong, please try again')
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

    const pickImageFromGallery = () => {
        launchImageLibrary(options, (response) => {
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
                        toast('Something went wrong, please try again')
                    }
                } else {
                    toast('Something went wrong, please try again')
                }

            }
        })
    }

    const ChatGroupName = () => {
        return (
            <View style={{ padding: 8, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity activeOpacity={0.8} style={{ height: 30, width: 30, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: theme.textColor, borderRadius: 50 }} onPress={() => { props.navigation.pop(); }}>
                    <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 5 }}>
                    <Image style={{ height: 35, width: 35, borderRadius: 30 }} source={profileImage} />
                    <View style={{ marginLeft: 13 }}>
                        <Text style={{ color: theme.textColor, fontSize: 18, fontFamily: Constants.fontFamilySemiBold }}>{chatGroup}</Text>
                        {/* <Text style={{ color: "rgba(236,77,78,0.98)", fontSize: 11, marginTop: 4 }}> {onlinePeople} Online, from {totalPeople} Peoples</Text> */}
                    </View>
                </View>
                {/* <Ionicons name={"call-outline"} size={20} color={"#fff"} style={{ marginHorizontal: 5 }} />
                <Feather name={"video"} size={20} color={"#fff"} style={{ marginHorizontal: 5 }} /> */}
                {/* <Feather name={"more-vertical"} size={20} color={theme.textColor} style={{ marginHorizontal: 5 }} /> */}

            </View>




        )
    };

    // // const fetchData = async () => {
    // //     const value = encodeURI(emojiSearchString);
    // //     const resp = await fetch(`https://emoji-api.com/emojis?access_key=37d86cb7831a0162e200fda09c313565fa489be8&search=${value}`);
    // //     const data = await resp.json();
    // //     console.log('fetchData_resp', resp, 'fetchData_data', data);
    // //     setData(data);
    // //     // setEmojiNextString(data?.next);
    // //     setrequesting(false);
    // // };

    // const onEndReached = async () => {
    //     setrequesting(true);
    //     if (emojiSearchString) {
    //         const value = encodeURI(emojiSearchString);
    //         const url = `https://emoji-api.com/emojis?access_key=37d86cb7831a0162e200fda09c313565fa489be8&search=${value}`
    //         const resp = await fetch(url);
    //         const data = await resp.json();
    //         console.log('onEndReached_value', value, 'url', url, 'resp', resp, 'data', data);
    //         setData([...dataItem, ...data?.character]);
    //         // setGifNextString(data?.next);
    //         setrequesting(false);

    //     } else {
    //         const resp = await fetch(`https://emoji-api.com/emojis?access_key=37d86cb7831a0162e200fda09c313565fa489be8&search=${value}`);
    //         const data = await resp.json();
    //         console.log('onEndReached_resp', resp, 'data', data);
    //         setData([...dataItem, ...data?.character]);
    //         // setGifNextString(data?.next);
    //         setrequesting(false);

    //     }

    // };

    // // console.log("************ imageViewURL", imageViewURL);
    // const OnEmojiSearch = async (text) => {
    //     setEmojiSearchString(text);

    //     const value = encodeURI(text);
    //     const url = `https://emoji-api.com/emojis?access_key=37d86cb7831a0162e200fda09c313565fa489be8&search=${value}`
    //     const resp = await fetch(url);
    //     const data = await resp.json();
    //     console.log('url', url, 'resp', resp, 'data', data);
    //     // setEmojiNextString(data?.character);
    //     setData(data);
    // }

    const fetchData = async () => {
        const resp = await fetch("https://tenor.googleapis.com/v2/featured?key=AIzaSyAAeXVtPlLMPNXgfJvxKoN1JtU2vz_hWcU&client_key=my_test_app");
        const data = await resp.json();
        setData(data?.results);
        setGifNextString(data?.next);
        setrequesting(false);
    };

    const OnSearch = (text) => {
        setSearchString(text);
        if (text) {
            const searchData = myFollowingsList?.filter((ele) => ele?.username?.toLowerCase().includes(text.toLowerCase()));
            setMyFollowingsList(searchData);
        } else {
            setMyFollowingsList(List);
        }
    }


    const onEndReached = async () => {
        setrequesting(true);
        if (gifsearchString) {
            const value = encodeURI(gifsearchString);
            const url = `https://tenor.googleapis.com/v2/search?key=AIzaSyAAeXVtPlLMPNXgfJvxKoN1JtU2vz_hWcU&client_key=my_test_app&q=${value}&pos=${gifNextString}`
            const resp = await fetch(url);
            const data = await resp.json();
            setData([...dataItem, ...data?.results]);
            setGifNextString(data?.next);
            setrequesting(false);

        } else {
            const resp = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAAeXVtPlLMPNXgfJvxKoN1JtU2vz_hWcU&client_key=my_test_app&pos=${gifNextString}`);
            const data = await resp.json();
            setData([...dataItem, ...data?.results]);
            setGifNextString(data?.next);
            setrequesting(false);

        }

    };

    const OnGifSearch = async (text) => {
        setGifSearchString(text);
        if (text) {
            const value = encodeURI(text);
            const url = `https://tenor.googleapis.com/v2/search?key=AIzaSyAAeXVtPlLMPNXgfJvxKoN1JtU2vz_hWcU&client_key=my_test_app&q=${value}&pos=`
            const resp = await fetch(url);
            const data = await resp.json();
            setGifNextString(data?.next);
            setData(data?.results);
        } else {
            setGifNextString();
            fetchData();
        }
    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

            {ChatGroupName()}
            <Modal
                transparent={true}
                isVisible={imageViewModalVisible}
                swipeDirection='down'
                onSwipeComplete={() => {
                    setImageViewModalVisible(false);
                }}
                style={{
                    margin: 0,
                    position: 'absolute',
                    top: 40,
                    left: 0,
                    backgroundColor: theme.backgroundColor,
                }}>

                {/* <TouchableOpacity
                    style={{ position: 'absolute', left: 20, top: 40, height: 30, width: 30, borderRadius: 30, borderWidth: 1, borderColor: "black", }}
                    onPress={() => {
                        setImageViewModalVisible(false)
                    }}>
                    <Ionicons name={'md-chevron-back'} color={'black'} size={20} />
                </TouchableOpacity> */}
                <View style={{ justifyContent: "center", alignItems: "center", height: windowHeight }}>
                    <LoginHeader style={{ paddingTop: 50 }} onBackPress={() => {
                        props.navigation.pop()
                    }} />
                    <ImageZoom source={imageViewURL} style={{ width: windowWidth, height: imgHeight, }} />
                </View>


            </Modal>

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
                    <LoaderScreen visible={loading} />
                    <Image source={imageURL} resizeMode='contain' style={{ aspectRatio: 1, alignSelf: 'center', width: '100%' }} />

                    <TouchableOpacity style={{ alignSelf: 'flex-end', position: 'absolute', bottom: 60, right: 10 }} onPress={() => { onSendImageHandler() }} >
                        {/* <Text style={{ color: Color.secondary, fontFamily: Constants.fontFamilyBold, fontSize: 14, marginHorizontal: 8, }}> Send</Text> */}

                        <MaterialCommunityIcons name={"send"} size={25} color={theme.textColor} style={{ marginHorizontal: 5, alignSelf: 'center' }} />


                    </TouchableOpacity>

                </View>

            </Modal>
            {/* GIF Model */}
            {/* <Modal
                isVisible={emojiItem}
                style={{
                    margin: 0,
                    bottom: 0,
                    position: 'absolute',
                    width: '100%'
                }}
            >
                <View style={{ flex: 1, paddingBottom: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: theme.modalBackgroundColor }}>
                    <View style={{ flexDirection: 'row', margin: 8 }}>
                        <TouchableOpacity onPress={() => setEmoji(false)} style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderWidth: 1, borderColor: theme.activeIcon }}>
                            <Ionicons name={'md-chevron-back'} color={theme.activeIcon} size={20} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, flexDirection: 'row', height: 35, marginHorizontal: 10, paddingRight: 10, borderWidth: 1, borderRadius: 10, borderColor: theme.borderColor }}>
                            <View style={{ width: 32, height: 35, alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name={'search'} color={theme.textColor} size={20} style={{ alignSelf: 'center' }} />
                            </View>
                            <TextInput
                                value={emojiSearchString}
                                style={{ fontSize: 13, color: theme.textColor, fontFamily: Constants.fontFamilyRegular, textTransform: 'lowercase' }}
                                placeholderTextColor={'#B9B8BC'}
                                placeholder={'Search for Emoji'}
                                onSubmitEditing={(text) => { OnEmojiSearch(text) }}
                                onChangeText={(text) => { OnEmojiSearch(text) }}
                            />
                        </View>
                    </View>
                    <FlatList
                        horizontal={false}
                        data={dataItem}
                        numColumns={8}
                        renderItem={({ item }) => {
                            console.log('emoji_item', item);
                            return (
                                <TouchableOpacity style={{ flexDirection: 'row', padding: 5, alignItems: 'center', justifyContent: 'space-between', }} onPress={() => {
                                    // setIsEmoji(true);
                                    setEmoji(false);
                                    setImageURL({ uri: item?.character });
                                }}>
                                    <Text style={{ fontSize: 32 }}>{item?.character}</Text>
                                </TouchableOpacity>
                            )
                        }}
                        style={{ height: 300, width: '100%', marginHorizontal: 10 }}
                        onEndReachedThreshold={5}
                        onEndReached={!requesting ? onEndReached : null}
                    />
                </View>
            </Modal> */}
            {/* GIF Model */}
            <Modal
                isVisible={gifItem}
                transparent={true}
                swipeDirection='down'
                onSwipeComplete={() => {
                    setGif(false);
                }}
                style={{
                    margin: 10,
                    bottom: 0,
                    position: 'absolute',
                    height: 500,
                    width: '100%'
                }}
            >
                <View style={{ paddingBottom: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: theme.modalBackgroundColor }}>
                    <View style={{ flexDirection: 'row', margin: 8 }}>
                        <View style={{ flex: 1, flexDirection: 'row', height: 35, marginHorizontal: 10, marginTop: 8, paddingRight: 10, borderWidth: 1, borderRadius: 30, borderColor: theme.borderColor }}>
                            <View style={{ width: 32, height: 35, alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name={'search'} color={theme.textColor} size={20} style={{ alignSelf: 'center' }} />
                            </View>
                            <TextInput
                                style={{ fontSize: 13, color: theme.textColor, fontFamily: Constants.fontFamilyRegular, }}
                                placeholderTextColor={'#B9B8BC'}
                                placeholder={'Search for GIF'}
                                value={gifsearchString}
                                onSubmitEditing={(text) => { OnGifSearch(text) }}
                                onChangeText={(text) => { OnGifSearch(text) }}
                            />
                        </View>
                        {/* <FlatList
							data={categoryItem}
							renderItem={({ item }) => (
								<View style={{ paddingRight: 10, paddingVertical: 5 }}>
									<View style={{ paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: theme.textColor }}>
										<Text style={{ fontSize: 14, lineHeight: 16, color: theme.textColor }}>{item?.searchterm}</Text>
									</View>
								</View>
							)}
							bounces={false}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
						/> */}
                    </View>
                    {/* <TabView
						renderScene={renderScene}
						navigationState={{ index, routes }}
						onIndexChange={setIndex}
						renderTabBar={renderTabBar}
					/> */}
                    {/* <TabView
					renderScene={SceneMap({
						item?.searchterm: item?.
						first: FirstRoute,
						second: SecondRoute,
					})}
							navigationState={{ index, routes }}
							onIndexChange={setIndex}
							tabBarPosition='top'
							renderTabBar={props => <TabBar {...props} style={{ backgroundColor: theme.backgroundColor, height: 40 }}
									renderLabel={({ focused, route }) => {
											return (<View style={{}} >
													<Text numberOfLines={1} style={{ fontSize: 18, color: theme.textColor, fontFamily: Constants.fontFamilySemiBold }}>{route.title}</Text>
											</View>);
									}}
									indicatorStyle={{
											backgroundColor: Color.secondary,
											padding: 1.5,
									}} />

							}
					/> */}
                    <FlatList
                        horizontal={false}
                        numColumns={2}
                        data={dataItem}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={{ padding: 5, alignItems: 'center', justifyContent: 'space-between', }} onPress={async () => {
                                await setIsGIF(true);
                                await setGif(false);
                                await setImageURL({ uri: item?.media_formats?.gif?.url });
                                await setImageModalVisible(true);
                            }}>
                                <Image source={{ uri: item?.media_formats?.tinygif?.url }} style={{ height: 170, width: 175, borderRadius: 20 }} />
                            </TouchableOpacity>
                        )}
                        style={{ height: 540, width: '100%', marginHorizontal: 10 }}
                        onEndReachedThreshold={5}
                        onEndReached={!requesting ? onEndReached : null}
                    />
                </View>
                <TouchableOpacity style={{ position: 'absolute', justifyContent: 'center', marginBottom: 10, top: 5, left: 170, right: 170, flex: 1, borderTopWidth: 5, borderTopColor: 'grey', borderRadius: 10 }} onPress={() => setGif(false)}>
                </TouchableOpacity>
            </Modal>
            <ImageBackground
                source={require('./../../Images/reel1.png')}
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    alignSelf: 'center',
                }}
                resizeMode={'cover'}
            >
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1, justifyContent: "space-between" }}>
                    <ScrollView
                        ref={scrollViewRef}
                        showsVerticalScrollIndicator={false}
                        scrollToOverflowEnabled={true}
                        bounces={false}
                        style={{ flex: 1 }}
                        onContentSizeChange={() => {
                            scrollViewRef.current.scrollToEnd({ animated: true });
                        }}
                    >
                        {(!messages || messages.length === 0) ?
                            <NoDataScreen isVisible={(!messages || messages.length === 0)} message="Looks like you dont't search anything yet." />
                            :
                            <View style={{ flex: 1, margin: 10, }}>
                                {messages.map((item) => {
                                    const created_at = item?.created_at;
                                    let timeFormat = "";
                                    if (created_at) {
                                        const splitCreatedAt = created_at.split(' ');
                                        const timeWithSec = splitCreatedAt[1].split(':');
                                        timeFormat = timeWithSec[0] + ':' + timeWithSec[1] + ' ' + splitCreatedAt[2];
                                    }
                                    switch (item?.type) {
                                        case 'text':
                                            return (<View style={{ alignSelf: item?.fromSelf ? 'flex-end' : 'flex-start', margin: 5, borderRadius: 20, borderTopLeftRadius: item?.fromSelf ? 20 : 0, borderTopRightRadius: item?.fromSelf ? 0 : 20, backgroundColor: item?.fromSelf ? '#F4F4F4' : Color.secondary, paddingHorizontal: 10, paddingVertical: 5, minWidth: 80 }}>
                                                <Text style={{ color: item?.fromSelf ? 'black' : 'white', fontSize: 18, }}>{item.message}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 3 }}>
                                                    {/* <Text style={{ color: item?.fromSelf ? 'black' : 'white', fontSize: 8 }}>1:00 pm</Text> */}
                                                    <Text style={{ color: item?.fromSelf ? 'black' : 'white', fontSize: 8 }}>{timeFormat}</Text>
                                                </View>
                                            </View>)
                                        case 'image/jpeg':
                                            return (<TouchableOpacity onPress={() => { onImagePress(item?.file_url?.url) }} style={{ alignSelf: item?.fromSelf ? 'flex-end' : 'flex-start', margin: 5, borderRadius: 20, borderTopLeftRadius: item?.fromSelf ? 20 : 0, borderTopRightRadius: item?.fromSelf ? 0 : 20, backgroundColor: item?.fromSelf ? '#F4F4F4' : Color.secondary, padding: 5 }}>
                                                <Image style={{ width: 200, height: 200, resizeMode: 'cover', borderRadius: 20, borderTopLeftRadius: item?.fromSelf ? 20 : 0, borderTopRightRadius: item?.fromSelf ? 0 : 20, }} source={{ uri: `${item?.file_url?.url}` }} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: "absolute", bottom: 10, right: 15 }}>
                                                    {/* <Text>3:00</Text> */}
                                                    <Text style={{ color: 'white', fontSize: 12 }}>{timeFormat}</Text>
                                                </View>
                                            </TouchableOpacity>)
                                        case 'image/gif':
                                            return (<TouchableOpacity onPress={() => { onImagePress(item?.file_url?.url) }} style={{ alignSelf: item?.fromSelf ? 'flex-end' : 'flex-start', margin: 5, borderRadius: 10, borderTopLeftRadius: item?.fromSelf ? 10 : 0, borderTopRightRadius: item?.fromSelf ? 0 : 10, backgroundColor: item?.fromSelf ? '#F4F4F4' : Color.secondary, padding: 5 }}>
                                                <Image style={{ width: 200, height: 200, resizeMode: 'cover', borderRadius: 20, borderTopLeftRadius: item?.fromSelf ? 20 : 0, borderTopRightRadius: item?.fromSelf ? 0 : 20, }} source={{ uri: `${item?.file_url?.url}` }} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: "absolute", bottom: 10, right: 15 }}>
                                                    {/* <Text>3:00</Text> */}
                                                    <Text style={{ color: 'white', fontSize: 12 }}>{timeFormat}</Text>
                                                </View>
                                            </TouchableOpacity>)
                                        default:
                                            return (<View style={{ alignSelf: item?.fromSelf ? 'flex-end' : 'flex-start', margin: 5, borderRadius: 20, borderTopLeftRadius: item?.fromSelf ? 20 : 0, borderTopRightRadius: item?.fromSelf ? 0 : 20, backgroundColor: item?.fromSelf ? '#F4F4F4' : Color.secondary, paddingHorizontal: 10, paddingVertical: 5, minWidth: 80 }}>
                                                <Text style={{ color: item?.fromSelf ? 'black' : 'white', fontSize: 18 }}>{item.message}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 3 }}>
                                                    {/* <Text style={{ color: item?.fromSelf ? 'black' : 'white', fontSize: 12 }}>5:00</Text> */}
                                                    <Text style={{ color: item?.fromSelf ? 'black' : 'white', fontSize: 8 }}>{timeFormat}</Text>
                                                </View>
                                            </View>)
                                    }
                                })}
                            </View>
                        }
                    </ScrollView>



                    {/* <FlatList
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                    data={messages}
                    style={{ marginHorizontal: 10, flex: 1 }}
                    renderItem={({ item, index }) => {
                        return (<View style={{ alignSelf: item?.fromSelf ? 'flex-end' : 'flex-start', margin: 5, borderBottomRightRadius: item?.fromSelf ? 0 : 7, borderBottomLeftRadius: item?.fromSelf ? 7 : 0, borderTopRightRadius: 7, borderTopLeftRadius: 7, backgroundColor: "#960001", borderColor: "#fff", padding: 10, marginLeft: item?.fromSelf ? 25 : 0, marginRight: item?.fromSelf ? 0 : 25 }}>
                            <Text style={{ color: "#fff", fontSize: 13, marginVertical: 3, alignSelf: item?.fromSelf ? 'flex-end' : 'flex-start' }}>{item.message}</Text>
                        </View>)
                    }} /> */}


                    <View style={{ marginBottom: 8, flexDirection: "row" }}>
                        <View style={{ flex: 1, padding: 5, flexDirection: "row", backgroundColor: '#F4F4F4', borderRadius: 50 }}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={{ height: 40, width: 40, alignSelf: 'center', justifyContent: 'center' }}
                                onPress={() => pickImageFromCamera()}>
                                <Image
                                    source={require('./../../Images/ic_create_reel_camera.png')}
                                    style={{
                                        width: 22,
                                        height: 22,
                                        alignSelf: 'center', tintColor: 'black'
                                    }}
                                />
                            </TouchableOpacity>
                            {msg !== '' ?
                                <>
                                    <View style={{ flex: 1, height: 45, justifyContent: 'center' }}>
                                        <TextInput
                                            placeholder="Sent a moment..."
                                            placeholderTextColor="gray"
                                            maxLength={2200}
                                            maxHeight={108}
                                            style={{ fontSize: 15, color: 'black', marginBottom: 0, paddingVertical: 5 }}
                                            value={msg}
                                            onChangeText={(text) => { setMsg(text) }}
                                            onSubmitEditing={() => { onSendHandler() }}
                                            multiline={true}
                                        />
                                    </View>
                                    <TouchableOpacity style={{ width: 40, justifyContent: 'center' }} onPress={() => { onSendHandler() }} >
                                        {/* <MaterialCommunityIcons name={"send"} size={25} color={theme.textColor} /> */}
                                        <Image style={{ height: 25, width: 25, alignItems: 'center', justifyContent: 'center', tintColor: 'black', transform: ([{ rotateX: '0deg' }, { rotateZ: '40deg' }]) }} source={require('../../Images/send.png')} />

                                    </TouchableOpacity>
                                </>
                                :
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ width: windowWidth - 135, height: 45, justifyContent: 'center' }}>
                                        <TextInput
                                            placeholder="Sent a moment..."
                                            placeholderTextColor="gray"
                                            maxLength={2200}
                                            maxHeight={108}
                                            style={{ fontSize: 15, color: 'black', marginBottom: 0, paddingVertical: 5 }}
                                            value={msg}
                                            onChangeText={(text) => { setMsg(text) }}
                                            onSubmitEditing={() => { onSendHandler() }}
                                            multiline={true}
                                        />
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => { setGif(true) }} style={{
                                            width: 40,
                                            height: 40,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Image
                                                source={require('./../../Images/gif.png')}
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    resizeMode: 'contain',
                                                    tintColor: 'black'
                                                }}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => pickImageFromGallery()} style={{
                                            width: 40,
                                            height: 40,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <AntDesign name={"picture"} size={28} color={'black'} style={{ marginHorizontal: 5, alignSelf: 'center' }} />
                                        </TouchableOpacity>{/* <Feather name={"mic"} size={20} color={theme.textColor} style={{ marginHorizontal: 5, alignSelf: 'center' }} /> */}
                                    </View>
                                </View>
                            }

                        </View>
                    </View>
                </KeyboardAvoidingView>

            </ImageBackground>

        </SafeAreaView >
    );
}

export default IndividualMessage;
