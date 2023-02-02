import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from "../Components/LoginHeader";
import { useIsFocused } from '@react-navigation/native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from 'react-redux';
import { SettingsStyle, IconSize } from './SettingsStyle'
import { useTheme } from './../../Context';


const HelpScreen = (props) => {
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>
            <Header isShownSearch={false} title={"Help"} onBackPress={() => {
                props.navigation.pop()
            }} />


            <ScrollView style={{ marginVertical: 10 }}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <TouchableOpacity style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} onPress={() => {
                        props.navigation.navigate('ReportProblemScreen')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Report a Problem</Text>
                        <MaterialIcons name={'navigate-next'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />

                    </TouchableOpacity>

                    <TouchableOpacity style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} onPress={() => {
                        props.navigation.navigate('WebviewScreen', { url: 'https://www.cryptonium.in/terms-condition' })
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Help Center</Text>
                        <MaterialIcons name={'navigate-next'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />

                    </TouchableOpacity>

                    <TouchableOpacity style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} onPress={() => {

                        props.navigation.navigate('WebviewScreen', { url: 'https://www.cryptonium.in/privacy-policy' })
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Privacy and Security Help</Text>
                        <MaterialIcons name={'navigate-next'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />

                    </TouchableOpacity>


                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default HelpScreen;
