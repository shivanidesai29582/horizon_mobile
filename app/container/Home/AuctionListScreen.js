import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Image, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet, RefreshControl, DeviceEventEmitter } from 'react-native';
import Color from "../../common/Color";
import Entypo from "react-native-vector-icons/Entypo";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import Ionicons from "react-native-vector-icons/Ionicons";
import AuctionItem from "./Components/AuctionItem";
import CollectionItem from "./Components/CollectionItem";
import NftItem from "./Components/NftItem";
import { useDispatch, useSelector } from 'react-redux';
import { getTrendingAuction } from "./../../redux/auction";
import { getTrendingNfts } from "./../../redux/nft";
import { getTrendingCollection } from "./../../redux/collection"
import { useIsFocused } from '@react-navigation/native';
import global from '../../common/globals';
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useTheme } from './../../Context';

const AuctionListScreen = (props) => {
    const { theme } = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    const connector = useWalletConnect();

    const connectWallet = useCallback(() => {
        return connector.connect();
    }, [connector]);

    const killSession = useCallback(() => {
        return connector.killSession();
    }, [connector]);

    const shortenAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(
            address.length - 4,
            address.length
        )}`;
    };


    const dispatch = useDispatch();
    const [startFrom, setstartFrom] = useState(0);
    const recordSize = 10;
    const isFocused = useIsFocused();

    // const auctionList = useSelector((state) => state?.auction?.auctions);
    const trendingauctionList = useSelector((state) => state?.auction?.trending_auctions);

    // const nftsList = useSelector((state) => state?.nft?.nfts);
    const trendingnnftsList = useSelector((state) => state?.nft?.trending_nfts);

    // const collectionList = useSelector((state) => state?.collection?.collections);
    const trendingcollectionList = useSelector((state) => state?.collection?.trending_collections);

    const userinfo = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);

    const profileImage = { uri: userinfo?.profile_photo == null ? global.USER_PROFILE_URL : userinfo?.profile_photo };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(0);

    const activeArrayLength = userinfo?.stories?.filter((ele) => ele?.status === 'Active')?.length;

    useEffect(() => {

        // dispatch(getAuction());
        // dispatch(getCollection());
        // dispatch(getNfts(startFrom, recordSize));
        Reload();
    }, [isFocused]);

    useEffect(() => {
        DeviceEventEmitter.addListener('setHome', () => {
            onRefresh();
        });
    }, [1])


    const Reload = () => {
        dispatch(getTrendingCollection(startFrom, recordSize));
        dispatch(getTrendingNfts(startFrom, recordSize));
        dispatch(getTrendingAuction(startFrom, recordSize));
    }

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Reload();
        wait(2000).then(() =>
            setRefreshing(false));
    }, []);

    const HeaderComponet = () => {


        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>

                    <TouchableOpacity onPress={() => { props.navigation.openDrawer() }} style={{ height: 35, width: 35, borderRadius: 35, justifyContent: 'center', borderColor: Color.secondary, borderWidth: activeArrayLength === 0 ? 0 : 2 }}>
                        <Image style={{ height: 30, width: 30, borderRadius: 35, alignSelf: 'center' }} source={profileImage} />
                    </TouchableOpacity>

                    <Ionicons name={'search'} color={theme.activeIcon} size={29} style={{ alignSelf: 'center', marginHorizontal: 13 }} onPress={() => { props.navigation.navigate('SearchScreen') }} />

                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    {/* <LottieView
                        source={require('./../../assets/loader.json')}
                        autoPlay={true}
                        loop
                        style={{ height: 40 , justifyContent: 'center'}}>
                        <Image source={require('../../Images/ic_splash_logo.png')} style={{alignSelf:'center', resizeMode: 'contain', height: 30, width: 30 }} />
                    </LottieView> */}
                    <Image source={require('../../Images/ic_splash_logo.png')} style={{ alignSelf: 'center', resizeMode: 'contain', height: 30, width: 30 }} />

                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>

                    {/* <View style={{ flexDirection: 'row', marginRight: 10 }}>
                        <SimpleLineIcons name={'bell'} color={theme.activeIcon} size={25} style={{ alignSelf: 'center', marginHorizontal: 6 }} onPress={() => { props.navigation.navigate('UserNotificationsScreen') }} />
                        <MaterialCommunityIcons name={'theme-light-dark'} color={theme.activeIcon} size={25} style={{ alignSelf: 'center', marginHorizontal: 6 }} onPress={() => { changeTheme() }} />
                    </View> */}
                    <TouchableOpacity onPress={() => { props.navigation.navigate("MessagingStack", { screen: "MessagingScreen", merge: true }) }} style={{ height: 30, width: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../../Images/ic_chat.png')} style={{ resizeMode: 'contain', height: 29, width: 29, tintColor: theme.activeIcon }} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{ marginHorizontal: 5, justifyContent: 'center', alignItems: 'center', }}>
                        <Image source={require('../../Images/addIconHomewhite.png')} style={{ height: 30, width: 30 }} />
                    </TouchableOpacity> */}

                </View>

            </View>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

            {HeaderComponet()}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >

                <View style={{ backgroundColor: theme.backgroundColor, flex: 1, justifyContent: 'center' }}>
                    <TouchableOpacity style={{ position: 'absolute', left: 20, top: 50 }} onPress={() => {
                        setModalVisible(false);
                    }} >
                        <Ionicons name={'close'} color={theme.activeIcon} size={25} />

                    </TouchableOpacity>


                    <Button1Component onPress={() => {
                        setModalVisible(false);

                        props.navigation.navigate('CreateNFTScreen')
                    }} title={'Create NFT'} extraviewstyle={{ margin: 20 }} />


                    <Button1Component onPress={() => {
                        setModalVisible(false);

                        props.navigation.navigate('CreateCollectionScreen')
                    }} title={'Create Collection'} extraviewstyle={{ margin: 20 }} />


                    <Button1Component onPress={() => {
                        !connector.connected ? connectWallet() : killSession()
                        setModalVisible(false);
                    }} title={!connector.connected ? "Connect a wallet" : shortenAddress(connector.accounts[0])} extraviewstyle={{ margin: 20 }} />


                    <Button1Component onPress={() => {
                        setModalVisible(false);
                        props.navigation.navigate('CreateAuctionScreen')
                    }} title={'Create Auction'} extraviewstyle={{ margin: 20 }} />



                    {/* <LinearGradient colors={['#fd3232', '#c51919', '#970404']}
                        style={[{ marginTop: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 20, backgroundColor: Color.secondary, justifyContent: 'center', alignItems: "center", flexDirection: 'row', margin: 20 }]}> */}

                    {/* <Button1Component onPress={() => {
                        setModalVisible(false);
                        props.navigation.navigate('GamesScreen');
                    }} title={'Play Games'} extraviewstyle={{ margin: 20 }} /> */}

                    {/* <TouchableOpacity onPress={() => {
                            setModalVisible(false);
                            props.navigation.navigate('GamesScreen')
                        }}>
                            <Text style={[{ fontFamily: Constants.fontFamilyMedium, marginHorizontal: 30, color: "#fff", fontSize: 18, margin: 5 }]}>
                                Play Games
                            </Text>

                        </TouchableOpacity>

                    </LinearGradient> */}





                </View>


            </Modal>
            {/* <View style={{ borderRadius: 10, borderColor: '#fff', borderWidth: 1, width: '80%', alignSelf: 'center', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginVertical: 20 }}>

                    <TextInput style={{ flex: 1, color: 'white', fontFamily: Constants.fontFamilyRegular, paddingRight: 10 }} placeholderTextColor={'#B9B8BC'} placeholder={'Search keywords'} />
                    <Ionicons name={'search'} color={'#fff'} size={20} />
                </View> */}


            <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}
                nestedScrollEnabled
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.textColor}
                    />
                }>
                {/* <FlatList data={categories} horizontal={true} renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity onPress={() => { setSelectedCategory(index) }} style={index == selectedCategory ? { borderWidth: 3, borderColor: '#B04041', backgroundColor: Color.secondary, borderRadius: 15 } : { backgroundColor: Color.primary, borderWidth: 3 }}>
                            <Text style={{ paddingHorizontal: 20, fontFamily: Constants.fontFamilyMedium, fontSize: 12, paddingVertical: 5, includeFontPadding: false, color: 'white' }}>{item}</Text>
                        </TouchableOpacity>
                    )
                }} /> */}


                {/* Collection */}
                <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 20, marginBottom: 10, paddingVertical: 5, includeFontPadding: false, color: theme.textColor }}>Trending Collection</Text>

                <FlatList data={trendingcollectionList} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item, index }) => {
                    return (
                        <CollectionItem onPress={() => { props.navigation.navigate('CollectionProfileScreen', { item }) }} item={item} />
                    )
                }} />

                {/* auction */}
                <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 20, marginVertical: 10, paddingVertical: 5, includeFontPadding: false, color: theme.textColor }}>Trending Auctions</Text>

                <FlatList data={trendingauctionList} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item, index }) => {
                    return (
                        <AuctionItem onPress={() => { props.navigation.navigate('AuctionDetailScreen', { item }) }} item={item} />
                    )
                }} />

                {/* nft */}

                <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 20, marginVertical: 10, paddingVertical: 5, includeFontPadding: false, color: theme.textColor }}>Trending NFT</Text>

                <FlatList data={trendingnnftsList} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item, index }) => {
                    return (
                        <NftItem onPress={() => { props.navigation.navigate('NFTDetailScreen', { item }) }} item={item} />
                    )
                }} />
            </ScrollView>

            <TouchableOpacity onPress={() => { props.navigation.navigate('CreateScreen') }} style={{ position: 'absolute', height: 55, width: 55, justifyContent: 'center', alignItems: 'center', borderRadius: 30, backgroundColor: Color.secondary, position: 'absolute', right: 20, bottom: 10 }}>
                <Entypo name={'plus'} color={'white'} size={35} style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({

});

export default AuctionListScreen;
