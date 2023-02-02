import React, { useState, useEffect, useRef } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, TextInput, StyleSheet, Keyboard, Platform, ScrollView } from 'react-native';
import Color from "../../common/Color";
import Button1Component from '../../Components/Button1Component';
import { toast } from "../../Omni";

import FieldComonent from "../../Components/FieldComonent";
import Constants from "../../common/Constants";
import { useDispatch } from 'react-redux';
import { signupwithmobile } from '../../redux/registration'
import GetLocation from 'react-native-get-location';
import Ionicons from "react-native-vector-icons/Ionicons";
import PhoneInput from 'react-native-phone-input'
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import global from "./../../common/globals";
import { get, remove } from './../../storage';
import OTPTextView from 'react-native-otp-textinput';
import ErrorText from '../../Components/ErrorText';
import { useTheme } from '../../Context';

const RegisterScreen = (props) => {
    const { theme } = useTheme();

    const dispatch = useDispatch();
    const phone_ref = useRef(null);

    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [password, setPassword] = useState('');
    const [referalToken, setReferalToken] = useState('');

    const [countryCode, setCountryCode] = useState(91);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [showpassword, setShowPassword] = useState(false);

    const [code, setCode] = useState();

    const [incorrectpassword, setIncorrectPassword] = useState(false);
    const [incorrectText, setIncorrectText] = useState('');

    const [confirm, setConfirm] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [counter, setCounter] = useState(0);
    const [fcmToken, setFcmToken] = useState(null);

    useEffect(() => {
        getFCMToken();
        getLocation();
        getRefToken();

        return () => {
            remove('horizon_referal_token')
        };

    }, []);

    const getFCMToken = async () => {
        try {
            const fcm_token = await get('fcm_token');
            setFcmToken(fcm_token);
        } catch (error) {
        }
    }

    const getRefToken = async () => {
        try {
            const ref_token = await get('horizon_referal_token');
            setReferalToken(ref_token);
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
            toast('Please enter your phone number');
        } else if (!phone_ref.current.isValidNumber()) {
            toast('Please enter a valid phone number');
        }
        else {
            check_phone_number();
        }
    }

    const handleValidPassword = () => {
        const regx = /^([a-zA-Z0-9]).{8,32}$/;
        return password.match(regx);
    };

    const check_phone_number = async () => {

        if (handleValidPassword()) {
            setLoading(true);

            axios.post(`${global.HORIZON_BASE_URL}/auth/check_mobile_login`, { phone: `${phoneNumber}`, country_code: `${countryCode}`, fcm_token: `${fcmToken}` }).then((response) => {

                if (response?.data?.statusCode === 200) {
                    signIn(phoneNumber);
                    setIncorrectPassword(false);
                } else {
                    setLoading(false);

                    toast(response?.data?.message)
                }

            }).catch((error) => {
                toast(error);

            })

        } else {
            setIncorrectPassword(true);
            setIncorrectText('In Password At least 1 alphabet, 1 number, and length should be 8 to 20 characters.')
        }
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

            const latitude = location === null ? "37.78825" : `${location?.latitude}`;
            const longitude = location === null ? "-122.4324" : `${location?.longitude}`;
            let referral_token = referalToken === null ? "9426016919N7cKlAj02022" : referalToken

            dispatch(signupwithmobile({ country_code: countryCode, latitude, longitude, phone: phoneNumber, referral_token, password, fcm_token: `${fcmToken}` })).then((response) => {
                setLoading(false);

                if (response.statusCode === 200) {
                    props.navigation.replace('RegisterSecondScreen');
                } else {

                    toast(response?.message)
                }
            }).catch(() => {
                console.log('signup error');
                setLoading(false);

            });
        }
    }, [authenticated]);



    useEffect(() => {
        if (confirm) {
            setLoading(false);
            const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [counter, confirm]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView showsHorizontalScrollIndicator={false}>
                <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'LobsterTwo-Bold', fontSize: 44, lineHeight: 66, color: 'black', textTransform: 'uppercase' }}>Horizon</Text>

                    {confirm ?
                        <>
                            <View style={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 10, marginLeft: 25 }}>
                                <Text style={{ color: Color.placeHolderGrey, fontFamily: Constants.fontFamilyRegular, fontSize: 14 }}> Enter the OTP you received to </Text>
                                <Text style={{ color: 'black', fontFamily: Constants.fontFamilySemiBold, fontSize: 15, marginTop: 5 }}> {(phoneNumber) ? phoneNumber.replace(/^(.{3})(.{5})(.*)$/, "$1 $2 $3") : ''} </Text>
                            </View>
                            {/* <FieldComonent exterViewStyle={{ marginTop: 20 }} value={code} title={'Enter your OTP'} keyboardType="numeric" style={{paddingHorizontal: 20, paddingVertical: 5, alignItems: "center", backgroundColor: '#F4F4F4', borderRadius: 30, marginTop: 30}} onChangeText={(text) => { setCode(text); }}>
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"} style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent> */}
                            <View>
                                <OTPTextView
                                    containerStyle={styles.textInputContainer}
                                    textInputStyle={styles.roundedTextInput}
                                    handleTextChange={(text) => { setCode(text); }}
                                    inputCount={6}
                                    keyboardType="numeric"
                                    tintColor={Color.secondary}
                                    selectionColor={Color.secondary}
                                />
                            </View>

                            {counter !== 0 ?
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20, marginRight: 25 }}>
                                    <Text style={{ color: 'gray', padding: 0, alignItems: 'flex-end' }}> Resend OTP in {counter} Seconds </Text>
                                </View>
                                : null}
                            {confirm && counter == 0 ?
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20, marginTop: 5, marginRight: 25 }}>
                                    <TouchableOpacity onPress={() => {
                                        check_phone_number()
                                    }} style={{ alignItems: 'flex-end' }}><Text style={{ color: Color.secondary, fontFamily: Constants.fontFamilyBold, fontSize: 14 }}>Resend OTP</Text></TouchableOpacity>
                                </View>
                                : null
                            }
                            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                {/* {confirm && counter == 0 ? <Button1Component visible={loading} onPress={() => { check_phone_number() }} title={'Resend OTP'} /> : null} */}
                                <Button1Component visible={loading} onPress={() => { confirmVerificationCode(code) }} title={'Confirm OTP'} />
                            </View>
                        </>
                        :
                        <>
                            <View style={{ paddingHorizontal: 20, paddingVertical: 5, alignItems: "center", backgroundColor: '#F4F4F4', borderRadius: 30, marginTop: 30 }}>
                                <PhoneInput
                                    ref={phone_ref}
                                    flagStyle={styles.flag_style}
                                    initialCountry="in"
                                    offset={10}
                                    style={{ paddingVertical: 10, }}
                                    textStyle={{ height: Platform.OS === "ios" ? null : 30, fontFamily: Constants.fontFamilyRegular, color: 'black', fontSize: 17 }}
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
                            <View style={{ paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", backgroundColor: '#F4F4F4', borderRadius: 30, marginTop: 30 }}>
                                <Image source={require('../../Images/passwordIcon.png')} resizeMode={"contain"}
                                    style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                                <TextInput onSubmitEditing={() => { check_validation() }} secureTextEntry={!showpassword} value={password} onChangeText={(text) => { setPassword(text) }} style={{ marginHorizontal: 15, fontSize: 17, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: 'black' }} placeholderTextColor={Color.placeHolderGrey} placeholder={'Password'}></TextInput >
                                <Ionicons name={!showpassword ? 'eye-outline' : 'eye-off-outline'} color={'black'} size={20} onPress={() => { setShowPassword(() => !showpassword) }} />
                            </View>
                            <FieldComonent exterViewStyle={{ marginTop: 30 }} value={referalToken} title={'Referral Token'} onChangeText={(text) => {
                                setReferalToken(text);
                            }}>
                                <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                    style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                            </FieldComonent>
                            <View style={{ alignItems: 'center' }}>
                                {incorrectpassword ? <ErrorText title={incorrectText} titleColor={theme.deletetextColor}></ErrorText> : null}
                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                    {/* <TouchableOpacity style={{ paddingVertical: 14, paddingHorizontal: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: Color.yellow }} onPress={() => { check_validation() }}>
                                    <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 22, lineHeight: 26, color: 'black' }}>Sign up</Text>
                                </TouchableOpacity> */}
                                    <Button1Component visible={loading} onPress={() => { check_validation() }} extraviewstyle={{ width: '50%' }} title={'Sign Up'} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                                <Text style={{ color: Color.placeHolderGrey, fontFamily: Constants.fontFamilyRegular, fontSize: 17, }}>Already have an Account? </Text>
                                <TouchableOpacity onPress={() => {
                                    props.navigation.replace('LoginScreen')
                                }} style={{ alignItems: 'center' }}><Text style={{ color: Color.secondary, fontFamily: Constants.fontFamilyBold, fontSize: 17 }}>Log in</Text></TouchableOpacity>
                            </View>
                        </>
                    }


                </View>
            </ScrollView>
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

export default RegisterScreen;
