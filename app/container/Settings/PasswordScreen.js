import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, View, Dimensions, TextInput } from 'react-native';
import { Header } from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import { useDispatch } from 'react-redux';
import { changePassword } from '../../redux/userlogin'
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from '../../Context';
import { toast } from "../../Omni";
import ErrorText from '../../Components/ErrorText';
const { height } = Dimensions.get("window");

const PasswordScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [new2password, setNew2Password] = useState('');
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [incorrectText, setIncorrectText] = useState('');
    const [showcurrentpassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);

    const handleValidPassword = (text) => {
        const regx = /^([a-zA-Z0-9]).{8,32}$/;
        return text.match(regx);
    };

    const validationCheck = () => {
        let status = false;

        if (handleValidPassword(currentPassword) && handleValidPassword(newPassword) && handleValidPassword(new2password) && newPassword === new2password) {
            status = true;
        } else {
            status = false;
        }

        if (currentPassword === '') {
            setIncorrectPassword(true);
            setIncorrectText("Please input old password");
            return;
        } else if (newPassword === '') {
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



    const onChangePassword = () => {
        setLoading(true);

        if (validationCheck()) {


            dispatch(changePassword({ oldPassword: `${currentPassword}`, newPassword: `${newPassword}` })).then((response) => {
                setLoading(false);
                if (response.statusCode === 200) {
                    toast(response.message);
                    props.navigation.pop()
                } else {
                    setIncorrectPassword(true);
                    setIncorrectText(response?.response?.data?.message)
                }

            })

        } else {
            setLoading(false);

        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <Header isShownSearch={false} title={"Change Password"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView scrollEnabled={650 > height ? true : false} showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}  >

                <View style={{ padding: 20, flex: 1 }}>
                    <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", backgroundColor: '#F4F4F4', alignItems: "center", borderRadius: 30, marginTop: 30 }}>
                        <Image source={require('../../Images/passwordIcon.png')} resizeMode={"contain"}
                            style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        <TextInput secureTextEntry={!showcurrentpassword} value={currentPassword} onChangeText={(text) => { setCurrentPassword(text) }} style={{ marginHorizontal: 15, fontSize: 17, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: 'black' }} placeholderTextColor={'#B9B8BC'} placeholder={'Current Password'}></TextInput >
                        <Ionicons name={!showcurrentpassword ? 'eye-outline' : 'eye-off-outline'} color={'black'} size={20} onPress={() => { setShowCurrentPassword(() => !showcurrentpassword) }} />
                    </View>

                    <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", backgroundColor: '#F4F4F4', alignItems: "center", borderRadius: 30, marginTop: 30 }}>
                        <Image source={require('../../Images/passwordIcon.png')} resizeMode={"contain"}
                            style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        <TextInput secureTextEntry={!showNewPassword} value={newPassword} onChangeText={(text) => { setNewPassword(text) }} style={{ marginHorizontal: 15, fontSize: 17, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: 'black' }} placeholderTextColor={'#B9B8BC'} placeholder={'New Password'}></TextInput>
                        <Ionicons name={!showNewPassword ? 'eye-outline' : 'eye-off-outline'} color={'black'} size={20} onPress={() => { setShowNewPassword(() => !showNewPassword) }} />
                    </View>

                    <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", backgroundColor: '#F4F4F4', alignItems: "center", borderRadius: 30, marginTop: 30 }}>
                        <Image source={require('../../Images/passwordIcon.png')} resizeMode={"contain"}
                            style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        <TextInput secureTextEntry={!showNewConfirmPassword} value={new2password} onChangeText={(text) => { setNew2Password(text) }} style={{ marginHorizontal: 15, fontSize: 17, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: 'black' }} placeholderTextColor={'#B9B8BC'} placeholder={'Confirm new Password'}></TextInput>
                        <Ionicons name={!showNewConfirmPassword ? 'eye-outline' : 'eye-off-outline'} color={'black'} size={20} onPress={() => { setShowNewConfirmPassword(() => !showNewConfirmPassword) }} />
                    </View>

                    {incorrectPassword ? <ErrorText title={incorrectText} titleColor={theme.deletetextColor}></ErrorText> : null}

                    <View style={{ marginTop: 650 > height ? 0 : 50 }} />

                    <View style={{ alignItems: 'center', marginBottom: 10 }}>

                        <Button1Component visible={loading} onPress={() => { onChangePassword(); }} extraviewstyle={{ width: '72%' }} title={'Change Password'} />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}



export default PasswordScreen;
