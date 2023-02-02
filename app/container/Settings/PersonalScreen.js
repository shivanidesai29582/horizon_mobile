import React, { useState, useEffect, useRef } from 'react';
import { Image, SafeAreaView, Text, View, ScrollView, StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import FieldComonent from "./../../Components/FieldComonent";
import { Header } from "../Components/LoginHeader";
import { toast } from '../../Omni';
import Constants from "./../../common/Constants";
import Button1Component from "./../../Components/Button1Component";
import { useDispatch, useSelector } from 'react-redux';
import { userAuth, putUserUpdate } from './../../redux/userlogin'
import { useTheme } from './../../Context';
import ErrorText from '../../Components/ErrorText';

const PersonalScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const phone_ref = useRef(null);
    const user = useSelector((state) => state?.userlogin?.userInfo);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState(91);
    const [username, setUserName] = useState('');
    const [incorrectemail, setIncorrectEmail] = useState(false);

    useEffect(() => {
        dispatch(userAuth())
    }, []);

    useEffect(() => {
        setEmail(user?.email);
        setPhone(user?.phone);
        setUserName(user?.username);
    }, [user]);

    const handleValidEmail = () => {
        const regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        return email?.match(regx);
    };


    const validationCheck = () => {
        let status = false;
        if (handleValidEmail() && username !== "") {
            status = true;
        }

        if (!handleValidEmail()) {
            setIncorrectEmail(true);
        } else {
            setIncorrectEmail(false);
        }

        return status;
    };

    const onSave = () => {
        if (validationCheck()) {
            setLoading(true);
            dispatch(putUserUpdate({ email, username })).then((response) => {
                setLoading(false);
                if (response.statusCode === 200) {
                    props.navigation.pop();
                } else {
                    toast(response?.message)
                }
            });
        }

    }


    return (<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

        <Header isShownSearch={false} title={"Personal information"} onBackPress={() => {
            props.navigation.pop()
        }} />

        <ScrollView showsHorizontalScrollIndicator={false} >

            <View style={{ padding: 20, flex: 1 }}>

                <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Username</Text>
                <FieldComonent value={username} title={'Username'} onChangeText={(text) => {
                    setUserName(text);
                }}>
                    <Ionicons name={'ios-person-outline'} color={'black'} size={18} />
                </FieldComonent>

                <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Email ID</Text>
                <FieldComonent value={email} title={'example@gmail.com'} onChangeText={(text) => {
                    setEmail(text);
                }}>
                    <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                </FieldComonent>

                {incorrectemail ? <ErrorText title={'Enter You Email is Not Correct.'} titleColor={theme.deletetextColor}></ErrorText> : null}

                <View style={{ marginTop: 50 }} />
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Button1Component visible={loading} onPress={() => { onSave(); }} extraviewstyle={{ width: '40%' }} title={'Save'} />
                </View>

            </View>
        </ScrollView>

    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    flag_style: {
        width: 38,
        height: 24
    },
});


export default PersonalScreen;

