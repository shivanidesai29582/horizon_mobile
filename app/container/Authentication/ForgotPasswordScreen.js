import React, { useState } from 'react';
import { Image, SafeAreaView, Text, View, TextInput } from 'react-native';
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from '../../Context';
import { get, set } from './../../storage';
import axios from 'axios';
import globals from "../../common/globals"
import ErrorText from '../../Components/ErrorText';

const ForgotPasswordScreen = (props) => {
    const { theme } = useTheme();
    // State
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [new2password, setNew2Password] = useState('');
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [incorrectText, setIncorrectText] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);


    const handleValidPassword = (text) => {
        const regx = /^([a-zA-Z0-9]).{8,32}$/;
        return text.match(regx);
    };

    const validationCheck = () => {
        let status = false;

        if (handleValidPassword(newPassword) && handleValidPassword(new2password) && newPassword === new2password) {
            status = true;
        } else {
            status = false;
        }

        if (newPassword === '') {
            setIncorrectPassword(true);
            setIncorrectText("Please input new password");
            return;
        } else if (new2password === '') {
            setIncorrectPassword(true);
            setIncorrectText("Please input confirm new password");
            return;
        } else if (newPassword !== new2password) {
            setIncorrectPassword(true);
            setIncorrectText('Confirm password does not match');
            return;
        } else if (!handleValidPassword(currentPassword)) {
            setIncorrectPassword(true);
            setIncorrectText('Please input valid old password');
            return;
        } else if (!handleValidPassword(newPassword)) {
            setIncorrectPassword(true);
            setIncorrectText('Please input valid new password');
            return;
        } else if (!handleValidPassword(new2password)) {
            setIncorrectPassword(true);
            setIncorrectText('Please input valid confirm new password');
            return;
        } else {
            setIncorrectPassword(false);
        }

        return status;
    };

    const onChangePassword = async () => {
        setLoading(true);

        if (validationCheck()) {
            const tmp_token = await get('tmp_horizon_token');

            axios.post(`${globals.HORIZON_BASE_URL}/auth/change-password`, { isForgotPassword: true, oldPassword: `${newPassword}`, newPassword: `${newPassword}` }, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${tmp_token}`
                },
            })
                .then((response) => {
                    setLoading(false);
                    if (response?.data?.statusCode === 200) {
                        set('horizon_token', tmp_token, true);
                        props.navigation.replace('HomeStack');
                    } else {
                        setIncorrectPassword(true);
                        setIncorrectText(response?.response?.data?.message)
                    }

                }).catch((error) => {
                    setLoading(false);
                    setIncorrectPassword(true);
                    setIncorrectText(response?.response?.data?.message)
                })

        } else {
            setLoading(false);

        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, paddingHorizontal: 20, alignItems: "center", justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'LobsterTwo-Bold', fontSize: 44, lineHeight: 66, color: 'black', textTransform: 'uppercase' }}>Horizon</Text>
                <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", backgroundColor: '#F4F4F4', alignItems: "center", borderRadius: 30, marginTop: 30 }}>
                    <Image source={require('../../Images/passwordIcon.png')} resizeMode={"contain"}
                        style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    <TextInput secureTextEntry={!showNewPassword} value={newPassword} onChangeText={(text) => { setNewPassword(text) }} style={{ marginHorizontal: 15, fontSize: 17, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: 'black' }} placeholderTextColor={'#B9B8BC'} placeholder={'new Password'}></TextInput>
                    <Ionicons name={!showNewPassword ? 'eye-outline' : 'eye-off-outline'} color={'black'} size={20} onPress={() => { setShowNewPassword(() => !showNewPassword) }} />
                </View>
                <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", backgroundColor: '#F4F4F4', alignItems: "center", borderRadius: 30, marginTop: 30 }}>
                    <Image source={require('../../Images/passwordIcon.png')} resizeMode={"contain"}
                        style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    <TextInput secureTextEntry={!showNewConfirmPassword} value={new2password} onChangeText={(text) => { setNew2Password(text) }} style={{ marginHorizontal: 15, fontSize: 17, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: 'black' }} placeholderTextColor={'#B9B8BC'} placeholder={'Confirm new Password'}></TextInput>
                    <Ionicons name={!showNewConfirmPassword ? 'eye-outline' : 'eye-off-outline'} color={'black'} size={20} onPress={() => { setShowNewConfirmPassword(() => !showNewConfirmPassword) }} />
                </View>

                {incorrectPassword ? <ErrorText title={incorrectText} titleColor={theme.deletetextColor}></ErrorText> : null}

                <View style={{ flexDirection: 'row', marginTop: 40, alignItems: 'center', marginBottom: 10 }}>
                    <Button1Component visible={loading} onPress={() => { onChangePassword(); }} extraviewstyle={{ width: '80%' }} title={'Change Password'} />
                </View>
            </View>
        </SafeAreaView >
    );
}



export default ForgotPasswordScreen;
