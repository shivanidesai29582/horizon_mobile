import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Color from '../../common/Color';
import Constants from "../../common/Constants";
import { checkAndClearOnFirstRun } from '../../storage';

const MainScreen = (props) => {

    useEffect(() => {
        checkAndClearOnFirstRun();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ width: '50%', height: undefined, aspectRatio: 1.1 }} source={require('../../Images/ic_splash_logo.png')} />
                {/* <View style={{ marginVertical: 100, paddingVertical: 14, paddingHorizontal: 70, borderRadius: 50, borderWidth: 1, borderColor: theme.textColor, backgroundColor: Color.yellow }}> */}
            </View>
            <View style={{ alignItems: 'center', marginBottom: 100, alignItems: 'center', justifyContent: 'center', }}>
                <TouchableOpacity style={{ paddingVertical: 14, paddingHorizontal: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: Color.yellow }} onPress={() => { props.navigation.replace('LoginScreen') }}>
                    <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 22, lineHeight: 26, color: 'black' }}>Log in</Text>
                </TouchableOpacity>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 20, color: 'gray', textTransform: 'uppercase' }}>or</Text>
                </View>
                <TouchableOpacity onPress={() => { props.navigation.replace('RegisterScreen') }}>
                    <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 20, lineHeight: 22, color: Color.secondary, alignItems: 'center' }}> sign up with your phone number</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
export default MainScreen;