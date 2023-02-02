import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from "../Components/LoginHeader";
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SettingsStyle } from './SettingsStyle'
import { useTheme } from './../../Context';

const AboutScreen = (props) => {
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>
            <Header isShownSearch={false} title={"About"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    {/* <TouchableOpacity style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} onPress={() => {
                        // props.navigation.navigate('FollowandInviteScreen')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>App updates</Text>

                    </TouchableOpacity> */}

                    <TouchableOpacity style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} onPress={() => {
                        props.navigation.navigate('WebviewScreen', { url: 'https://marketplace.whiteorigin.in/privacy-policy|smart-link' })

                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Data Policy</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} onPress={() => {
                        props.navigation.navigate('WebviewScreen', { url: 'https://marketplace.whiteorigin.in/terms-condition|smart-link' })

                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Terms of Use</Text>

                    </TouchableOpacity>

                    {/* <TouchableOpacity style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} onPress={() => {
                        // props.navigation.navigate('FollowandInviteScreen')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Open source libraries</Text>

                    </TouchableOpacity> */}




                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default AboutScreen;
