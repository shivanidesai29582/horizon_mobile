import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from "../common/Constants";
import Button1Component from '../Components/Button1Component';
import { putUserUpdate, userAuth } from "./../redux/userlogin"
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../Context';
import FieldComonent from '../Components/FieldComonent';
import ErrorText from '../Components/ErrorText';

const BussinessEditScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.userlogin?.userInfo);
    const [loading, setLoading] = useState(false);
    const [username, setUserName] = useState(user?.username);
    const [description, setDescription] = useState(user?.professional_summery);
    const [businessName, setBusinessName] = useState(user?.first_name);
    const [businessWebsite, setBusinessWebsite] = useState('');
    const [incorrectBusinessName, setIncorrectBusinessName] = useState(false);

    useEffect(() => {
        dispatch(userAuth());
    }, []);


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
        if (handleName(businessName) && username !== "") {
            status = true;
        }

        if (!handleName(businessName)) {
            setIncorrectBusinessName(true);
        } else {
            setIncorrectBusinessName(false);
        }

        return status;
    };

    const onSave = () => {
        if (validationCheck()) {
            setLoading(true);
            const data = {
                professional_account: true,
                business_name: businessName,
                business_website: businessWebsite,
                professional_summery: description
            }

            dispatch(putUserUpdate(data)).then((response) => {
                setLoading(false);

                if (response.statusCode === 200) {
                    props.navigation.replace('HomeStack');
                } else {
                    alert(response?.message)
                }
            });
        }

    }

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


                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 18, textAlign: 'center', marginTop: 10 }}>Complete your profile</Text>
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 14, textAlign: 'center', marginTop: 10 }}>Add a profile photo, business name, bio and website to let people know who you are.</Text>

                <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Business Name</Text>
                <FieldComonent value={businessName} title={'Business Name'} onChangeText={(text) => {
                    setBusinessName(text);
                }} >
                    <Ionicons name={'business-outline'} color={theme.textColor} size={18} />
                </FieldComonent>
                {incorrectBusinessName ? <ErrorText title={'Enter You Business Name is Not Correct.'} titleColor={theme.deletetextColor}></ErrorText> : null}

                <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Username</Text>
                <FieldComonent value={username} title={'Username'} onChangeText={(text) => {
                    setUserName(text);
                }}>
                    <Ionicons name={'ios-person-outline'} color={theme.textColor} size={20} />
                </FieldComonent>

                <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Business website</Text>
                <FieldComonent value={businessWebsite} title={'Business website'} onChangeText={(text) => {
                    setBusinessWebsite(text);
                }} >
                    <Ionicons name={'ios-globe-outline'} color={theme.textColor} size={18} />
                </FieldComonent>

                <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Bio</Text>
                <FieldComonent value={description} title={'Bio'} onChangeText={(text) => {
                    setDescription(text);
                }}>
                    <Ionicons name={'create-outline'} color={theme.textColor} size={18} />
                </FieldComonent>
            </View>
        </ScrollView>

        <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>


            </View>
            <Button1Component visible={loading} onPress={() => { onSave() }} title={'Save'} extraviewstyle={{ bottom: 30, marginHorizontal: 120, marginVertical: 5, paddingHorizontal: 10, paddingVertical: 12 }}>
            </Button1Component>
        </View>
    </SafeAreaView>
    )
}

export default BussinessEditScreen;


