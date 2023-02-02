import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Switch } from 'react-native';
import Color from "../../common/Color";
import { Header } from "../Components/LoginHeader";
import { useIsFocused } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import { useSelector } from 'react-redux';
import { SettingsStyle, IconSize } from './SettingsStyle'
import { useTheme } from './../../Context';

const PrivacyScreen = (props) => {
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const [isEnabled, setIsEnabled] = useState(true);

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>

            <Header isShownSearch={false} title={"Privacy"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }} showsVerticalScrollIndicator={false}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <Text style={SettingsStyle(theme).TitleStyle}>Account privacy</Text>

                    <View style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} >
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons name={'md-lock-closed-outline'} color={theme.textColor} size={IconSize} style={{ marginRight: 5 }} />
                            <Text style={[SettingsStyle(theme).SubTitleStyle, { alignSelf: 'center' }]}>Private account</Text>
                        </View>
                        <Switch
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], marginRight: 10 }}
                            trackColor={{ true: theme.trackActiveColor, false: theme.trackDisableColor }}
                            thumbColor={isEnabled ? theme.toggleActiveButtonColor : theme.toggleDisableButtonColor}
                            onValueChange={() => { setIsEnabled(pre => !pre) }}
                            value={isEnabled}></Switch>
                    </View>

                    <Text style={SettingsStyle(theme).TitleStyle}>Interactions</Text>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => { props.navigation.navigate('MentionsScreen') }} >
                        <Ionicons name={'at'} color={theme.textColor} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Mentions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('StoryScreen')
                    }} >
                        <Ionicons name={'megaphone-outline'} color={theme.textColor} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Story</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => { toast('We are working on it!'); }} >
                        <Ionicons name={'megaphone-outline'} color={theme.textColor} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Reels and Remix</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => { toast('We are working on it!'); }} >
                        <Ionicons name={'book-outline'} color={theme.textColor} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Guides</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('ActivityStatus')
                    }} >
                        <Ionicons name={'ios-checkmark-done-circle-outline'} color={theme.textColor} size={28} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Activity Status</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => { toast('We are working on it!'); }} >
                        <Image source={require('../../Images/ic_chat.png')} style={{ resizeMode: 'contain', height: 25, width: 25, marginRight: 8, tintColor: theme.textColor }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Messages</Text>
                    </TouchableOpacity> */}

                    <Text style={SettingsStyle(theme).TitleStyle}>Connections</Text>
                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('BlockedListScreen', { type: 'Restrict' })
                    }} >
                        <Image source={require('../../Images/ic_restricted_accounts.png')} style={{ resizeMode: 'contain', height: 25, width: 25, marginRight: 12, tintColor: theme.textColor }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Restricted accounts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('BlockedListScreen', { type: 'Block' })

                    }} >
                        <Entypo name={'block'} color={theme.textColor} size={IconSize} style={{ marginRight: 8 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Blocked accounts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('BlockedListScreen', { type: 'Mute' })

                    }} >
                        <Ionicons name={'md-volume-mute-outline'} color={theme.textColor} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Muted accounts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => { props.navigation.navigate('UserFriendsList', { Type: 'Followers' }) }} >
                        <Ionicons name={'person-add-outline'} color={theme.textColor} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Accounts you follow</Text>
                    </TouchableOpacity>



                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default PrivacyScreen;
