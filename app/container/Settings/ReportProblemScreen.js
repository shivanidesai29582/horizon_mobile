import React, { useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Header } from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import { SettingsStyle } from './SettingsStyle'
import { useTheme } from './../../Context';
import FieldComonent from "../../Components/FieldComonent";
import Button1Component from "../../Components/Button1Component";
import { launchImageLibrary } from 'react-native-image-picker';
import global from "./../../common/globals";
import { get } from "./../../storage"
import { addReport } from "./../../redux/userlogin"
import ErrorText from './../../Components/ErrorText';

import axios from 'axios';

const options = {
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    cameraType: 'back',
    includeBase64: false,
    saveToPhotos: false
}

const ReportProblemScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [incorrectTitle, setIncorrectTitle] = useState(false);
    const [incorrectDescription, setIncorrectDescription] = useState(false);
    const [image, setImage] = useState('');


    const pickImageFromGallery = () => {
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                // console.log('User cancelled image picker')
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton)
            } else {

                if (response.assets && response.assets.length > 0) {
                    const value = response.assets[0]
                    if (value) {
                        value.uri = Platform.OS == 'ioss' ? value.uri.replace('file://', '/private') : value.uri
                        value.name = value.fileName;
                        setImage(value.uri)
                    } else {
                        // toast('Something went wrong, please try again')
                    }
                } else {
                    // toast('Something went wrong, please try again')
                }

            }
        })
    }

    const onImageUpload = async () => {
        setLoading(true);
        if (image !== '') {
            let storageToken = await get('horizon_token');

            let formData = new FormData();

            formData.append("file", {
                uri: image,
                type: 'image/jpeg',
                name: `dummy${Date.now()}.jpg`
            });

            axios.post(`${global.HORIZON_BASE_URL}/attachments`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${storageToken}`
                },
            }
            ).then((response) => {
                const data = { subject: title, description, status: 'Active', attachments: [`${response?.data?.image}`] }
                dispatch(addReport(data)).then(() => {
                    setLoading(false);
                    props.navigation.pop()
                })
            }).catch((error) => {
                setLoading(false);
            })

        } else {
            const data = { subject: title, description, status: 'Active' }
            dispatch(addReport(data)).then(() => {
                setLoading(false);
                props.navigation.pop()

            })
        }

    }

    const onSubmit = () => {
        handleValidTitle();
        handleValidDesc();

        if (title !== '' && description !== "") {
            onImageUpload()
        }

    }

    const handleValidTitle = () => {
        if (title == "") {
            setIncorrectTitle(true);
        } else if (title !== "") {
            setIncorrectTitle(false);
        }
    }

    const handleValidDesc = () => {
        if (description == "") {
            setIncorrectDescription(true);
        } else if (description !== "") {
            setIncorrectDescription(false);
        }
    }


    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>
            <Header isShownSearch={false} title={"Report Problem"} onBackPress={() => {
                props.navigation.pop()
            }} />


            <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>

                <Text style={{
                    fontSize: 25,
                    fontFamily: Constants.fontFamilyBold,
                    color: theme.textColor,
                    marginTop: 15,
                    includeFontPadding: false,
                    padding: 0
                }}>Send Problem</Text>

                <FieldComonent exterViewStyle={{ marginTop: 10 }} value={title} title={'Title'} onChangeText={(text) => { setTitle(text) }} >
                    <Ionicons name={"document-text-outline"} size={22} color={'black'} style={{ marginHorizontal: 5, alignSelf: 'center' }} />
                </FieldComonent>
                {incorrectTitle ? <ErrorText title={'Please add title'} titleColor={theme.deletetextColor}></ErrorText> : null}

                <FieldComonent exterViewStyle={{ marginTop: 10 }} value={description} title={'description'} onChangeText={(text) => { setDescription(text) }}>
                    <Ionicons name={"document-text-outline"} size={22} color={'black'} style={{ marginHorizontal: 5, alignSelf: 'center' }} />
                </FieldComonent>
                {incorrectDescription ? <ErrorText title={'Please add description'} titleColor={theme.deletetextColor}></ErrorText> : null}

                <TouchableOpacity style={{ marginTop: 10, paddingVertical: 7, flexDirection: "row", alignItems: "center", backgroundColor: '#F4F4F4', borderRadius: 30 }} onPress={() => pickImageFromGallery()} >
                    <Text style={{ paddingHorizontal: 30, fontSize: 14, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}>Choose images from Library</Text>
                </TouchableOpacity>



                <View style={{ alignItems: 'center', marginVertical: 30 }}>

                    <Button1Component visible={loading} onPress={() => { onSubmit() }} extraviewstyle={{ width: '45%' }} title={'Submit'} />
                </View>


            </View>

        </SafeAreaView>
    );

}

export default ReportProblemScreen;
