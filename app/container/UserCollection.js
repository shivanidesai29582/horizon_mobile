import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, TouchableOpacity, View, Dimensions, FlatList, Image } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedPost } from "../redux/post";
import { getSavedReels } from "../redux/reels";
import global from '../common/globals';
import Constants from "../common/Constants";
import { useTheme } from '../Context';
import Color from "../common/Color";
import NoDataScreen from './NoDataScreen';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Ionicons from "react-native-vector-icons/Ionicons";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const UserCollection = (props) => {
    // Theme & dispatch
    const { theme, updateTheme } = useTheme();
    const dispatch = useDispatch();

    const [showPostScalitonLoader, setShowPostScalitonLoader] = useState(false); //Post Loader
    const [showReelsScalitonLoader, setShowReelsScalitonLoader] = useState(false); // Reel Loader

    //state & dispatch
    let currentLoggeduser = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const [startFrom, setstartFrom] = useState(1);
    const PostsArray = useSelector((state) => state?.post?.savedposts);
    const ReelsArray = useSelector((state) => state?.reels?.savedreels);

    useEffect(() => {
        Reload();
    }, []);


    const Reload = () => {
        dispatch(getSavedPost(currentLoggeduser?.id, startFrom));
        dispatch(getSavedReels(currentLoggeduser?.id, startFrom));
    }

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    //Scaliton Loader Design
    const addLoader = () => {
        const loaderMarginTop = 10;
        const loaderMarginLeft = 5;
        const loaderBorderRadius = 15;
        const loaderSmallBoxHeight = 150;
        const loaderLargeBoxHeight = 280;
        return (
            <View style={{ height: windowHeight }}>
                <SkeletonPlaceholder backgroundColor='#777' highlightColor='#999' speed={1000}>
                    <SkeletonPlaceholder.Item flexDirection="row" flexWrap='wrap' alignItems="flex-start">
                        <SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} width={(windowWidth / 2) - 10} >
                            <SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} height={loaderSmallBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} marginTop={loaderMarginTop} height={loaderLargeBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} marginTop={loaderMarginTop} height={loaderSmallBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} width={(windowWidth / 2) - 10} >
                            <SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} height={loaderLargeBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} marginTop={loaderMarginTop} height={loaderSmallBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} marginTop={loaderMarginTop} height={loaderLargeBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </View>
        )
    }

    const PostComponent = () => {

        return (
            <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
                {showPostScalitonLoader && addLoader()}
                {
                    (!PostsArray || PostsArray.length === 0) ?
                        <NoDataScreen isVisible={(!PostsArray || PostsArray.length === 0)} message="Looks like you dont't search anything yet." />
                        :
                        <FlatList
                            horizontal={false}
                            numColumns={2}
                            data={PostsArray}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (<TouchableOpacity onPress={() => { props.navigation.navigate('PostDetailScreen', { item }) }} style={{ height: "100%", width: (windowWidth / 2) - 4, margin: 2 }}>
                                    <Image style={{ height: (windowWidth / 2), width: (windowWidth / 2), aspectRatio: 1 }} source={{ uri: item?.file_url == null ? global.COLLECTION_IMAGE_URL2 : item?.file_url }} onPress={() => { props.navigation.navigate('HomeScreen', { item }) }} />
                                </TouchableOpacity>)
                            }}
                        />
                }
            </View>
        );
    };


    const ReelsComponent = () => {
        return (
            <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
                {showReelsScalitonLoader && addLoader()}
                {
                    (!ReelsArray || ReelsArray.length === 0) ?
                        <NoDataScreen isVisible={(!ReelsArray || ReelsArray.length === 0)} message="Looks like you dont't search anything yet." />
                        :
                        <FlatList
                            horizontal={false}
                            numColumns={2}
                            data={ReelsArray}
                            renderItem={({ item, index }) => {
                                return (
                                    <Image resizeMode='cover' style={{ height: 400, width: (windowWidth / 2) - 4, margin: 2 }} source={{ uri: item?.thumbnail_url == null ? global.COLLECTION_IMAGE_URL2 : item?.thumbnail_url }} />
                                )
                            }} />
                }
            </View>
        )
    }

    const renderScene = SceneMap({
        Post: PostComponent,
        Reel: ReelsComponent
    });

    const [index, setIndex] = useState(0);

    function changeTabIndex(ind) {
        if (ind == 0) {
            setShowPostScalitonLoader(true);
            wait(2000).then(() => {
                setShowPostScalitonLoader(false)
            });
        }
        else if (ind == 1) {
            setShowReelsScalitonLoader(true);
            wait(2000).then(() => {
                setShowReelsScalitonLoader(false)
            });

        }

        setIndex(ind);
    }

    const [routes] = useState([
        { key: 'Post', image: require("./../Images/home.png") },
        { key: 'Reel', image: require("./../Images/reel.png") },
    ]);

    const renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {props.navigationState.routes.map((route, i) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex) => (
                            inputIndex === i ? 1 : 0.6
                        )),
                    });

                    return (
                        <TouchableOpacity
                            style={{ alignItems: 'center', width: 80, marginBottom: 20 }}
                            activeOpacity={0.8}
                            onPress={() => changeTabIndex(i)}
                        >
                            <View style={{ paddingBottom: 2, borderBottomWidth: 3, borderBottomColor: props.navigationState.index == i ? Color.secondary : 'transparent' }}>
                                <Image source={route.image} style={{ alignSelf: 'center', resizeMode: 'contain', height: 20, width: 20, tintColor: theme.textColor }} />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, width: '100%', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => {
                    props.navigation.pop()
                }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: '#9F9696', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />

                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 20, textAlign: 'center' }}>Your Saved data</Text>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row", marginTop: 15 }}>
                <TabView
                    tabBarPosition='top'
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={changeTabIndex}
                    renderTabBar={renderTabBar}
                />
            </View>
        </SafeAreaView>
    );

}

export default UserCollection;
