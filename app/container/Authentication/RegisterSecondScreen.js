import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, Text, View, ScrollView, Dimensions } from 'react-native';
import FieldComonent from "./../../Components/FieldComonent";
import { toast } from '../../Omni';
import Button1Component from "./../../Components/Button1Component";
import { useDispatch, useSelector } from 'react-redux';
import { userAuth, putUserUpdate } from './../../redux/userlogin'
import { useTheme } from './../../Context';
import { Constants } from "../../common";
import ErrorText from '../../Components/ErrorText';
const windowHeight = Dimensions.get('window').height;

const RegisterSecondScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.registration?.userInfo);

    useEffect(() => {
        dispatch(userAuth())
    }, []);

    const [email, setEmail] = useState('');
    const [username, setUserName] = useState(user?.username);
    const [firstName, setFirstName] = useState(user?.first_name);
    // const [lastName, setLastName] = useState(user?.last_name);
    const [description, setDescription] = useState(user?.professional_summery);
    const [incorrectemail, setIncorrectEmail] = useState(false);
    const [incorrectFirstName, setIncorrectFirstName] = useState(false);
    // const [incorrectLastName, setIncorrectLastName] = useState(false);
    const [incorrectUserName, setIncorrectUserName] = useState(false);
    const TextColor = '#000000';

    const handleValidEmail = () => {
        const regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        return email.match(regx);
    };


    const handleName = (text) => {
        const regx = /^([a-zA-Z]).{3,32}$/;

        if (text == null) {
            return false;
        } else {
            return text.match(regx);

        }
    };


    const validationCheck = () => {
        let status = false;
        if (handleValidEmail() && handleName(firstName) && username !== "") {
            status = true;
        }

        if (!handleValidEmail()) {
            setIncorrectEmail(true);
        } else {
            setIncorrectEmail(false);
        }

        if (!handleName(firstName)) {
            setIncorrectFirstName(true);
        } else {
            setIncorrectFirstName(false);
        }

        // if (!handleName(lastName)) {
        //     setIncorrectLastName(true);
        // } else {
        //     setIncorrectLastName(false);
        // }

        if (!username || username === "") {
            setIncorrectUserName(true);
        }
        else {
            setIncorrectUserName(false);
        }

        return status;
    };

    const onSave = () => {
        if (validationCheck()) {
            dispatch(putUserUpdate({ email, first_name: firstName, professional_summery: description, username })).then((response) => {

                if (response.statusCode === 200) {
                    props.navigation.replace('CollectionsScreen')
                } else {
                    toast(response?.message)
                }
            });
        }

    }


    return (<SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>


        <ScrollView showsHorizontalScrollIndicator={false} >

            <View style={{ padding: 20, flex: 1, height: windowHeight }}>


                <Text style={{ marginHorizontal: 15, fontSize: 17, paddingTop: 20, paddingBottom: 5, fontFamily: Constants.fontFamilySemiBold, color: TextColor }}>First Name</Text>
                <FieldComonent value={firstName} title={'First Name'} onChangeText={(text) => {
                    setFirstName(text);
                }} >
                    <Image source={require('./../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                </FieldComonent>

                {incorrectFirstName ? <ErrorText title='Enter You First Name is Not Correct.' titleColor={theme.deletetextColor}></ErrorText> : null}

                {/* <Text style={{ marginHorizontal: 15, fontSize: 17, paddingTop: 20, paddingBottom: 5, fontFamily: Constants.fontFamilySemiBold, color: TextColor }}>Last Name</Text>
                <FieldComonent value={lastName} title={'Last Name'} onChangeText={(text) => {
                    setLastName(text);
                }} >
                    <Image source={require('./../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: TextColor }} />
                </FieldComonent>
                {incorrectLastName ? <ErrorText title='Enter You Last Name is Not Correct.' titleColor={theme.deletetextColor}></ErrorText> : null} */}

                <Text style={{ marginHorizontal: 15, fontSize: 17, paddingTop: 20, paddingBottom: 5, fontFamily: Constants.fontFamilySemiBold, color: TextColor }}>Username</Text>
                <FieldComonent value={username} title={'Username'} onChangeText={(text) => {
                    setUserName(text);
                }}>
                    <Image source={require('./../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                </FieldComonent>
                {incorrectUserName ? <ErrorText title='Enter username.' titleColor={theme.deletetextColor}></ErrorText> : null}

                <Text style={{ marginHorizontal: 15, fontSize: 17, paddingTop: 20, paddingBottom: 5, fontFamily: Constants.fontFamilySemiBold, color: TextColor }}>Email ID</Text>
                <FieldComonent value={email} title={'example@gmail.com'} onChangeText={(text) => {
                    setEmail(text);
                }}>
                    <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                </FieldComonent>

                {incorrectemail ? <ErrorText title='Enter You Email is Not Correct.' titleColor={theme.deletetextColor}></ErrorText> : null}

                <Text style={{ marginHorizontal: 15, fontSize: 17, paddingTop: 20, paddingBottom: 5, fontFamily: Constants.fontFamilySemiBold, color: TextColor }}>Bio</Text>
                <FieldComonent value={description} title={'Bio'} onChangeText={(text) => {
                    setDescription(text);
                }}>
                    <Image source={require('./../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                </FieldComonent>

                <View style={{ marginTop: 50 }} />
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Button1Component onPress={() => { onSave(); }} extraviewstyle={{ width: '90%' }} title={'Save'} />
                </View>

            </View>
        </ScrollView>

    </SafeAreaView>
    )
}

export default RegisterSecondScreen;

