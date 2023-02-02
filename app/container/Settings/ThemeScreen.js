import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from "../Components/LoginHeader";
import { useIsFocused } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from 'react-redux';
import { SettingsStyle, IconSize } from './SettingsStyle'
import { useTheme } from '../../Context';

const ThemeScreen = (props) => {
    const { theme, updateTheme } = useTheme();
    const isFocused = useIsFocused();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const [isSelectedValue, setIsSelectedValue] = useState(theme?.themeMode == 'dark' ? 1 : (theme?.themeMode == 'grey' ? 2 : 0));
    const changeTheme = (newtheme) => updateTheme(theme.themeMode, newtheme);

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>
            <Header isShownSearch={false} title={"Set theme"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <TouchableOpacity
                        activeOpacity={0.5}
                        disabled={isSelectedValue === 0 ? true : false}
                        style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]}
                        onPress={() => {
                            changeTheme('light');
                            setIsSelectedValue(0)
                        }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Light</Text>
                        <Ionicons name={isSelectedValue === 0 ? 'checkmark-circle-sharp' : 'ellipse-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />

                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.5}
                        disabled={isSelectedValue === 2 ? true : false}
                        style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]}
                        onPress={() => {
                            changeTheme('grey');
                            setIsSelectedValue(2)
                        }}>
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Grey</Text>
                        <Ionicons name={isSelectedValue === 2 ? 'checkmark-circle-sharp' : 'ellipse-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.5}
                        disabled={isSelectedValue === 1 ? true : false}
                        style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]}
                        onPress={() => {
                            changeTheme('dark');
                            setIsSelectedValue(1)
                        }}>
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Dark</Text>
                        <Ionicons name={isSelectedValue === 1 ? 'checkmark-circle-sharp' : 'ellipse-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]}>
                        <Text style={SettingsStyle(theme).SubTitleStyle}>system default</Text>
                        <Ionicons name={'ellipse-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default ThemeScreen;
