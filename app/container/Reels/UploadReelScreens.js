import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Platform } from 'react-native';
import Color from "../../common/Color";
import FieldComonent from "../../Components/FieldComonent";
import LoginHeader from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import globals from "./../../common/globals";
import { get } from "./../../storage"
import { addReel, editReel } from "./../../redux/reels"
import { useDispatch } from 'react-redux';
import { useTheme } from './../../Context';
import Video from 'react-native-video';

import axios from 'axios';
import ErrorText from '../../Components/ErrorText';


const UploadReelScreens = (props) => {
    const { theme } = useTheme();

    const dispatch = useDispatch();
    const EditData = props?.route?.params?.item;
    const videoURL = EditData ? EditData?.video_url : props?.route?.params?.data?.path;
    const duration = EditData ? EditData?.duration : props?.route?.params?.data?.duration;

    const [title, setTitle] = useState(EditData ? EditData?.title : '');
    const [description, setDescription] = useState(EditData ? EditData?.description : '');
    const [loading, setLoading] = useState(false);
    const [incorrectTitle, setIncorrectTitle] = useState(false);
    const [incorrectDescription, setIncorrectDescription] = useState(false);


    const onSubmit = () => {
        handleValidTitle();
        handleValidDesc();

        if (videoURL !== "" && title !== '' && description !== "") {
            onRealUpload();
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

    const onRealUpload = async () => {
        setLoading(true);

        if (EditData) {
            const data = { title, description }
            dispatch(editReel(data, EditData?.id)).then(() => {
                setLoading(false);
                props.navigation.pop();
            })
        }
        else {


            let storageToken = await get('horizon_token');

            let formData = new FormData();

            formData.append("attachment", {
                uri: videoURL,
                type: 'video/mp4',
                name: `dummy${Date.now()}.mp4`
            });

            axios.post(`${globals.HORIZON_BASE_URL}/attachments/video`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${storageToken}`
                },
            }
            ).then((response) => {
                const data = { title, description, duration, thumbnail_url: `${response?.data?.ssResponse?.Location}`, video_type: "", video_url: `${response?.data?.videoResponse?.Location}` }
                dispatch(addReel(data)).then(() => {
                    setLoading(false);

                    props.navigation.pop2();
                })

            }).catch((data) => {
                setLoading(false);
                const error =
                    data.hasOwnProperty('response') && data.response != undefined
                        ? data.response.data
                        : data;

            })
        }

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <ScrollView showsHorizontalScrollIndicator={false}>
                <LoginHeader onBackPress={() => {
                    props.navigation.pop()
                }} />

                <Video
                    source={{
                        uri: videoURL,
                    }}
                    autoPlay={true}
                    repeat={true}
                    resizeMode={'cover'}
                    muted={true}
                    style={{
                        width: 250,
                        height: 300,
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#fff',
                        alignSelf: 'center'
                    }}
                    playInBackground={false}
                    ignoreSilentSwitch={'ignore'}
                />
                <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>

                    <Text style={{
                        fontSize: 25,
                        fontFamily: Constants.fontFamilyBold,
                        color: theme.textColor,
                        marginTop: 15,
                        includeFontPadding: false,
                        padding: 0
                    }}>Upload Reel</Text>


                    <FieldComonent exterViewStyle={{ marginTop: 10 }} value={title} title={'Title'} onChangeText={(text) => { setTitle(text) }} >
                        <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>
                    {incorrectTitle ? <ErrorText title={'Please add title'} titleColor={theme.deletetextColor}></ErrorText> : null}

                    <FieldComonent exterViewStyle={{ marginTop: 10 }} value={description} title={'description'} onChangeText={(text) => { setDescription(text) }}>
                        <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>
                    {incorrectDescription ? <ErrorText title={'Please add description'} titleColor={theme.deletetextColor}></ErrorText> : null}

                    <View style={{ alignItems: 'center', marginVertical: 30 }}>

                        <Button1Component visible={loading} onPress={() => { onSubmit() }} extraviewstyle={{ width: '100%' }} title={EditData ? 'Edit Reel' : 'Upload Reel'} />
                    </View>


                </View>


            </ScrollView>
        </SafeAreaView>
    );
}

export default UploadReelScreens;