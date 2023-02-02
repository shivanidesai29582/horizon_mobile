import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import LinearGradient from "react-native-linear-gradient";
import globals from "./../../common/globals"
import { putUserPreference } from "./../../redux/userlogin"
import { useDispatch } from 'react-redux';
import { useTheme } from './../../Context';
import Color from '../../common/Color';

const CollectionsScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const [collectionList, setCollectionList] = useState([]);
    const [loading, setLoading] = useState(false);


    const __isAvailable = (boxName) => {
        return collectionList.findIndex((ele) => ele === boxName) > -1;
    }

    const __isAdded = (boxName) => {
        const oldData = [...collectionList];

        if (__isAvailable(boxName) == false) {
            oldData.push(boxName);
        } else {
            oldData.splice(collectionList.findIndex((ele) => ele === boxName), 1)
        }
        setCollectionList(oldData);
    }


    const exploreHorizon = () => {
        setLoading(true);
        dispatch(putUserPreference(collectionList)).then(() => {
            setLoading(false);
            props.navigation.navigate('HomeStack')
        });
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <Header title={'Collection'} onBackPress={() => {
                props.navigation.pop()
            }}
                isShownBack={false}
                isShownSearch={false} />
            <ScrollView >
                <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 30 }}>
                    <View style={{ flex: 1, marginHorizontal: 10 }}>

                        {/* Art */}

                        <TouchableOpacity style={{ backgroundColor: __isAvailable('Art') == true ? Color.secondary : 'transparent', borderRadius: 10, marginBottom: 8 }} onPress={() => { __isAdded('Art') }}>
                            <Image source={{ uri: globals.ART_IMAGE_URL }} style={{ width: '100%', height: undefined, aspectRatio: 0.55, marginVertical: 10, borderRadius: 10 }} />
                            <LinearGradient style={{ position: 'absolute', borderTopLeftRadius: 10, bottom: 10, left: 0, right: 0, justifyContent: 'center', backgroundColor: '#000' }} start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} colors={['#9130DC', 'rgba(225,225,225,0.2)']}>
                                <Text style={{ color: '#ffffff', fontFamily: Constants.fontFamilyRegular, marginLeft: 10, fontSize: 12 }}>Art</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Virtual Worlds */}

                        <TouchableOpacity onPress={() => { __isAdded('Virtual Worlds') }} style={{ backgroundColor: __isAvailable('Virtual Worlds') == true ? Color.secondary : 'transparent', borderRadius: 10, marginBottom: 8 }}>
                            <Image source={{ uri: globals.VIRTUAL_WORLD_IMAGE_URL }} style={{ width: '100%', height: undefined, aspectRatio: 0.844, marginVertical: 10, borderRadius: 10 }} />

                            <LinearGradient style={{ position: 'absolute', borderTopLeftRadius: 10, bottom: 10, left: 0, right: 0, justifyContent: 'center', backgroundColor: '#000' }} start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} colors={['#9130DC', 'rgba(225,225,225,0.2)']}>
                                <Text style={{ color: '#ffffff', fontFamily: Constants.fontFamilyRegular, marginLeft: 10, fontSize: 12 }}>Virtual Worlds</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Collectibles */}

                        <TouchableOpacity onPress={() => { __isAdded('Collectibles') }} style={{ backgroundColor: __isAvailable('Collectibles') == true ? Color.secondary : 'transparent', borderRadius: 10, marginBottom: 8 }}>
                            <Image source={{ uri: globals.COLLECTION_IMAGE_URL }} style={{ width: '100%', height: undefined, aspectRatio: 1.11, marginVertical: 10, borderRadius: 10 }} />

                            <LinearGradient style={{ position: 'absolute', borderTopLeftRadius: 10, bottom: 10, left: 0, right: 0, justifyContent: 'center', backgroundColor: '#000' }} start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} colors={['#9130DC', 'rgba(225,225,225,0.2)']}>
                                <Text style={{ color: '#ffffff', fontFamily: Constants.fontFamilyRegular, marginLeft: 10, fontSize: 12 }}>Collectibles</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Domains */}

                        <TouchableOpacity onPress={() => { __isAdded('Domains') }} style={{ backgroundColor: __isAvailable('Domains') == true ? Color.secondary : 'transparent', borderRadius: 10, marginBottom: 8 }}>
                            <Image source={{ uri: globals.DOMAINS_IMAGE_URL }} style={{ width: '100%', height: undefined, aspectRatio: 1.11, marginVertical: 10, borderRadius: 10 }} />

                            <LinearGradient style={{ position: 'absolute', borderTopLeftRadius: 10, bottom: 10, left: 0, right: 0, justifyContent: 'center', backgroundColor: '#000' }} start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} colors={['#9130DC', 'rgba(225,225,225,0.2)']}>
                                <Text style={{ color: '#ffffff', fontFamily: Constants.fontFamilyRegular, marginLeft: 10, fontSize: 12 }}>Domains</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                    <View style={{ flex: 1, marginHorizontal: 10 }}>

                        {/* Music */}
                        <TouchableOpacity onPress={() => { __isAdded('Music') }} style={{ backgroundColor: __isAvailable('Music') == true ? Color.secondary : 'transparent', borderRadius: 10, marginBottom: 8 }}>
                            <Image source={{ uri: globals.MUSIC_IMAGE_URL }} style={{ width: '100%', height: undefined, aspectRatio: 0.844, marginVertical: 10, borderRadius: 10 }} />

                            <LinearGradient style={{ position: 'absolute', borderTopLeftRadius: 10, bottom: 10, left: 0, right: 0, justifyContent: 'center', backgroundColor: '#000' }} start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} colors={['#9130DC', 'rgba(225,225,225,0.2)']}>
                                <Text style={{ color: '#ffffff', fontFamily: Constants.fontFamilyRegular, marginLeft: 10, fontSize: 12 }}>Music</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Games */}
                        <TouchableOpacity onPress={() => { __isAdded('Games') }} style={{ backgroundColor: __isAvailable('Games') == true ? Color.secondary : 'transparent', borderRadius: 10, marginBottom: 8 }}>
                            <Image source={{ uri: globals.GAMES_IMAGE_URL }} style={{ width: '100%', height: undefined, aspectRatio: 0.80, marginVertical: 10, borderRadius: 10 }} />

                            <LinearGradient style={{ position: 'absolute', borderTopLeftRadius: 10, bottom: 10, left: 0, right: 0, justifyContent: 'center', backgroundColor: '#000' }} start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} colors={['#9130DC', 'rgba(225,225,225,0.2)']}>
                                <Text style={{ color: '#ffffff', fontFamily: Constants.fontFamilyRegular, marginLeft: 10, fontSize: 12 }}>Games</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Meme */}
                        <TouchableOpacity onPress={() => { __isAdded('Meme') }} style={{ backgroundColor: __isAvailable('Meme') == true ? Color.secondary : 'transparent', borderRadius: 10, marginBottom: 8 }}>
                            <Image source={{ uri: globals.MEME_IMAGE_URL }} style={{ width: '100%', height: undefined, aspectRatio: 0.67, marginVertical: 10, borderRadius: 10 }} />

                            <LinearGradient style={{ position: 'absolute', borderTopLeftRadius: 10, bottom: 10, left: 0, right: 0, justifyContent: 'center', backgroundColor: '#000' }} start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} colors={['#9130DC', 'rgba(225,225,225,0.2)']}>
                                <Text style={{ color: '#ffffff', fontFamily: Constants.fontFamilyRegular, marginLeft: 10, fontSize: 12 }}>Meme</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* NFT Gifts */}
                        <TouchableOpacity onPress={() => { __isAdded('NFT Gifts') }} style={{ backgroundColor: __isAvailable('NFT Gifts') == true ? Color.secondary : 'transparent', borderRadius: 10, marginBottom: 8 }}>
                            <Image source={{ uri: globals.NFT_GIFT_IMAGE_URL }} style={{ width: '100%', height: undefined, aspectRatio: 0.67, marginVertical: 10, borderRadius: 10 }} />

                            <LinearGradient style={{ position: 'absolute', borderTopLeftRadius: 10, bottom: 10, left: 0, right: 0, justifyContent: 'center', backgroundColor: '#000' }} start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} colors={['#9130DC', 'rgba(225,225,225,0.2)']}>
                                <Text style={{ color: '#ffffff', fontFamily: Constants.fontFamilyRegular, marginLeft: 10, fontSize: 12 }}>NFT Gifts</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Button1Component visible={loading} onPress={() => {
                    exploreHorizon();
                }} title={'Explore Horizon'} extraviewstyle={{ width: '60%' }} />
            </View>
        </SafeAreaView>
    );
}

export default CollectionsScreen;
