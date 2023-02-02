import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Header } from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SettingsStyle } from './SettingsStyle'
import { useTheme } from './../../Context';

const StoryScreen = (props) => {
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const [isEnabled, setIsEnabled] = useState(true);

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>

            <Header isShownSearch={false} title={"Story"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }} showsVerticalScrollIndicator={false}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <Text style={SettingsStyle(theme).TitleStyle}>Viewing</Text>

                    <View style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} >
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[SettingsStyle(theme).SubTitleStyle, { alignSelf: 'center' }]}>Hide story from</Text>
                        </View>
                    </View>
                    <Text style={[SettingsStyle(theme).SubTitleStyle, { fontFamily: Constants.fontFamilyRegular }]}>0 people</Text>
                    <Text style={[SettingsStyle(theme).SubTitleStyle, { fontFamily: Constants.fontFamilyRegular, fontSize: 12, marginTop: 5 }]}>Hide your story from specific people.</Text>

                    <View style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} >
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[SettingsStyle(theme).SubTitleStyle, { alignSelf: 'center' }]}>Close friends</Text>
                        </View>
                    </View>
                    <Text style={[SettingsStyle(theme).SubTitleStyle, { fontFamily: Constants.fontFamilyRegular }]}>0 people</Text>
                    <Text style={[SettingsStyle(theme).SubTitleStyle, { fontFamily: Constants.fontFamilyRegular, fontSize: 12, marginTop: 5 }]}>Share your story only with specific people.</Text>



                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default StoryScreen;
