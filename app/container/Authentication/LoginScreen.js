import React, { useState, useEffect, useRef } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, TextInput, StyleSheet, Platform } from 'react-native';
import Color from "../../common/Color";
import Constants from "../../common/Constants";
import { toast } from "../../Omni";
import { useDispatch, useSelector } from 'react-redux';
import { loginwithPhone } from '../../redux/userlogin'
import Ionicons from "react-native-vector-icons/Ionicons";
import PhoneInput from 'react-native-phone-input'
import ModalPickerImage from './../../Components/ModalPickerImage'
import { get } from './../../storage';
import auth from '@react-native-firebase/auth';

const LoginScreen = (props) => {

    const dispatch = useDispatch();
    const phoneInput = useRef(null);
    const [myCountryPicker, setMyCountryPicker] = useState(false);
    const [showError, setShowError] = useState(false);

    let loginError = useSelector((state) => state?.userlogin?.loginError);
    if (loginError !== undefined && loginError !== 'Unauthorized' && showError) {
        // (Platform.OS === 'android') ? ToastAndroid.show(loginError, ToastAndroid.SHORT) : AlertIOS.alert(loginError);
        toast(loginError);
        setShowError(false);
    }

    const [phoneNumber, setPhoneNumber] = useState(null);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrectpassword, setIncorrectPassword] = useState(false);
    const [showpassword, setShowPassword] = useState(false);

    const [incorrectemail, setIncorrectEmail] = useState(false);
    const [pickerData, setPickerData] = useState(null);

    const [fcmToken, setFcmToken] = useState(null);

    useEffect(() => {
        try {
            auth().signOut();
        } catch (error) {

        }

        getFCMToken()
        setPickerData(phoneInput.current.getPickerData())
    }, []);


    const getFCMToken = async () => {
        try {
            const fcm_token = await get('fcm_token');
            setFcmToken(fcm_token);

        } catch (error) {
        }
    }

    const handleValidPassword = () => {
        const regx = /^([a-zA-Z0-9]).{8,32}$/;
        return password.match(regx);
    };

    const handleValidEmail = () => {
        const regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        return email.match(regx);
    };

    const validationCheck = () => {
        let status = false;
        if (phoneNumber && password) {
            if (handleValidPassword()) {
                status = true;
            }

            // if (!handleValidEmail()) {
            //     setIncorrectEmail(true);
            // } else {
            //     setIncorrectEmail(false);
            // }

            if (!handleValidPassword()) {
                setIncorrectPassword(true);
                // (Platform.OS === 'android') ? ToastAndroid.show('Invalid password', ToastAndroid.SHORT) : AlertIOS.alert('Invalid password');
                toast('Invalid password');
                setShowError(false);
            } else {
                setIncorrectPassword(false);
            }
        }
        else {
            // (Platform.OS === 'android') ? ToastAndroid.show('Enter valid number and/or Password', ToastAndroid.SHORT) : AlertIOS.alert('Enter valid number and/or Password');
            toast('Enter valid number and/or Password');
            setShowError(false);
        }


        return status;
    };



    const onLogin = () => {
        setLoading(true);
        setShowError(true);

        if (validationCheck()) {
            dispatch(loginwithPhone({ phone: `${phoneNumber}`, password, fcm_token: `${fcmToken}` })).then((response) => {
                setLoading(false);

                response.statusCode === 200 ?
                    nextPage(response)
                    : null;

            });
        } else {
            setLoading(false);

        }
    }

    const nextPage = (response) => {
        response?.user?.preference?.length === undefined ? props.navigation.replace('CollectionsScreen') : props.navigation.replace('HomeStack')
    }


    const onPressFlag = () => {
        setMyCountryPicker(true);
    }

    const selectCountry = (country) => {
        phoneInput.current.selectCountry(country.iso2);
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'LobsterTwo-Bold', fontSize: 44, lineHeight: 66, color: 'black', textTransform: 'uppercase' }}>Horizon</Text>
                {/* <ScrollView scrollEnabled={650 > height ? true : false} showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}  >
                <View style={{ padding: 20, flex: 1 }}>
                    <Image source={require('../../Images/LoginIcon.png')} style={{
                        height: undefined,
                        width: '60%',
                        aspectRatio: 1,
                        alignSelf: 'center'
                    }} />
                    <Text style={{
                        fontSize: 25,
                        fontFamily: Constants.fontFamilyBold,
                        color: theme.textColor,
                        marginTop: 15,
                        includeFontPadding: false,
                        padding: 0
                    }}>Let’s Sign you in</Text>
                    <Text style={{
                        fontSize: 18,
                        color: Color.textColor,
                        fontFamily: Constants.fontFamilyRegular,
                        textAlign: 'left'
                    }}>{'Welcome Back,\nYou’ve been missed'}</Text> */}
                <View style={{ paddingHorizontal: 20, paddingVertical: 5, alignItems: "center", backgroundColor: '#F4F4F4', borderRadius: 30, marginTop: 30 }}>
                    <PhoneInput
                        ref={phoneInput}
                        flagStyle={styles.flag_style}
                        initialCountry="in"
                        offset={10}
                        style={{ marginVertical: 10 }}
                        textStyle={{ height: Platform.OS === "ios" ? null : 30, fontFamily: Constants.fontFamilyRegular, color: 'black', fontSize: 17 }}
                        textProps={{
                            placeholder: 'phone number',
                            placeholderTextColor: Color.placeHolderGrey
                        }}
                        allowZeroAfterCountryCode={false}
                        autoFormat={true}
                        onChangePhoneNumber={(value) => {
                            setPhoneNumber(value.replace(/ /g, ''))
                        }}
                        onPressFlag={onPressFlag}
                    />
                    <ModalPickerImage
                        modalVisible={myCountryPicker}
                        setModalVisible={setMyCountryPicker}
                        data={pickerData}
                        onChangeSet={(country) => { selectCountry(country) }}
                        cancelText='Cancel'
                    />
                </View>
                {/* <FieldComonent exterViewStyle={{ marginTop: 30 }} value={email} title={'example@gmail.com'} onChangeText={(text) => {
                        setEmail(text);
                    }}>
                        <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: theme.textColor }} />
                    </FieldComonent> */}


                <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", backgroundColor: '#F4F4F4', alignItems: "center", borderRadius: 30, marginTop: 30 }}>
                    <Image source={require('../../Images/passwordIcon.png')} resizeMode={"contain"}
                        style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    <TextInput onSubmitEditing={() => { onLogin() }} secureTextEntry={!showpassword} value={password} onChangeText={(text) => { setPassword(text) }} style={{ marginHorizontal: 15, fontSize: 17, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: 'black' }} placeholderTextColor={'#B9B8BC'} placeholder={'Password'}></TextInput >
                    <Ionicons name={!showpassword ? 'eye-outline' : 'eye-off-outline'} color={'black'} size={20} onPress={() => { setShowPassword(() => !showpassword) }} />
                </View>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate('MobileVerificationScreen')
                }}
                    style={{ width: '100%', paddingVertical: 8, alignItems: 'flex-end' }}>
                    <Text style={{ color: 'black', fontFamily: Constants.fontFamilySemiBold, fontSize: 17, lineHeight: 20 }}>Forgot password?</Text>
                </TouchableOpacity>
                <View style={{ width: '100%', justifyContent: 'flex-start' }}>
                    {/* {loginError !== undefined && loginError !== 'Unauthorized' ?
                        <Text style={{
                            color: 'gray',
                            marginTop: 5,
                            padding: 0
                        }}> {loginError}</Text> : null} */}

                    {/* {incorrectemail ?
                    <Text style={{
                        color: 'black',
                        marginTop: 5,
                        padding: 0
                    }}> Enter You Email is Not Correct.</Text> : null} */}

                    {/* {incorrectpassword ?
                        <Text style={{
                            color: 'gray',
                            marginTop: 5,
                            padding: 0
                        }}>invalid password</Text> : null} */}
                </View>
                {/* <View style={{ marginTop: 650 > height ? 0 : 50 }} /> */}
                <View style={{ flexDirection: 'row', marginTop: 0, alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <TouchableOpacity style={{ paddingVertical: 14, paddingHorizontal: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: Color.yellow }} onPress={() => { onLogin(); }}>
                            <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 22, lineHeight: 26, color: 'black' }}>Log in</Text>
                        </TouchableOpacity>

                    </View>
                    {/* <Button1Component visible={loading} onPress={() => { onLogin(); }} extraviewstyle={{ width: '50%' }} title={'log in'} /> */}
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ color: Color.placeHolderGrey, fontFamily: Constants.fontFamilyRegular, fontSize: 17 }}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => {
                    props.navigation.replace('RegisterScreen')

                }} style={{ alignItems: 'center' }}><Text style={{ color: Color.secondary, fontFamily: Constants.fontFamilyBold, fontSize: 17 }}>sign up</Text></TouchableOpacity>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({

    flag_style: {
        width: 38,
        height: 24
    },
});


export default LoginScreen;
