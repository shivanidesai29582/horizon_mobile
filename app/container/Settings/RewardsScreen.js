import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Color from "../../common/Color";
import Constants from "../../common/Constants"
import { useIsFocused } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from 'react-redux';
import Button1Component from './../../Components/Button1Component';
import { SettingsStyle, IconSize } from './SettingsStyle'
import { useTheme } from './../../Context';

const RewardsScreen = (props) => {
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const isSelectedValue = 1;

    return (
        <SafeAreaView style={[SettingsStyle(theme).Maincontainer, { alignItems: 'center' }]}>

            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, height: 50 }}>

                <View style={{ flexDirection: 'column' }}>

                    <TouchableOpacity onPress={() => { props.navigation.pop() }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: '#9F9696', justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name={'md-chevron-back'} color={theme.activeIcon} size={20} />
                    </TouchableOpacity>

                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>

                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 22, textAlign: 'center' }}>Creater Rewards</Text>
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 22, textAlign: 'center', marginTop: -5 }}>Program</Text>

                </View>

            </View>

            {/* <Text style={[SettingsStyle(theme).SubTitleStyle, { marginLeft: 10, fontSize: 18, fontFamily: Constants.fontFamilyBold }]}>Rewards</Text> */}

            <ScrollView style={{ marginVertical: 10 }}>
                <View style={{ marginLeft: 25, flex: 1 }}>
                    <Text style={[SettingsStyle(theme).SubTitleStyle, { marginLeft: 25, fontSize: 18, marginTop: 20, fontFamily: Constants.fontFamilyBold }]}>Get Your Rewards</Text>
                    <Image source={require('../../Images/ic_rewards.png')} resizeMode='stretch' style={{ alignSelf: 'center', marginTop: 20, height: 150, width: 325 }} />

                    <View disabled={isSelectedValue === 0 ? true : false} style={[SettingsStyle(theme).ViewStyle, { marginTop: 40 }]}  >

                        <Ionicons name={isSelectedValue === 0 ? 'checkmark-circle-sharp' : 'ellipse-outline'} color={Color.secondary} size={IconSize} style={{ marginRight: 5 }} />

                        <Text style={[SettingsStyle(theme).SubTitleStyle, { marginLeft: 10, fontSize: 18 }]}>10K Followers</Text>

                    </View>

                    <View disabled={isSelectedValue === 0 ? true : false} style={[SettingsStyle(theme).ViewStyle, { marginTop: -5 }]}  >

                        <Ionicons name={isSelectedValue === 0 ? 'checkmark-circle-sharp' : 'ellipse-outline'} color={Color.secondary} size={IconSize} style={{ marginRight: 5 }} />

                        <Text style={[SettingsStyle(theme).SubTitleStyle, { marginLeft: 10, fontSize: 18 }]}>5 Videos</Text>

                    </View>

                    <View disabled={isSelectedValue === 0 ? true : false} style={[SettingsStyle(theme).ViewStyle, { marginTop: -5 }]}  >
                        <Ionicons name={isSelectedValue === 0 ? 'checkmark-circle-sharp' : 'ellipse-outline'} color={Color.secondary} size={IconSize} style={{ marginRight: 5 }} />
                        <Text style={[SettingsStyle(theme).SubTitleStyle, { flex: 1, fontSize: 18, marginHorizontal: 5, paddingHorizontal: 5 }]}>Your first video must be 3 months old</Text>
                    </View>
                    <Text style={[SettingsStyle(theme).SubTitleStyle, { marginRight: 10, marginTop: 20 }]}>When above condition is fullfill then after you can apply for participant in creater rewards program.</Text>
                </View>
            </ScrollView>

            <Button1Component visible={loading} extraviewstyle={{ width: '70%', position: 'absolute', bottom: 20 }} title={'Apply for participant'} />

        </SafeAreaView>
    );

}

export default RewardsScreen;
