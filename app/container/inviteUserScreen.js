import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Linking, Share } from 'react-native';
import { Header } from "./Components/LoginHeader";
import Constants from "../common/Constants";
import global from "../common/globals"
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from 'react-redux';
import { useTheme } from '../Context';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const InviteUserScreen = (props) => {
    const { theme } = useTheme();

    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);

    const username = user?.username === null ? "unnamed" : user?.username;
    const usertoken = user?.referral_token;

    const [buildLink, setBuildLink] = useState('');

    useEffect(() => {

        const generateLink = async () => {
            const link = await dynamicLinks().buildShortLink({
                link: `${global.DEEPLINKING_URL}/${global.DEEPLINKING_INVITE}/${usertoken}`,
                domainUriPrefix: 'https://horizonbird.page.link',
                android: { packageName: 'com.whiteorigin.horizon' },
                // ios: { bundleId: '' }

            });
            setBuildLink("My Referal code: " + usertoken + link);
        }
        generateLink();

    }, []);

    const inviteByEmail = () => {
        Linking.openURL(`mailto:?subject=${username} ${global?.shareTitle}&body=${global?.shareDesc} ${username} ${global?.shareDesc2} Link:${buildLink}`)
    }

    const inviteByShare = async () => {
        try {
            const result = await Share.share({
                message: `${username} ${global?.shareTitle} Link:${buildLink}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const inviteBySMS = () => {
        Linking.openURL(`sms:?body=${global?.shareDesc} Link: ${buildLink}`)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <Header isShownSearch={false} title={"Share and invite friends"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <TouchableOpacity style={{
                        marginVertical: 15,
                        flexDirection: 'row'
                    }} onPress={() => {
                        inviteByEmail()
                    }} >
                        <Ionicons name={'md-mail-outline'} color={theme.activeIcon} size={25} style={{ marginRight: 5 }} />
                        <Text style={{
                            color: theme.textColor,
                            fontFamily: Constants.fontFamilyMedium,
                            fontSize: 16,
                            textAlign: 'left'
                        }}>Invite friends by email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        marginVertical: 15,
                        flexDirection: 'row'
                    }} onPress={() => {
                        inviteBySMS()
                    }} >
                        <Image source={require('../Images/message.png')} style={{ resizeMode: 'contain', height: 25, width: 25, marginRight: 8, tintColor: theme.activeIcon }} />
                        <Text style={{
                            color: theme.textColor,
                            fontFamily: Constants.fontFamilyMedium,
                            fontSize: 16,
                            textAlign: 'left'
                        }}>Invite friends by SMS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        marginVertical: 15,
                        flexDirection: 'row'
                    }} onPress={() => {
                        inviteByShare()
                    }} >
                        <Ionicons name={'share-social-outline'} color={theme.activeIcon} size={25} style={{ marginRight: 5 }} />
                        <Text style={{
                            color: theme.textColor,
                            fontFamily: Constants.fontFamilyMedium,
                            fontSize: 16,
                            textAlign: 'left'
                        }}>Invite friends by...</Text>
                    </TouchableOpacity>



                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default InviteUserScreen;
