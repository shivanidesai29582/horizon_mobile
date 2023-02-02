import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from "../Components/LoginHeader";
import { useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from './../../Context';
import { useSelector } from 'react-redux';
import { SettingsStyle, IconSize } from './SettingsStyle'

const SecurityScreen = (props) => {
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const [isEnabled, setIsEnabled] = useState(true);

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>

            <Header isShownSearch={false} title={"Security"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <Text style={SettingsStyle(theme).TitleStyle}>Login security</Text>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('PasswordScreen')
                    }} >
                        <MaterialCommunityIcons name={'key-outline'} color={theme.textColor} size={IconSize} style={{ marginRight: 10 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Password</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!');
                    }} >
                        <Ionicons name={'md-location-outline'} color={theme.textColor} size={IconSize} style={{ marginRight: 10 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Login activity</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!');
                    }} >
                        <Feather name={'check-square'} color={theme.textColor} size={IconSize} style={{ marginRight: 10 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Saved login info</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!');
                    }} >
                        <Feather name={'mail'} color={theme.textColor} size={IconSize} style={{ marginRight: 10 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Emails from Horizon</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!');
                    }} >
                        <MaterialCommunityIcons name={'vector-rectangle'} color={theme.textColor} size={IconSize} style={{ marginRight: 10 }} />
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Security Checkup</Text>
                    </TouchableOpacity> */}



                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default SecurityScreen;
