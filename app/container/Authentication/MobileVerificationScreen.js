import React, { useState, useEffect, useRef } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, ScrollView, StyleSheet, Keyboard, Platform } from 'react-native';
import Color from "../../common/Color";
import { toast } from '../../Omni';
import FieldComonent from "../../Components/FieldComonent";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import GetLocation from 'react-native-get-location';
import { useTheme } from './../../Context';
import PhoneInput from 'react-native-phone-input'
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import global from "./../../common/globals";
import { get, set } from './../../storage';
import OTPTextView from 'react-native-otp-textinput';

const MobileVerificationScreen = (props) => {

    const { theme } = useTheme();
    const phone_ref = useRef(null);

    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [countryCode, setCountryCode] = useState(91);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [code, setCode] = useState();
    const [confirm, setConfirm] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [counter, setCounter] = useState(0);
    const [fcmToken, setFcmToken] = useState(null);
    const [appToken, setAppToken] = useState(null);

    useEffect(() => {
        getFCMToken();
        getLocation();
    }, []);

    const getFCMToken = async () => {
        try {
            const fcm_token = await get('fcm_token');
            setFcmToken(fcm_token);

        } catch (error) {
        }
    }

    const getLocation = () => {

        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
        })
            .then(location => {
                setLocation(location);
            })
            .catch(error => {

                // Linking.openSettings();

            })
    }

    const check_validation = async () => {
        Keyboard.dismiss();
        if ('+' + phone_ref.current.getCountryCode() == phone_ref.current.getValue()) {
            toast('Please enter your phone number')
        } else if (!phone_ref.current.isValidNumber()) {
            toast('Please enter a valid phone number')
        }
        else {
            check_phone_number();
        }
    }



    const check_phone_number = async () => {

        setLoading(true);

        axios.post(`${global.HORIZON_BASE_URL}/auth/check_mobile_login`, { phone: `${phoneNumber}`, country_code: `${countryCode}` }).then((response) => {
            if (response?.data?.statusCode === 400) {
                setAppToken(response?.data.token);
                signIn(phoneNumber);
            } else {
                setLoading(false);
                toast(response?.data?.message)
            }

        }).catch((error) => {
            toast(error);

        })

    }

    async function signIn(phoneNumber) {
        if (phoneNumber !== null) {
            try {
                const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
                setConfirm(confirmation);
                setCounter(129);
            } catch (error) {
                toast(error);
            }
        }
    }

    async function confirmVerificationCode(code) {
        setLoading(true);
        try {
            await confirm.confirm(code);
            setConfirm(null);
        } catch (error) {
            toast('Invalid OTP');
            setLoading(false);

        }
    }

    auth().onAuthStateChanged((user) => {
        if (user) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    })

    useEffect(() => {
        if (authenticated) {
            nextPage();
        }
    }, [authenticated]);

    const nextPage = async () => {
        await set('tmp_horizon_token', appToken, true);
        props.navigation.replace('ForgotPasswordScreen')
    }


    useEffect(() => {
        if (confirm) {
            setLoading(false);
            const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [counter, confirm]);

    return (<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {/* <ScrollView showsHorizontalScrollIndicator={false} > */}
        <View style={{ padding: 20, flex: 1 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../Images/ic_lock.png')} style={{
                    height: undefined,
                    width: '50%',
                    aspectRatio: 1,
                    alignSelf: 'center'
                }} />
                <Text style={{
                    fontSize: 25,
                    fontFamily: Constants.fontFamilyBold,
                    color: 'black',
                    marginTop: 15,
                    includeFontPadding: false,
                    padding: 0
                }}>Forgot Password</Text>
                <Text style={{
                    fontSize: 18,
                    color: Color.placeHolderGrey,
                    fontFamily: Constants.fontFamilyRegular,
                    textAlign: 'left'
                }}>{'Forgot password to access your account'}</Text>
            </View>
            {confirm ?
                <View style={{ flex: 1 }}>
                    {/* <FieldComonent exterViewStyle={{ marginTop: 30 }} value={code} title={'Enter your OTP'} keyboardType="numeric" onChangeText={(text) => {
                        setCode(text);
                    }}>
                        <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: theme.textColor }} />
                    </FieldComonent> */}
                    <OTPTextView
                        containerStyle={styles.textInputContainer}
                        textInputStyle={styles.roundedTextInput}
                        handleTextChange={(text) => { setCode(text); }}
                        inputCount={6}
                        keyboardType="numeric"
                        tintColor={Color.secondary}
                        selectionColor={Color.secondary}
                    />

                    {counter !== 0 ? <Text style={{
                        color: theme.textColor,
                        marginTop: 5,
                        padding: 0
                    }}> Resend OTP in {counter} Seconds </Text>
                        : null}

                    {/* <View style={{ marginTop: 50 }} /> */}
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        {/* <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: Color.textColor, fontFamily: Constants.fontFamilyRegular, alignItems: 'center' }}>Already have an Account? </Text>
                            <TouchableOpacity onPress={() => {
                                props.navigation.pop()
                            }} style={{ alignItems: 'center' }}><Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold }}>Login</Text></TouchableOpacity>
                        </View> */}
                        {confirm && counter == 0 ?
                            // <Button1Component visible={loading} onPress={() => { check_phone_number() }} extraviewstyle={{ width: '90%' }} title={'Resend OTP'} /> 
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20, marginTop: 5, marginRight: 25 }}>
                                <TouchableOpacity onPress={() => { check_phone_number() }} style={{ alignItems: 'flex-end' }}>
                                    <Text style={{ color: Color.secondary, fontFamily: Constants.fontFamilyBold, fontSize: 14 }}>Resend OTP</Text>
                                </TouchableOpacity>
                            </View>
                            : null}
                        <Button1Component visible={loading} onPress={() => { confirmVerificationCode(code) }} extraviewstyle={{ width: '90%' }} title={'Confirm OTP'} />
                    </View>
                </View>
                :
                <View style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 5, paddingHorizontal: 20, alignItems: "center", backgroundColor: '#F4F4F4', borderRadius: 30, marginTop: 30 }}>
                        <PhoneInput
                            ref={phone_ref}
                            flagStyle={styles.flag_style}
                            initialCountry="in"
                            offset={10}
                            style={{ marginVertical: 10, }}
                            textStyle={{ height: Platform.OS === "ios" ? null : 30, fontFamily: Constants.fontFamilyRegular, color: 'black', fontSize: 16 }}
                            textProps={{
                                placeholder: 'phone number',
                                placeholderTextColor: Color.placeHolderGrey
                            }}
                            allowZeroAfterCountryCode={false}
                            autoFormat={true}
                            onChangePhoneNumber={(value) => {
                                setCountryCode(phone_ref.current.getCountryCode());
                                setPhoneNumber(value.replace(/ /g, ''))
                            }}
                        />
                    </View>
                    {/* <View style={{ marginTop: 20 }} /> */}
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        {/* <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: Color.textColor, fontFamily: Constants.fontFamilyRegular, alignItems: 'center' }}>Already have an Account? </Text>
                            <TouchableOpacity onPress={() => {
                                props.navigation.replace('LoginScreen')
                            }} style={{ alignItems: 'center' }}><Text style={{ color: Color.secondary, fontFamily: Constants.fontFamilyBold }}>Login</Text></TouchableOpacity>
                        </View> */}
                        <Button1Component visible={loading} onPress={() => { check_validation() }} extraviewstyle={{ width: '50%', backgroundColor: 'yellow', color: "black" }} title={'Get OTP'} />
                    </View>
                </View>
            }
        </View>
        {/* </ScrollView> */}
    </SafeAreaView >
    )
}

const styles = StyleSheet.create({

    flag_style: {
        width: 38,
        height: 24
    },
    textInputContainer: {
        marginVertical: 10,
    },
    roundedTextInput: {
        borderRadius: 10,
        width: 40,
        borderWidth: 1,
        fontSize: 16
    },
});

export default MobileVerificationScreen;
