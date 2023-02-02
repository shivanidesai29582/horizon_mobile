import React, { useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Color from '../common/Color';
import Constants from "../common/Constants";
import Button1Component from "../Components/Button1Component";
import { useTheme } from '../Context';

const ReferalScreen = (props) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);

    return (<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

        <ScrollView
            bounces={false}
        >
            <View style={{ flex: 1 }}>
                <Image source={require('../Images/ic_referal_program.png')} resizeMode='stretch' style={{ height: 150, width: "100%" }} />

                <TouchableOpacity onPress={() => {
                    props.navigation.pop()
                }} style={{ position: 'absolute', top: 10, left: 10, height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: theme.textColor, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, width: '100%', justifyContent: 'space-between' }}>

                    <View style={{ flex: 1, marginTop: 50 }}>
                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 20, textAlign: 'center' }}>Welcome to Horizon referal compounding program.</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 50, marginHorizontal: 10 }}>
                    <FontAwesome5 name={'hand-holding-medical'} color={theme.textColor} size={30} style={{ marginRight: 10, alignSelf: 'center' }} />
                    <View style={{ marginLeft: 50 }}>
                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 18, textAlign: 'center' }}>Referal and earn </Text>
                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 18, textAlign: 'center' }}>Python coins</Text>
                    </View>
                </View>


                <View style={{ flexDirection: 'row', marginTop: 30, marginLeft: 25 }}>
                    {/* <FontAwesome5 name={'hand-holding-medical'} color={theme.textColor} size={20} style={{ marginRight: 10, alignSelf: 'center' }} /> */}
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 14, marginRight: 25 }}>You get 25 Python coins when you refer any friends or family member.</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 25, marginLeft: 25 }}>
                    {/* <FontAwesome5 name={'hand-holding-medical'} color={theme.textColor} size={20} style={{ marginRight: 10, alignSelf: 'center' }} /> */}
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 14, marginRight: 25 }}>And it refery that you invite in Horizon id refer</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 25, marginLeft: 25 }}>
                    {/* <FontAwesome5 name={'hand-holding-medical'} color={theme.textColor} size={20} style={{ marginRight: 10, alignSelf: 'center' }} /> */}
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 14, marginRight: 25 }}>anyone then you get also rewarded by 10 python coin and this process is for only 5 times repeat and cycle.</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 25, marginLeft: 25 }}>
                    {/* <FontAwesome5 name={'hand-holding-medical'} color={theme.textColor} size={20} style={{ marginRight: 10, alignSelf: 'center' }} /> */}
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 14, marginRight: 25 }}>So, invite more people to horizon and get coins.</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 50, marginHorizontal: 10 }}>
                    <FontAwesome5 name={'hand-holding-heart'} color={theme.textColor} size={30} style={{ marginRight: 10, alignSelf: 'center' }} />
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 18, textAlign: 'center', marginLeft: 35 }}>Spending time on Horizon</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 40, marginLeft: 25 }}>
                    {/* <Ionicons name={'ellipse-outline'} color={theme.textColor} size={20} style={{ marginRight: 10, alignSelf: 'center' }} /> */}
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 14, marginRight: 25 }}>User spend time more than 30min then user get rewarded by coins.</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 40, marginLeft: 25 }}>
                    {/* <Ionicons name={'ellipse-outline'} color={theme.textColor} size={20} style={{ marginRight: 10, alignSelf: 'center' }} /> */}
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 14, marginRight: 25 }}>After 30min every 5 min you spend on Horizon you get rewarded by 3 coins.</Text>
                </View>
                {/*<TouchableOpacity onPress={() => { props.navigation.navigate('InviteUserScreen') }} style={{ marginHorizontal: 90, marginVertical: 35, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 40, backgroundColor: Color.secondary, justifyContent: 'center', alignItems: "center", flexDirection: 'row' }}>
                    <Text style={[{ fontFamily: Constants.fontFamilyMedium, marginHorizontal: 30, color: "#fff", fontSize: 18 }]}>Share or invite</Text>
                </TouchableOpacity> */}
            </View>
        </ScrollView>
        <Button1Component visible={loading} onPress={() => { props.navigation.navigate('InviteUserScreen') }} title={'Invite'} extraviewstyle={{ marginHorizontal: 90, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 12 }} />
    </SafeAreaView>
    )
}

export default ReferalScreen;

