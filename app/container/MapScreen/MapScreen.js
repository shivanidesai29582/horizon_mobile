import React, { useState, useEffect, useRef } from 'react';
import { Image, Platform, SafeAreaView, Text, StyleSheet, TouchableOpacity, View, DeviceEventEmitter } from 'react-native';
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from '@react-navigation/native'
import MapboxGL from '@rnmapbox/maps';
import { useDispatch, useSelector } from 'react-redux';
import GetLocation from 'react-native-get-location';
import LottieView from 'lottie-react-native';
import Color from "../../common/Color";
import Constants from "../../common/Constants";
import global from '../../common/globals';
import { getAllStories } from "./../../redux/storie";
import { getRecentActivity, getNearByUser, getPlaces } from "./../../redux/location";
import { getAllFutureVisit } from "./../../redux/futurevisit";
import { getAllIllustration } from "./../../redux/illustration";
import { putUserUpdate } from './../../redux/userlogin'
import { useTheme } from './../../Context';
MapboxGL.setAccessToken('pk.eyJ1Ijoid2hpdGVvcmlnaW4iLCJhIjoiY2wzYmF0Z3IzMDk4ejNmcG0yaGM0ejRkNCJ9._qicd_Pio6rSEsvCP6o8dw');

const MapScreen = (props) => {

    const { theme } = useTheme();
    const timer = useRef(null);
    const MapOpenTimer = useRef(null);
    const lottieRef = useRef(null);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const storiesList = useSelector((state) => state?.storie?.stories);
    const futurevisitList = useSelector((state) => state?.futurevisit?.futurevisits);
    const illustrationList = useSelector((state) => state?.illustration?.illustrations);
    const userinfo = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const activitysList = useSelector((state) => state?.location?.recentactivitys);
    const nearbyusersList = useSelector((state) => state?.location?.nearbyusers);
    const placesList = useSelector((state) => state?.location?.placesList);
    const profileImage = { uri: userinfo?.profile_photo == null ? global.USER_PROFILE_URL : userinfo?.profile_photo };
    const [selectedOpt, setSelectedOpt] = useState(-0);
    const [modalVisible, setmodalVisible] = useState(false);
    const [coordinates, setCoordinates] = useState([userinfo?.longitude && userinfo?.longitude !== "undefined" ? parseFloat(userinfo?.longitude) : -122.4324, userinfo?.latitude && userinfo?.latitude !== "undefined" ? parseFloat(userinfo?.latitude) : 37.78825]);
    const [storyModalVisible, setStoryModalVisible] = useState(false);
    const [randomAnimationVisible, setRandomAnimationVisible] = useState(false);
    const [touchLocation, setTouchLocation] = useState(coordinates);
    const [storyImage, setStoryImage] = useState();
    const activeArrayLength = userinfo?.stories?.filter((ele) => ele?.status === 'Active')?.length;


    useEffect(() => {
        DeviceEventEmitter.addListener('setMapScreen', () => {
            // console.log("****************** setMapScreen");
        });
    }, [1])


    useEffect(() => {
        Reload();
        getLocation();

    }, [isFocused]);

    const Reload = () => {
        dispatch(getAllStories());
        dispatch(getAllFutureVisit());
        dispatch(getAllIllustration());
        dispatch(getPlaces());
    }

    useEffect(() => {
        dispatch(getNearByUser({ latitude: touchLocation[1], longitude: touchLocation[0], meter: 10000 }));
    }, [touchLocation]);



    const placedata = placesList?.filter((ele) => {
        return ele?.longitude && ele?.latitude && (Number(ele.longitude) && Number(ele.latitude))
    }).map(location => {
        return [parseFloat(location.latitude), parseFloat(location.longitude)]
    })

    const [route, setRoute] = useState({
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: placedata,
                },
            },
        ],
    });

    const getLocation = () => {

        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
        })
            .then(location => {
                setCoordinates([location?.longitude, location?.latitude])
                const latitude = location === null ? "37.78825" : `${location?.latitude}`;
                const longitude = location === null ? "-122.4324" : `${location?.longitude}`;
                dispatch(putUserUpdate({ latitude, longitude }))
            })
            .catch(error => {

            })
    }


    const OpenStoryModel = (item) => {
        setStoryImage({ uri: item?.image_url == null ? global.USER_PROFILE_URL : item?.image_url })
        setStoryModalVisible(true);

        timer.current = setTimeout(() => {
            setStoryModalVisible(false)
        }, 5000)
    }

    const OpenRandomModel = (item) => {
        clearTimeout(MapOpenTimer.current);
        setTouchLocation(item?.geometry?.coordinates);
        setRandomAnimationVisible(true);

        MapOpenTimer.current = setTimeout(() => {
            setRandomAnimationVisible(false);
        }, 2000);
    }

    useEffect(() => {
        if (randomAnimationVisible) {
            lottieRef.current?.play();
        } else {
            lottieRef.current?.reset();
        }
    }, [randomAnimationVisible])

    const menuItems = (bottom, title, url, onPress) => {
        return (
            <TouchableOpacity style={[styles.menuItems, { bottom: bottom }]} onPress={onPress}>
                <Text style={styles.menuTitleText}>{title}</Text>
                <View style={styles.menuIconWrapper}>
                    <Image source={url} style={styles.menuIcon} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <Modal
                    transparent={true}
                    isVisible={modalVisible}
                    onRequestClose={() => {
                        setmodalVisible(false);
                    }}
                    swipeDirection='down'
                    onSwipeComplete={() => {
                        setmodalVisible(false);
                    }}
                    style={styles.modelWrapper}
                >
                    <View style={styles.mainSection}>
                        <TouchableOpacity style={styles.iconWrapper} onPress={() => { setmodalVisible(false) }} >
                            <Ionicons name={'close'} color={theme.textColor} size={25} />
                        </TouchableOpacity>
                        {menuItems(200, 'story', require('../../Images/add_story.png'), () => {
                            setmodalVisible(false)
                            // props.navigation.navigate('CreateReel', { action: 'story', coordinates: { latitude: coordinates[1], longitude: coordinates[0] } })
                        })}
                        {/* {menuItems(200, 'Future Visit', require('../../Images/send.png'), () => {
                            setmodalVisible(false)
                            props.navigation.navigate('AddFutureScreens')
                        })} */}
                        {menuItems(150, 'illustration', require('../../Images/location_icon.png'), () => {
                            setmodalVisible(false)
                            props.navigation.navigate('AddIlustrationScreens')
                        })}
                        <TouchableOpacity onPress={() => { setmodalVisible(false) }}>
                            <View style={{ height: 50, width: 50, justifyContent: 'center', borderRadius: 35, backgroundColor: Color.secondary, alignItems: 'center' }}>
                                <FontAwesome name={'minus'} color={'white'} size={20} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    transparent={true}
                    isVisible={storyModalVisible}
                    swipeDirection='down'
                    onSwipeComplete={() => {
                        clearTimeout(timer.current);
                        setStoryModalVisible(false);
                    }}
                    style={styles.modelWrapper}
                >
                    <View style={styles.storyWrapper}>
                        <Image source={storyImage} resizeMode='contain' style={styles.storyImages} />
                    </View>
                </Modal>
                <MapboxGL.MapView style={styles.map}
                    attributionEnabled={false}
                    logoEnabled={false}
                    zoomEnabled={true}
                    rotateEnabled={false}
                    styleURL={Platform.OS === "ios" ? null : 'mapbox://styles/whiteorigin/cl3v7g90e000715qsmjl7qvtl'}
                    onPress={(feature) => OpenRandomModel(feature)}
                >
                    <MapboxGL.Camera zoomLevel={10} centerCoordinate={coordinates} />
                    {/* <MapboxGL.ShapeSource id="line1" shape={route}>
                        <MapboxGL.HeatmapLayer
                                id="linelayer1" />
                </MapboxGL.ShapeSource> */}

                    {randomAnimationVisible && <MapboxGL.MarkerView
                        id={'first'}
                        coordinate={touchLocation}
                    >
                        <LottieView
                            ref={lottieRef}
                            style={styles.mapIcon}
                            source={require('../../assets/map_touch.json')}
                            autoPlay={true}
                            loop />
                    </MapboxGL.MarkerView>
                    }
                    {storiesList && storiesList.map((marker, index) => (
                        <MapboxGL.MarkerView
                            id={`${index}`} key={`${index}`}
                            coordinate={[marker?.longitude == null && marker?.longitude == "" && marker?.longitude !== "undefined" ? -122.43 : marker?.longitude ? parseFloat(marker?.longitude) : -122.43, marker?.latitude == null && marker?.latitude == "" && marker?.latitude !== "undefined" ? 37.78825 : marker?.latitude ? parseFloat(marker?.latitude) : 37.78825]}
                        >
                            <>
                                <TouchableOpacity style={[{ alignItems: "center" }, styles.elevationLow]} onPress={() => { OpenStoryModel(marker) }}>
                                    <Image style={styles.storyProfile} source={profileImage} />
                                </TouchableOpacity>
                                <Text style={styles.userNameText}>{marker?.author?.username}</Text>
                            </>
                        </MapboxGL.MarkerView>
                    )) && (futurevisitList.map((marker, index) => (
                        <MapboxGL.PointAnnotation
                            id={`${index}`} key={`${index}`}
                            coordinate={[marker?.longitude == null && marker?.longitude == "" && marker?.longitude !== "undefined" ? -122.43 : marker?.longitude ? parseFloat(marker?.longitude) : -122.43, marker?.latitude == null && marker?.latitude == "" && marker?.latitude !== "undefined" ? 37.78825 : marker?.latitude ? parseFloat(marker?.latitude) : 37.78825]}
                            title={marker?.caption}
                        >
                            <MapboxGL.Callout
                                title={marker?.caption}
                                style={{ minWidth: 200 }}
                            />
                        </MapboxGL.PointAnnotation>
                    )))}
                </MapboxGL.MapView>
                <View style={styles.headerSection}>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => { props.navigation.navigate('ProfileStack') }}><Image style={[styles.profileImages, { borderWidth: activeArrayLength === 0 ? 0 : 2 }]} source={profileImage} /></TouchableOpacity>
                        <TouchableOpacity onPress={() => { props.navigation.navigate('MapSearch') }} style={styles.searchWrapper}>
                            <FontAwesome style={styles.iconPosition} name={'search'} color={'#fff'} size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerWrapper}>
                        <Text style={styles.headerText}>mapline</Text>
                    </View>
                    {/* <View style={{ borderRadius: 10, borderColor: '#fff', borderWidth: 1, width: '60%', height: 30, alignSelf: 'center', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginHorizontal: 10 }}> */}
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.searchWrapper} onPress={() => { props.navigation.navigate('LocarnoaSettingsScreen') }}>
                            <Ionicons name={'md-settings-outline'} color={'#fff'} size={25} style={styles.iconPosition} />
                        </TouchableOpacity>
                        {/* <TextInput style={{ color: 'white', fontFamily: Constants.fontFamilyRegular, paddingLeft: 10 }} placeholderTextColor={'#B9B8BC'} placeholder={'search locations'} /> */}
                        {/* </View> */}
                    </View>
                </View>
                <View style={styles.bottomSection}>
                    <View style={styles.itemWrapper}>
                        <TouchableOpacity style={styles.tabSection} onPress={() => setSelectedOpt(0)}>
                            <View style={[styles.bottomIconWrapper, { borderColor: selectedOpt == 0 ? 'white' : null }]}>
                                <Image source={require('../../Images/build.png')} style={[styles.tabImage, { height: 50, width: 50, borderRadius: 25 }]} />
                            </View>
                            <View style={styles.tabTitleSection}>
                                <Text style={styles.tabTitleText} numberOfLines={1}>Places</Text>
                            </View>
                        </TouchableOpacity>
                        {/*<TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => setSelectedOpt(1)}>
							<View style={{ height: 50, width: 50, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignSelf: 'center' }}>
								<Image source={require('../../Images/ic_future_visit.png')} style={{ alignSelf: 'center', resizeMode: 'contain', width: 30, height: 30, tintColor: selectedOpt == 1 ? 'black' : Color.secondary }} />
							</View>
							<View style={{ borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', marginTop: -2 }}>
								<Text style={{ alignSelf: 'center', fontFamily: Constants.fontFamilySemiBold, fontSize: 12, paddingHorizontal: 5, includeFontPadding: false, color: 'black' }} numberOfLines={1}>Future Visit</Text>
							</View>
						</TouchableOpacity>*/}
                        <TouchableOpacity style={styles.tabSection} onPress={() => setSelectedOpt(2)}>
                            <View style={[styles.bottomIconWrapper, { borderColor: selectedOpt == 2 ? 'white' : null }]}>
                                <Image source={require('../../Images/ic_infinity.png')} style={styles.tabImage} />
                            </View>
                            <View style={styles.tabTitleSection}>
                                <Text style={styles.tabTitleText} numberOfLines={1}>Outlook</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { setmodalVisible(true) }} style={styles.tabSection} activeOpacity={0.8}
                        >
                            {modalVisible ?
                                <View style={[styles.bottomIconWrapper, { borderColor: modalVisible ? 'white' : null, backgroundColor: Color.secondary, alignItems: 'center' }]}>
                                    <FontAwesome name={'minus'} color={'white'} size={20} />
                                </View>
                                :
                                <Image source={require('../../Images/Plus_icon.png')} style={{
                                    height: 50,
                                    width: 50,
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    borderRadius: 35,
                                }} />
                            }

                            <View style={styles.tabTitleSection}>
                                <Text style={styles.tabTitleText} numberOfLines={1}>Create</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <TouchableOpacity onPress={() => { props.navigation.navigate('MessagingScreen') }} style={{ height: 45, width: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 30, backgroundColor: Color.secondary, position: 'absolute', right: 20, bottom: 80 }}>
                <Image source={require('../../Images/ic_chat.png')} style={{ resizeMode: 'contain', height: 25, width: 25 }} />
            </TouchableOpacity> */}


            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    modelWrapper: {
        margin: 0
    },
    mainSection: {
        flex: 1,
        opacity: 0.8,
        paddingHorizontal: 35,
        paddingBottom: 90,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: 'white'
    },
    iconWrapper: {
        position: 'absolute',
        left: 20,
        top: 50
    },
    menuItems: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 45,
        bottom: 250
    },
    menuTitleText: {
        fontSize: 18,
        fontWeight: '500',
        color: 'black',
        fontFamily: Constants.fontFamilyRegular,
        textAlign: 'center',
        textTransform: 'capitalize',
        marginHorizontal: 25
    },
    menuIcon: {
        height: 23,
        width: 23,
        alignSelf: 'center',
        resizeMode: 'contain',
        tintColor: Color.secondary
    },
    menuIconWrapper: {
        height: 35,
        width: 35,
        borderRadius: 17,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.7,
                shadowRadius: 2
            },
            android: {
                elevation: 15,
            },
        }),
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    buttonWrapper: {
        margin: 20
    },
    storyWrapper: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    storyImages: {
        aspectRatio: 1,
        paddingVertical: 12
    },
    headerSection: {
        flexDirection: 'row',
        position: 'absolute',
        width: "100%",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    row: {
        flexDirection: 'row'
    },
    profileImages: {
        height: 35,
        width: 35,
        borderRadius: 30,
        borderColor: Color.secondary
    },
    userNameText: {
        fontSize: 12,
        color: 'black'
    },
    searchWrapper: {
        height: 35,
        width: 35,
        marginLeft: 10,
        justifyContent: 'center',
        borderRadius: 35,
        backgroundColor: 'rgba(242, 242, 242, 0.3)'
    },
    iconPosition: {
        alignSelf: 'center'
    },
    headerWrapper: {
        height: 30
    },
    headerText: {
        fontSize: 20,
        fontFamily: Constants.fontFamilyBold,
        color: 'white'
    },
    bottomSection: {
        position: 'absolute',
        bottom: 10,
        width: '100%'
    },
    itemWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    tabSection: {
        justifyContent: 'center'
    },
    bottomIconWrapper: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 35,
        borderWidth: 3,
        backgroundColor: 'black'
    },
    tabImage: {
        width: 30,
        height: 30,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    tabTitleSection: {
        marginTop: -2,
        borderRadius: 35,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    tabTitleText: {
        alignSelf: 'center',
        fontFamily: Constants.fontFamilySemiBold,
        fontSize: 12,
        paddingHorizontal: 5,
        includeFontPadding: false,
        color: 'black'
    },
    map: {
        flex: 1,
    },
    mapIcon: {
        height: 150,
        width: 150
    },
    storyProfile: {
        height: 45,
        width: 45,
        borderRadius: 30,
        borderColor: Color.yellow,
        borderWidth: 2
    },
    elevationLow: {
        height: 48,
        width: 48,
        borderRadius: 40,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
            },
            android: {
                elevation: 15,
            },
        }),
    },
});

export default MapScreen;

