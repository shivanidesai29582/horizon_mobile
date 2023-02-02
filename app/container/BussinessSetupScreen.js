import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Constants from "../common/Constants";
import { useTheme } from '../Context';

const BussinessSetupScreen = (props) => {
    const { theme } = useTheme();

    return (<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, width: '100%', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => {
                props.navigation.pop()
            }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: '#9F9696', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />

            </TouchableOpacity>
            <View style={{ flex: 1 }}>
            </View>
        </View>

        <ScrollView showsHorizontalScrollIndicator={false} >

            <View style={{ padding: 20, flex: 1 }}>

                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 18, textAlign: 'center', }}>Set Up Your </Text>
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 18, textAlign: 'center', marginTop: 10 }}>professional Account </Text>

                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyMedium, fontSize: 18, marginTop: 50 }}>Let's Start</Text>

                <TouchableOpacity style={{ justifyContent: 'space-between', marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                    props.navigation.navigate('BussinessEditScreen')
                }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Ionicons name={'person-circle-outline'} color={theme.textColor} size={25} style={{ marginRight: 5, alignSelf: 'center' }} />

                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyMedium, fontSize: 16, textAlign: 'left', alignSelf: 'center' }}>Complete your profile</Text>
                    </View>
                    <MaterialIcons name={'navigate-next'} color={theme.activeIcon} size={25} style={{ marginRight: 5 }} />

                </TouchableOpacity>

                <TouchableOpacity style={{ justifyContent: 'space-between', marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                    props.navigation.navigate('InspiredScreen')
                }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <MaterialIcons name={'store'} color={theme.textColor} size={25} style={{ marginRight: 5, alignSelf: 'center' }} />

                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyMedium, fontSize: 16, textAlign: 'left', alignSelf: 'center' }}>Get Inspired</Text>
                    </View>
                    <MaterialIcons name={'navigate-next'} color={theme.activeIcon} size={25} style={{ marginRight: 5 }} />

                </TouchableOpacity>

                <TouchableOpacity style={{ justifyContent: 'space-between', marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                    props.navigation.navigate('InviteUserScreen')
                }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Ionicons name={'person-add-outline'} color={theme.textColor} size={25} style={{ marginRight: 5, alignSelf: 'center' }} />

                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyMedium, fontSize: 16, textAlign: 'left', alignSelf: 'center' }}>Grow Your Comunity</Text>
                    </View>
                    <MaterialIcons name={'navigate-next'} color={theme.activeIcon} size={25} style={{ marginRight: 5 }} />

                </TouchableOpacity>

            </View>
        </ScrollView>
    </SafeAreaView>
    )
}

export default BussinessSetupScreen;

