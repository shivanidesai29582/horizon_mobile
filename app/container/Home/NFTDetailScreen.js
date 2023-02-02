import React, { useState, useEffect } from 'react';
import {
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Animated,
    Dimensions,
    Linking
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';
import moment from 'moment';
import Color from "../../common/Color";
import LoginHeader from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import ButtonComponent from "../../Components/ButtonComponent";
import BidItem from "./Components/BidItem";
import { getByIdNfts, addViewNfts } from "../../redux/nft";
import { useTheme } from './../../Context';
import global from "../../common/globals";
import NoDataScreen from '../NoDataScreen';
const { event, ValueXY } = Animated;
const deviceWidth = Dimensions.get("window").width;
import Share from 'react-native-share';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const NFTDetailScreen = (props) => {
    const { theme } = useTheme();

    const dispatch = useDispatch();

    const nftData = useSelector((state) => state?.nft?.nft);
    let currentLoggeduser = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
    const currentLogedUser = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    let currentLogedUserID = currentLogedUser?.id;

    const OnEdit = () => {
        setIsMoreModalVisible(false);
        if (props) {
            props.navigation.navigate('CreateScreen', { item: props?.route?.params?.item })
        }
    }

    const bidData = nftData != null ? nftData?.bids : [];

    const collectionData = nftData !== null && nftData?.collection !== null && nftData?.length === undefined ? nftData?.collection[0] : [];
    const authorData = nftData != null ? nftData?.author : [];

    useEffect(() => {

        dispatch(getByIdNfts({ id: props?.route?.params?.item?.id }))
        dispatch(addViewNfts({ id: props?.route?.params?.item?.id }))

    }, [props?.route?.params?.item?.id]);

    const [parallaxHeight, setParallaxHeight] = useState(400);
    const [contentHeight, setContentHeight] = useState({});
    const [reachedEnd, setReachedEnd] = useState(false);
    const nodes = new Map();
    const scrollY = new ValueXY();

    const onLayout = (e) => {
        setParallaxHeight(e.nativeEvent.layout.height);
    }

    const setHeaderSize = () => null;

    const renderHeader = () => (
        <View />
    );

    // console.log("*********** nftData", nftData);


    const buildLink = async () => {

        const link = await dynamicLinks().buildShortLink({
            link: `${global.DEEPLINKING_URL}/${global.DEEPLINKING_NFT}/${props?.route?.params?.item?.id}`,
            domainUriPrefix: 'https://horizonbird.page.link',
            android: { packageName: 'com.whiteorigin.horizon' },
            // ios: { bundleId: '' }

        });

        let options = {
            title: 'Horizon',
            message: `Check out this awesome NFT from ${link}`
        }
        Share.open(options)
            .then((res) => {
                setIsMoreModalVisible(false);
            })
            .catch((err) => {
                setIsMoreModalVisible(false);
            });

    }


    const setreachedEnd = (value) => {
        setReachedEnd(value);
    }

    const onLayoutContent = (e, title) => {
        const contentHeightTmp = { ...contentHeight };
        contentHeightTmp[title] = e.nativeEvent.layout.height;
        setContentHeight({ ...contentHeightTmp });
    };

    const renderItem = (ic_name, title, onpress) => {
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <FontAwesome5 name={ic_name} color={Color.placeHolderGrey} size={18} />
                    <Text style={{ fontFamily: Constants.fontFamilyBold, fontSize: 16, color: theme.textColor, paddingLeft: 8 }}>{onpress}</Text>
                </View>
                <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 14, color: Color.placeHolderGrey }}>{title}</Text>
            </View>
        )
    }

    const renderForeground = () => {
        const [startTitleFade, finishTitleFade] = [440, 445];

        const titleOpacity = scrollY.y.interpolate({
            inputRange: [0, startTitleFade, finishTitleFade],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        return (<Animated.View style={{ opacity: titleOpacity }} onLayout={onLayout}>
            <View style={{}}>

                <Image source={{ uri: nftData?.image_url == null ? global.COLLECTION_IMAGE_URL2 : nftData?.image_url }} style={{ width: '95%', alignSelf: 'center', borderRadius: 20, height: undefined, aspectRatio: 1.2, marginVertical: 10 }} />

                <View style={{ backgroundColor: theme.modalBackgroundColor, padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: Constants.fontFamilyBold, fontSize: 22, includeFontPadding: false, color: theme.textColor }}>{nftData?.name}</Text>
                        <ButtonComponent onPress={() => { buildLink() }} extraviewstyle={{ alignSelf: 'center', backgroundColor: Color.secondary, borderRadius: 10, marginBottom: 5 }} extratextstyle={{ paddingVertical: 2 }} title={"Share"} />
                    </View>
                    <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 14, includeFontPadding: false, color: Color.placeHolderGrey }}>{nftData?.description}</Text>
                    {/* <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 14, includeFontPadding: false, color: '#B9B8BC' }}>{moment(nftData?.created_at).format('MMM DD, YYYY HH:mm:ss')}</Text> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, marginHorizontal: 5, marginTop: 10, borderRadius: 20, borderWidth: 1, borderColor: Color.placeHolderGrey }}>
                        {renderItem('heart', 'favorites', nftData.total_view)}
                        {renderItem('user-friends', 'owners', nftData.total_view)}
                        {renderItem('eye', 'visitors', nftData.total_view)}
                    </View>
                </View>
            </View>
        </Animated.View >)

    }

    const renderContent = () => {

        return (
            <View style={{ height: '80%', width: "100%", }}>
                <NoDataScreen isVisible={(!bidData || bidData.length === 0)} message="Looks like Bidding has not started yet." />
            </View>
        );
    };

    const infoField = (title, value) => {
        return (
            <View style={{ flexDirection: 'row', paddingVertical: 3 }} >
                <View>
                    <Text numberOfLines={1} style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 14, marginLeft: 5, width: 90, maxWidth: 120 }}>{title}</Text>
                </View>
                <Entypo name={'dots-two-vertical'} color={Color.textColor} size={14} />
                <View>
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyMedium, fontSize: 14, marginLeft: 20 }}>{value}</Text>
                </View>
            </View>
        )
    }

    const renderInfo = (title) => {

        return (
            <View style={{ backgroundColor: theme.modalBackgroundColor, height: "100%", flexDirection: "row", paddingTop: 10 }} onLayout={e => onLayoutContent(e, title)}>
                <View style={{ marginHorizontal: 15, flex: 1 }}>
                    <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 16, color: theme.textColor, marginBottom: 10 }}>Edition : {nftData?.edition}</Text>
                    <>
                        {infoField('Size', nftData?.size == null ? "500x500" : authorData?.size)}
                        {infoField('Created', moment(nftData?.created_at).format('MMM DD, YYYY HH:mm:ss'))}
                        {infoField('Collection', collectionData?.collection_name)}
                        {infoField('Category', 'Not Assign')}
                        {infoField('Total Likes', nftData?.total_like)}
                    </>
                </View>
            </View>
        );
    };

    const renderOwners = (title) => {

        return (
            <View style={{ backgroundColor: theme.modalBackgroundColor, height: "100%", flexDirection: "row", paddingTop: 10 }} onLayout={e => onLayoutContent(e, title)}>
                <View style={{ marginHorizontal: 15, flex: 1 }}>
                    <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 16, color: theme.textColor, marginBottom: 10 }}>Creator</Text>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { props.navigation.navigate('UserProfile', { item: authorData }) }}>
                        <Image source={{ uri: authorData?.profile_photo == null ? global.USER_PROFILE_URL : authorData?.profile_photo }} style={{ width: 30, height: 30, aspectRatio: 1, borderRadius: 15, alignSelf: 'center' }} resizeMode='contain' />
                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyMedium, fontSize: 14, alignSelf: 'center', marginLeft: 5 }}>{authorData?.username}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 15, flex: 1 }}>
                    <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 16, color: theme.textColor, marginBottom: 10 }}>Collection</Text>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { props.navigation.navigate('CollectionProfileScreen', { item: collectionData }) }}>
                        <Image source={{ uri: collectionData?.collection_logo_image == null ? global.USER_PROFILE_URL : collectionData?.collection_logo_image }} style={{ width: 30, height: 30, aspectRatio: 1, borderRadius: 15, alignSelf: 'center' }} resizeMode='contain' />
                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyMedium, fontSize: 14, alignSelf: 'center', marginLeft: 5 }}>{collectionData?.collection_name}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderBids = (title) => {
        return (
            <View style={{ height: '80%', width: "100%", alignItems: 'center', justifyContent: 'center' }}>
                <NoDataScreen isVisible={(!bidData || bidData.length === 0)} message="Looks like Bidding has not started yet." />
                <View style={{ paddingTop: 10, paddingHorizontal: 15 }} onLayout={e => onLayoutContent(e, title)}>
                    {bidData?.map((item) => { return (<BidItem item={item} />) })}
                </View>
            </View >
        );
    };


    const routes = [
        { title: 'Info', content: renderInfo('Info'), },
        { title: 'Owners', content: renderOwners('Owners') },
        { title: 'History', content: renderContent('History') },
        { title: 'Bids', content: renderBids('Bids') }];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <LoginHeader onBackPress={() => {
                props.navigation.pop()
            }} />
            {currentLogedUserID &&
                <TouchableOpacity style={{ position: 'absolute', right: 5, top: 5, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                    setIsMoreModalVisible(true)
                }}>
                    <Entypo name={'dots-three-vertical'} color={theme.textColor} size={18} />
                </TouchableOpacity>
            }
            <Modal
                transparent={true}
                isVisible={isMoreModalVisible}
                onRequestClose={() => {
                    setIsMoreModalVisible(false);
                }}
                onBackdropPress={() => {
                    setIsMoreModalVisible(false);
                }}
                style={{
                    margin: 0,
                    bottom: 0,
                    position: 'absolute',
                    width: '100%',
                    backgroundColor: 'transparent',
                    backfaceVisibility: 'visible'
                }}>
                <View style={{ backgroundColor: theme.modalBackgroundColor, borderTopRightRadius: 20, borderTopLeftRadius: 20, }}>
                    <View style={{ marginTop: 10, flex: 1 }}>
                        <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnEdit() }}>
                            <Ionicons name={'pencil'} color={theme.textColor} size={22} style={{ marginRight: 5 }} />
                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }}>
                            <Ionicons name={'ios-trash-outline'} color={theme.deletetextColor} size={25} style={{ marginRight: 5 }} />
                            <Text style={{ color: theme.deletetextColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {(!nftData || nftData.length === 0) ?
                <NoDataScreen isVisible={(!nftData || nftData.length === 0)} message="Looks like you dont't search anything yet." />
                :
                <StickyParallaxHeader
                    foreground={renderForeground()}
                    header={renderHeader()}
                    tabs={routes}
                    deviceWidth={deviceWidth}
                    parallaxHeight={parallaxHeight}
                    scrollEvent={event([{ nativeEvent: { contentOffset: { y: scrollY.y } } }], {
                        useNativeDriver: false,
                    })}
                    decelerationRate='normal'
                    onEndReached={() => { setReachedEnd(true) }}
                    onEndReachedThreshold={0.5}
                    snapStartThreshold={20}
                    snapStopThreshold={40}
                    snapValue={5}
                    headerSize={setHeaderSize}
                    headerHeight={0}
                    tabUnderlineColor={Color.secondary}
                    tabsContainerStyle={styles(theme).tabBar}
                    tabTextStyle={styles(theme).tabText}
                    tabTextContainerStyle={styles(theme).tabContainer}
                    tabsWrapperStyle={styles(theme).tabsWrapper} />

            }

            <ButtonComponent onPress={() => {
                Linking.openURL(`https://metamask.app.link/dapp/marketplace.whiteorigin.in/nft/${props?.route?.params?.item?.id}`)
            }} extraviewstyle={{ position: "absolute", bottom: 10, width: '30%', alignSelf: 'center', backgroundColor: Color.yellow, borderRadius: 30, justifyContent: 'center', }} extratextstyle={{ fontSize: 18, color: 'black', paddingVertical: 5 }} title={"Open"} />


        </SafeAreaView>
    );
}

const styles = (theme) => StyleSheet.create({
    droupdownText: {
        fontFamily: Constants.fontFamilyRegular,
        color: '#FFFFFF',
        fontSize: 13
    },
    iosDropUpDownStyle: {
        height: 48,
        width: '100%',
        padding: 15,
        borderRadius: 10,
    },
    androidDropUpDownStyle: {
        height: 48,
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
    },
    tabBar: {
        backgroundColor: theme.modalBackgroundColor,
        width: '100%',
        margin: 0
    },
    tabText: {
        paddingHorizontal: 18,
        color: theme.textColor,
        fontSize: 14,
        fontWeight: "700",
        lineHeight: 19.07
    },
    tabsWrapper: {
        flex: 1
    },
    profileSection: {
        backgroundColor: "white",
        flexDirection: 'column',
        alignItems: 'center',
    },
    tabContainer: {
        borderBottomColor: '#f4f4f4',
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        flexDirection: 'column'
    },
    noData: {
        fontSize: 14,
        textAlign: 'center',
    },
    addPostIcon:
    {
        marginTop: 50,
        alignItems: 'center'
    }
});
export default NFTDetailScreen;
