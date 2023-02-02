import React, { useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import FieldComonent from "./../Components/FieldComonent";
import Constants from "./../common/Constants";
import Button1Component from "./../Components/Button1Component";
import { useDispatch, useSelector } from 'react-redux';
import globals from "./../common/globals";
import ImagePickerDialog from '../Components/ImagePickerDialog';
import Ionicons from "react-native-vector-icons/Ionicons";
import { putUserUpdate } from "./../redux/userlogin"
import { get } from "./../storage"
import axios from 'axios';
import { useTheme } from './../Context';


const EditProfile = (props) => {
    const { theme } = useTheme();

    const dispatch = useDispatch();

    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const [loading, setLoading] = useState(false);


    const [username, setUserName] = useState(user?.username === null ? "unnamed" : user?.username);
    const [firstName, setFirstName] = useState(user?.first_name);
    // const [lastName, setLastName] = useState(user?.last_name);
    const [description, setDescription] = useState(user?.professional_summery);
    const [profileImage, setProfileImage] = useState({ uri: user?.profile_photo == null ? global.USER_PROFILE_URL : user?.profile_photo });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isProfileChange, setIsProfileChange] = useState(false);


    const onSave = () => {
        setLoading(true);
        const data = { first_name: firstName, professional_summery: description }
        isProfileChange ? ProfileUpload() : dispatch(putUserUpdate(data)).then(() => {
            setLoading(false);
            props.navigation.pop();
        });
    }


    const ProfileUpload = async () => {

        let storageToken = await get('horizon_token');

        let formData = new FormData();

        formData.append("file", {
            uri: profileImage?.uri,
            type: 'image/jpeg',
            name: `dummy${Date.now()}.jpg`
        });

        axios.post(`${globals.HORIZON_BASE_URL}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${storageToken}`
            },
        }
        ).then((response) => {
            const data = { first_name: firstName, professional_summery: description, profile_photo: `${response?.data?.image}` }
            dispatch(putUserUpdate(data)).then(() => {
                props.navigation.pop();
            })
        }).catch((error) => {

        })

    }


    return (<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>


        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, width: '100%', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => {
                setIsProfileChange(false);
                props.navigation.pop()
            }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: '#9F9696', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                onSave();
            }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: '#9F9696', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={'md-checkmark'} color={theme.textColor} size={20} />
            </TouchableOpacity>
        </View>

        <ImagePickerDialog isModalVisible={isModalVisible} setModalVisibility={setIsModalVisible} onImagePic={(value) => {

            setIsModalVisible(false);
            setIsProfileChange(true);
            setProfileImage({ uri: value?.uri })

        }} />

        <ScrollView showsHorizontalScrollIndicator={false} >

            <View style={{ padding: 20, flex: 1 }}>

                {/* <Image source={profileImage} style={{
                    height: undefined,
                    width: '35%',
                    aspectRatio: 1,
                    alignSelf: 'center',
                    borderRadius: 100,
                }} />

                <TouchableOpacity onPress={() => { setIsModalVisible(true) }}>
                    <Text style={{ textAlign: 'center', marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: '#3483c8' }}>
                        Change profile photo
                    </Text>
                </TouchableOpacity> */}

                <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, fl0ex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>User Name</Text>
                <FieldComonent value={username} title={'Username'}>
                    <Ionicons name={'ios-person-outline'} color={'black'} size={18} />
                </FieldComonent>

                <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, fl0ex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Full Name</Text>
                <FieldComonent value={firstName} title={'Full Name'} onChangeText={(text) => {
                    setFirstName(text);
                }} >
                    <Ionicons name={'ios-person-outline'} color={'black'} size={18} />
                </FieldComonent>

                {/* <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Last Name</Text>
                <FieldComonent value={lastName} title={'Last Name'} onChangeText={(text) => {
                    setLastName(text);
                }} >
                    <Image source={require('./../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                </FieldComonent> */}


                {/* <Text style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: '#FFFFFF' }}>Username</Text>
                <FieldComonent value={username} title={'Username'} onChangeText={(text) => {
                    setUserName(text);
                }}>
                    <Image source={require('./../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: '#fff' }} />
                </FieldComonent> */}


                <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Bio</Text>
                <FieldComonent value={description} title={'Bio'} onChangeText={(text) => {
                    setDescription(text);
                }}>
                    <Ionicons name={'information-circle-outline'} color={'black'} size={20} />
                </FieldComonent>

                <View style={{ marginTop: 50 }} />
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Button1Component visible={loading} onPress={() => { onSave(); }} exutraviewstyle={{ width: '40%' }} title={'Save'} />
                </View>

            </View>
        </ScrollView>

    </SafeAreaView>
    )
}

export default EditProfile;

