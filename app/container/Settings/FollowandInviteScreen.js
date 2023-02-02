import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Linking, Share } from 'react-native';
import { Header } from "../Components/LoginHeader";
import global from "../../common/globals"
import { useIsFocused } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from 'react-redux';
import { SettingsStyle, IconSize } from './SettingsStyle'
import { useTheme } from './../../Context';
import { toast } from "./../../Omni";

const FollowandInviteScreen = (props) => {
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const inviteByEmail = () => {
        Linking.openURL(`mailto:?subject=${username} ${global?.shareTitle}&body=${global?.shareDesc} ${username} ${global?.shareDesc2} `)
    }

    const inviteByShare = async () => {
        try {
            const result = await Share.share({
                message: `${username} ${global?.shareTitle}`,
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
            toast(error.message);
        }
    };

    const inviteBySMS = () => {
        Linking.openURL(`sms:?body=${global?.shareDesc}`)
    }

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>
            <Header isShownSearch={false} title={"Follow and invite friends"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!')
                    }} >
                        <Ionicons name={'person-add-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Follow contacts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        inviteByEmail()
                    }} >
                        <Ionicons name={'md-mail-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Invite friends by email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        inviteBySMS()
                    }} >
                        <Image source={require('../../Images/message.png')} style={{ resizeMode: 'contain', height: 25, width: 25, marginRight: 8, tintColor: theme.activeIcon }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Invite friends by SMS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        inviteByShare()
                    }} >
                        <Ionicons name={'share-social-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Invite friends by...</Text>
                    </TouchableOpacity>



                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default FollowandInviteScreen;
