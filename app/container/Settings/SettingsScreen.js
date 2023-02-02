import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import { useIsFocused } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from 'react-redux';
import { SettingsStyle, IconSize } from './SettingsStyle'
import { useTheme } from './../../Context';
import auth from '@react-native-firebase/auth';
import { remove, checkAndClearOnFirstRun } from '../../storage';

const SettingsScreen = (props) => {
    const { theme } = useTheme();

    const isFocused = useIsFocused();

    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;


    const onLogOut = async () => {
        auth().signOut();
        await remove('horizon_token');
        await remove('userInfo');
        await remove('tmp_horizon_token');
        checkAndClearOnFirstRun().then(() => {
            props.navigation.replace('AuthStack', { screen: 'LoginScreen' });
        })
    }

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>
            <Header isShownSearch={false} title={"Settings"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('FollowandInviteScreen')
                    }} >
                        <Ionicons name={'person-add-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Follow and invite friends</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        // props.navigation.navigate('NotificationsScreen')
                        toast('We are working on it!')

                    }} >
                        <Ionicons name={'md-notifications-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Notifications</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('PrivacyScreen')
                    }} >
                        <Ionicons name={'md-lock-closed-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Privacy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('SecurityScreen')
                    }} >
                        <Ionicons name={'md-shield-checkmark-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Security</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        // props.navigation.navigate('SettingsScreen')
                    }} >
                        <Ionicons name={'megaphone-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Ads</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('AccountScreen')
                    }} >
                        <Ionicons name={'person-circle-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('HelpScreen')
                    }} >
                        <Ionicons name={'help-buoy-sharp'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Help</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('AboutScreen')
                    }} >

                        <Image source={require('../../Images/ic_splash_logo.png')} style={{ resizeMode: 'contain', height: 25, width: 25, marginRight: 8, tintColor: theme.activeIcon }} />

                        <Text style={SettingsStyle(theme).SubTitleStyle}>About</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('ThemeScreen')
                    }} >
                        <Ionicons name={'md-color-filter-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Theme</Text>
                    </TouchableOpacity>



                    <Image style={{ width: 160, height: 50, resizeMode: 'contain', tintColor: theme.activeIcon }} source={require('../../Images/ic_white_origin2.png')} />
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 14, textAlign: 'left' }}>Control settings for connected experiences across Horizon, The Python ecosystem and cryptonium with incuding mapline story, limelight post and logging in.</Text>


                    <Text style={SettingsStyle(theme).TitleStyle}>Logins</Text>
                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => { onLogOut() }} >
                        <Text style={{ color: '#3483c8', fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Log out {username}</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default SettingsScreen;
