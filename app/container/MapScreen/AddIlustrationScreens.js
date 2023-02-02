import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, DeviceEventEmitter, StyleSheet } from 'react-native';
import LoginHeader from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button1Component from "../../Components/Button1Component";
import { useDispatch } from 'react-redux';
import GetLocation from 'react-native-get-location'
import { AddIllustration } from "./../../redux/illustration"
import { useTheme } from './../../Context';
import { toast } from '../../Omni';
import { Dropdown } from 'react-native-element-dropdown';

const AddIlustrationScreens = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const [location, setLocation] = useState([]);
    const [dumylocation, setDumyLocation] = useState([]);
    const [locationName, setLocationName] = useState('Select Location');
    const [timing, setTiming] = useState('240');
    const [isFocus, setIsFocus] = useState(false);

    const data = [
        { label: '30min', value: '30' },
        { label: '1hr', value: '60' },
        { label: '2hr', value: '120' },
        { label: '3hr', value: '180' },
        { label: '4hr', value: '240' },

    ]

    useEffect(() => {
        DeviceEventEmitter.addListener('setillustrationLocation', (value) => {
            setLocationName(value?.name);
            setDumyLocation(value?.location);
        });
    }, [1])


    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = () => {

        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
        })
            .then(location => {
                setLocation(location);
                // AddFuture(location);
            })
            .catch(error => {
                // Linking.openSettings();
                toast('Please turn on your GPS');

            })
    }

    const checkValidation = () => {
        if (location.length !== 0 && dumylocation.length !== 0) {
            toast('location added successfully')
            AddIllustrations();
        } else if (location.length === 0) {
            getLocation();
        } else {
            toast('Please add your illustration location')

        }
    }

    const AddIllustrations = () => {

        const latitude = `${dumylocation?.latitude}`;
        const longitude = `${dumylocation?.longitude}`;
        const actual_latitude = `${location?.latitude}`;
        const actual_longitude = `${location?.longitude}`;

        dispatch(AddIllustration({ latitude, longitude, actual_latitude, actual_longitude })).then(() => props.navigation.pop())

    }




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <LoginHeader onBackPress={() => {
                props.navigation.pop()
            }} />

            <View style={{ padding: 20, flex: 1 }}>

                <Image source={require('../../Images/addIllustrationImage.png')} style={{
                    height: '50%',
                    width: undefined,
                    aspectRatio: 0.97,
                    alignSelf: 'center'
                }} />
                <Text style={{
                    fontSize: 25,
                    fontFamily: Constants.fontFamilyBold,
                    color: theme.textColor,
                    marginTop: 15,
                    includeFontPadding: false,
                    padding: 0
                }}>Add Illustration</Text>

                <TouchableOpacity onPress={() => { props.navigation.navigate('AddLocation', { location, TYPE: 'illustration' }) }} style={{ paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", backgroundColor: '#F4F4F4', borderRadius: 30, marginTop: 30 }}>
                    <Ionicons name={'location-outline'} color={'black'} size={20} />
                    {/* <TextInput editable={false} selectTextOnFocus={false} value={locationName} style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }} placeholderTextColor={'#B9B8BC'} placeholder={'Select Location'}></TextInput > */}
                    <Text numberOfLines={2} style={{ marginHorizontal: 15, fontSize: 17, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: 'black' }} >{locationName} </Text >

                </TouchableOpacity>


                <Dropdown
                    style={[Platform.OS == 'ios' ? styles.iosDropUpDownStyle : styles.androidDropUpDownStyle, { backgroundColor: '#F4F4F4', borderRadius: 30, marginTop: 10 }]}
                    placeholderStyle={[styles.droupdownText, { color: 'black' }]}
                    selectedTextStyle={[styles.droupdownText, { color: 'black' }]}
                    data={data}
                    maxHeight={140}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? '4 hr' : '...'}
                    value={timing}
                    containerStyle={{ backgroundColor: '#F4F4F4', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                    activeColor={'gray'}
                    onChange={item => {
                        setTiming(item.value);
                        setIsFocus(false);
                    }}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                />


            </View>

            <View style={{ alignItems: 'center', marginVertical: 20 }}>

                <Button1Component onPress={() => { checkValidation() }} extraviewstyle={{ width: '60%' }} title={'Add Illustration'} />
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    droupdownText: {
        fontFamily: Constants.fontFamilyRegular,
        color: 'black',
        fontSize: 17
    },
    iosDropUpDownStyle: {
        height: 48,
        width: '100%',
        padding: 15,
        borderRadius: 10,
    },
    androidDropUpDownStyle: {
        height: 48,
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
    },
});


export default AddIlustrationScreens;
