import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, DeviceEventEmitter } from 'react-native';
import FieldComonent from "../../Components/FieldComonent";
import LoginHeader from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import { get } from '../../storage';
import axios from 'axios';
import globals from '../../common/globals';
import { useDispatch } from 'react-redux';
import { useTheme } from './../../Context';
import { addStorie } from "./../../redux/storie"

const AddStoryScreens = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [selectLocation, setSelectLocation] = useState('');
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState(props?.route?.params?.coordinates);
    const [locationName, setLocationName] = useState('Select Location');
    const imageurl = props?.route?.params?.imageurl;

    useEffect(() => {
        DeviceEventEmitter.addListener('setstoryLocation', (value) => {
            setLocationName(value?.name);
            setLocation(value?.location);
        });
    }, [1])

    const AddImages = async () => {
        setLoading(true);

        let storageToken = await get('horizon_token');

        let formData = new FormData();

        formData.append("file", {
            uri: imageurl,
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
            AddStory(response?.data?.image);
        }).catch((error) => {
            setLoading(false);

        })

    }

    const AddStory = (imageuploadurl) => {
        const latitude = `${location?.latitude}`;
        const longitude = `${location?.longitude}`;
        const image_url = `${imageuploadurl}`;
        dispatch(addStorie({ latitude, longitude, caption, image_url })).then(() => {
            setLoading(false);
            props.navigation.pop(2);
        }).catch((error) => {
            setLoading(false);
        })

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

            <LoginHeader onBackPress={() => {
                props.navigation.pop()
            }} />

            <View style={{ padding: 20, flex: 1 }}>

                <Image source={{ uri: imageurl }} style={{
                    height: '65%',
                    width: undefined,
                    aspectRatio: 0.74,
                    alignSelf: 'center'
                }} />

                <TouchableOpacity onPress={() => { props.navigation.navigate('AddLocation', { location, TYPE: 'story' }) }} style={{ paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: '#9F9696', borderRadius: 15, marginTop: 30 }}>
                    <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"} style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: theme.textColor }} />
                    {/* <TextInput editable={false} selectTextOnFocus={false} value={locationName} style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }} placeholderTextColor={'#B9B8BC'} placeholder={'Select Location'}></TextInput > */}
                    <Text numberOfLines={2} style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }} >{locationName} </Text >

                </TouchableOpacity>

                {/* <FieldComonent exterViewStyle={{ marginTop: 10 }} value={selectLocation} title={'Select Location'} onChangeText={(text) => {
                    setSelectLocation(selectLocation);
                }}>
                    <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: theme.textColor }} />
                </FieldComonent> */}

                <FieldComonent exterViewStyle={{ marginTop: 10 }} value={caption} title={'Caption'} onChangeText={(text) => {
                    setCaption(text)
                }}>
                    <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                </FieldComonent>

            </View>

            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Button1Component visible={loading} onPress={() => { AddImages() }} extraviewstyle={{ width: '90%' }} title={'Add Story'} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containar: {
        height: "100%",
        padding: 10
    },
    textTnput: {
        height: 50,
        backgroundColor: '#eee',
        marginVertical: 5
    }
})



export default AddStoryScreens;
