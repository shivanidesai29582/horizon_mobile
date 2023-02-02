import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, Switch } from 'react-native';
import Color from "../../common/Color";
import { Header } from "../Components/LoginHeader";
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SettingsStyle } from './SettingsStyle'
import { useTheme } from './../../Context';

const NotificationsScreen = (props) => {
    const { theme } = useTheme();

    const isFocused = useIsFocused();

    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const [isEnabled, setIsEnabled] = useState(true);




    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>
            <Header isShownSearch={false} title={"Notifications"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <Text style={SettingsStyle(theme).TitleStyle}>Push Notifications</Text>

                    <View style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} >
                        <Text style={[SettingsStyle(theme).SubTitleStyle, { alignSelf: 'center' }]}>Pause All</Text>
                        <Switch
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                            trackColor={{ true: theme.trackActiveColor, false: theme.trackDisableColor }}
                            thumbColor={isEnabled ? theme.toggleActiveButtonColor : theme.toggleDisableButtonColor}
                            onValueChange={() => { setIsEnabled(pre => !pre) }}
                            value={isEnabled}></Switch>
                    </View>

                    <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                        // props.navigation.navigate('SettingsScreen')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Posts, Stories and Comments</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                        // props.navigation.navigate('SettingsScreen')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Following and Followers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                        // props.navigation.navigate('SettingsScreen')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Messages and Calls</Text>
                    </TouchableOpacity>


                    <Text style={SettingsStyle(theme).TitleStyle}>Other Notifications Types</Text>
                    <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                        // props.navigation.navigate('SettingsScreen')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Email notifications</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default NotificationsScreen;
