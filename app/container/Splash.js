import React, { useState, useEffect } from 'react';
import { Image, Text, View, Platform, Linking } from 'react-native';
import Color from "../common/Color";
import { get, set } from '../storage';
import { toast } from '../Omni';
import { useDispatch } from 'react-redux';
import { userAuth } from './../redux/userlogin'
import { request, PERMISSIONS } from 'react-native-permissions';
import SplashScreen from 'react-native-splash-screen'
import { useTheme } from './../Context';
import axios from 'axios';
import global from "./../common/globals";
import dynamicLinks from '@react-native-firebase/dynamic-links';


const AppIntro = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    [firstRun, setFirstRun] = useState(null);
    [userInfo, setUserInfo] = useState(null);
    [userToken, setUserToken] = useState(null);
    [ispreference, setIspreference] = useState(false);
    const data = { os: Platform.OS, version: 0 }

    useEffect(() => {

        Platform.OS !== "ios" ? SplashScreen.hide() : null;
        request(Platform.OS === 'ios' ? null : PERMISSIONS.ANDROID.CAMERA)

        dynamicLinks()
            .getInitialLink()
            .then(link => {
                if (link) {
                    DeepLinking(link.url);
                } else {
                    First();
                }
            });
    }, []);


    const First = async () => {
        await axios.post(`${global.HORIZON_BASE_URL}/Version/check_version`, data
        ).then((response) => {
            let forceUpdate = response?.data?.data?.forceUpdate;
            let needUpdate = response?.data?.data?.needUpdate;
            if (!forceUpdate && !needUpdate) {
                FirstNext();
            } else {
                toast('You need to update this app')
            }
        }).catch(() => {
            FirstNext();
        })

    }

    const FirstNext = () => {
        getFirstData().then(() => {
            userToken !== null ?
                dispatch(userAuth()).then(() => {
                    getUserData().then(() => {
                        setIspreference(userInfo?.preference?.length === undefined ? false : true);
                        nextScreen();
                    })
                })
                : nextScreen();
        });
    }

    const DeepLinking = async (urldata) => {

        let data = urldata.split("://");
        data = data[1].split("/");

        const DATAURL = data[0];
        const DATATYPE = data[1];
        const DATATID = data[2];

        if (DATAURL === global.DEEPLINKING_BASE_URL) {
            if (DATATYPE === global.DEEPLINKING_POST) {
                props.navigation.replace('PostDetailScreen', { item: { id: DATATID, requestFrom: 'deepLink' } })
            }
            else if (DATATYPE === global.DEEPLINKING_REEL) {
                props.navigation.replace('AppBottomTab', { screen: 'Reels', item: { id: DATATID, requestFrom: 'deepLink' } });
            } else if (DATATYPE === global.DEEPLINKING_NFT) {
                props.navigation.replace('NFTDetailScreen', { item: { id: DATATID, requestFrom: 'deepLink' } })
            } else if (DATATYPE === global.DEEPLINKING_INVITE) {
                await set('horizon_referal_token', DATATID, true);
                First();
            }
            else {
                First();
            }
        }

    }

    const getFirstData = async () => {

        try {

            const firstRundata = await get('firstRun');
            const userToken = await get('horizon_token');
            setUserToken(userToken);
            setFirstRun(firstRundata);

        } catch (error) {

        }

    }

    const getUserData = async () => {
        try {
            const userInfodata = await get('userInfo');
            setUserInfo(userInfodata);

        } catch (error) {

        }
    }

    const nextScreen = () => {

        setTimeout(() => {

            if (userInfo !== null && userInfo !== '' && ispreference === true && userInfo.length !== 0) {
                props.navigation.replace('HomeStack');
            } else if (userInfo !== null && userInfo !== '' && ispreference === false && userInfo.length !== 0) {
                props.navigation.navigate('CollectionsScreen');
            } else {
                props.navigation.replace('AuthStack', { screen: firstRun ? 'MainScreen' : 'OnBoardingScreen' });
            }

        }, 1000)

    }

    return (
        <>
            <View style={{ backgroundColor: theme.backgroundColor, flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <Image style={{ width: '50%', height: undefined, aspectRatio: 1.1 }} source={require('../Images/ic_splash_logo.png')} />


                <View style={{ position: 'absolute', bottom: 40, alignItems: 'center' }}>

                    <View style={{ position: 'absolute', bottom: 50, alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 14,
                            color: Color.textColor,

                        }}>from</Text>

                    </View>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <Image style={{ width: 190, height: 60, resizeMode: 'contain' }} source={require('../Images/ic_white_origin2.png')} />

                    </View>
                </View>
            </View>
        </>
    );

}

export default AppIntro