import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, Switch } from 'react-native';
import Color from "../../common/Color";
import { Header } from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SettingsStyle } from './SettingsStyle'
import { useTheme } from './../../Context';

const ActivityStatus = (props) => {
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const [isEnabled, setIsEnabled] = useState(true);

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>

            <Header isShownSearch={false} title={"Activity Status"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }} showsVerticalScrollIndicator={false}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <Text style={SettingsStyle(theme).TitleStyle}>Account privacy</Text>

                    <View style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} >
                        <View style={{ flex: 1 }}>
                            <Text style={[SettingsStyle(theme).SubTitleStyle,]}>Show Activity Status</Text>
                            <Text style={[SettingsStyle(theme).SubTitleStyle, { fontFamily: Constants.fontFamilyRegular, fontSize: 14 }]}>Allow accounts you follow and anyone you message to see when you were last active or are currently active on Horizon apps.</Text>
                        </View>
                        <Switch
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], marginRight: 10 }}
                            trackColor={{ true: theme.trackActiveColor, false: theme.trackDisableColor }}
                            thumbColor={isEnabled ? theme.toggleActiveButtonColor : theme.toggleDisableButtonColor}
                            onValueChange={() => { setIsEnabled(pre => !pre) }}
                            value={isEnabled}></Switch>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default ActivityStatus;
