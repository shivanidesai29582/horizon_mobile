import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import { toast } from '../../Omni';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsStyle } from './SettingsStyle'
import { useTheme } from './../../Context';
import { putUserUpdate, userAuth } from "./../../redux/userlogin"
import LoaderScreen from '../../Components/LoaderScreen';


const AccountScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const [isProfessional, setIsProfessional] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(userAuth()).then(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setIsProfessional(user?.professional_account);
    }, [user]);

    const onSave = () => {
        if (!isProfessional) {
            props.navigation.navigate('ProffessionalScreen')
        } else {
            setLoading(true);

            const data = {
                professional_account: !isProfessional,
            }

            dispatch(putUserUpdate(data)).then((response) => {
                setLoading(false);
                if (response.statusCode === 200) {
                    props.navigation.pop(2)
                } else {
                    toast(response?.message)
                }
            });
        }

    }
    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>
            <Header isShownSearch={false} title={"Account"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }}>
                <LoaderScreen visible={loading} />

                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('PersonalScreen')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Personal information</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        props.navigation.navigate('CloseFriendsScreen')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Close Friends</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!')

                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Language</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!')

                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Captions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!')

                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Browser settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!')

                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Sensitive content control</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!')

                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Contacts syncing</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        toast('We are working on it!')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Sharing to other apps</Text>
                    </TouchableOpacity> 

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => {
                        // props.navigation.navigate('FollowandInviteScreen')
                    }} >
                        <Text style={SettingsStyle(theme).SubTitleStyle}>Request verification</Text>
                    </TouchableOpacity>  */}

                    <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => { onSave() }} >
                        <Text style={{ color: '#3483c8', fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Switch to {isProfessional ? 'normal' : 'professional'} account</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={SettingsStyle(theme).ViewStyle} onPress={() => { }} >
                        <Text style={{ color: '#3483c8', fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Add new professional account</Text>
                    </TouchableOpacity> */}

                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default AccountScreen;
