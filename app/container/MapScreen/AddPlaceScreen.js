import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, Platform, DeviceEventEmitter, ScrollView } from 'react-native';
import { toast } from '../../Omni';
import FieldComonent from "../../Components/FieldComonent";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from '../../Context';
import Ionicons from "react-native-vector-icons/Ionicons";
import horizonApiAxios from '../../services/restclient/horizonApiAxios';
import Color from '../../common/Color';

const AddPlaceScreen = (props) => {
    const { theme } = useTheme();
    const [location, setLocation] = useState([]);
    const [loading, setLoading] = useState(false);

    const [placeName, setPlaceName] = useState('');
    const [placeCity, setPlaceCity] = useState('');
    const [placeCountry, setPlaceCountry] = useState('');
    const [placePostCode, setPlacePostCode] = useState(0);
    const [placePhone, setPlacePhone] = useState('');
    const [placeWebsite, setPlaceWebsite] = useState('');
    const [placeDetails, setPlaceDetails] = useState('');

    const [category, setCategory] = useState('Hotel');
    const [locationName, setLocationName] = useState('Select Location address');

    const data = [
        { label: 'Hotel', value: 'Hotel' },
        { label: 'Restaurant', value: 'Restaurant' },
        { label: 'Fast Food Restaurant', value: 'Fast Food Restaurant' },
        { label: 'Retail', value: 'Retail' },
        { label: 'Shopping Center', value: 'Shopping Center' },
        { label: 'Bars', value: 'Bars' },
        { label: 'Coffee Shop', value: 'Coffee Shop' },
        { label: 'Cafe', value: 'Cafe' },
        { label: 'Gym', value: 'Gym' },
        { label: 'Tourist Attraction', value: 'Tourist Attraction' },
        { label: 'Salon/Barbershop', value: 'Salon/Barbershop' },
        { label: 'Airport', value: 'Airport' },
        { label: 'University', value: 'University' },
        { label: 'Park', value: 'Park' }]


    useEffect(() => {
        DeviceEventEmitter.addListener('setplaceLocation', (value) => {
            setLocation(value?.location);
            setLocationName(value?.name);

            // console.log("*********** place", value?.place);

        });
    }, [1])

    const validationCheck = () => {
        let status = false;
        if (location.length !== 0 && handleName(placeName)) {
            status = true;
        }

        if (!handleName(placeName)) {
            toast('Please add your place name')
        } else {
            if (location.length === 0) {
                toast('Please add your place location')
            }
        }

        return status;
    };

    const checkValidation = () => {

        if (validationCheck()) {
            AddPlace();
        }

    }

    const handleName = (text) => {
        const regx = /^([a-zA-Z]).{3,32}$/;

        if (text == null) {
            return false;
        } else {
            return text.match(regx);

        }
    };

    const AddPlace = () => {
        setLoading(true);

        const latitude = `${location?.latitude}`;
        const longitude = `${location?.longitude}`;

        horizonApiAxios.post('/location/addLocation', { name: placeName, category, latitude, longitude, address1: locationName, city: placeCity, country: placeCountry, postcode: placePostCode, mobile_no: placePhone, website: placeWebsite })
            .then((response) => {
                setLoading(false);
                props.navigation.pop();
            })
            .catch((data) => {
                const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
                toast(error?.message);
                setLoading(false);
            });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10 }}>
                <TouchableOpacity onPress={() => { props.navigation.pop() }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: '#9F9696', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontFamily: Constants.fontFamilyBold, fontSize: 22, flex: 1, textAlign: 'center' }}>Add Place</Text>
            </View>
            <ScrollView
                bounces={false}
            >
                <View style={{ padding: 20, paddingTop: 10, flex: 1 }}>

                    <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Name</Text>
                    <FieldComonent value={placeName} title={'Place Name'} onChangeText={(text) => {
                        setPlaceName(text);
                    }} >
                        <Image source={require('./../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>


                    <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Place Category</Text>

                    <Dropdown
                        style={[Platform.OS == 'ios' ? styles.iosDropUpDownStyle : styles.androidDropUpDownStyle, { paddingVertical: 10, backgroundColor: '#F4F4F4', borderRadius: 30 }]}
                        placeholderStyle={[styles.droupdownText, { color: 'black' }]}
                        selectedTextStyle={[styles.droupdownText, { color: 'black' }]}
                        data={data}
                        labelField="label"
                        valueField="value"
                        placeholder={category}
                        value={category}
                        containerStyle={{ backgroundColor: '#F4F4F4' }}
                        activeColor={Color.placeHolderGrey}
                        onChange={item => {
                            setCategory(item.value);
                        }}
                    />

                    <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Address</Text>

                    <TouchableOpacity onPress={() => { props.navigation.navigate('AddLocation', { location, TYPE: 'place' }) }} style={{ paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", backgroundColor: '#F4F4F4', borderRadius: 40 }}>
                        <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"} style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        <Text numberOfLines={2} style={{ marginHorizontal: 15, fontSize: 17, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: locationName == 'Select Location address' ? 'gray' : 'black' }}>{locationName}</Text>

                    </TouchableOpacity>

                    <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>City</Text>
                    <FieldComonent value={placeCity} title={'Place City'} onChangeText={(text) => {
                        setPlaceCity(text);
                    }} >
                        <Image source={require('./../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>

                    <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Country</Text>
                    <FieldComonent value={placeCountry} title={'Place Country'} onChangeText={(text) => {
                        setPlaceCountry(text);
                    }} >
                        <Image source={require('./../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>

                    <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Postcode</Text>
                    <FieldComonent keyboardType="numeric" value={placePostCode} title={'Place Post code'} onChangeText={(text) => {
                        setPlacePostCode(text);
                    }} >
                        <Image source={require('./../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>

                    <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Mobile No</Text>
                    <FieldComonent value={placePhone} title={'Place Mobile no'} onChangeText={(text) => {
                        setPlacePhone(text);
                    }} >
                        <Image source={require('./../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>

                    <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Website</Text>
                    <FieldComonent value={placeWebsite} title={'Place Website'} onChangeText={(text) => {
                        setPlaceWebsite(text);
                    }} >
                        <Image source={require('./../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>

                </View>

            </ScrollView>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>

                <Button1Component visible={loading} onPress={() => { checkValidation() }} extraviewstyle={{ width: '40%' }} title={'Submit'} />
            </View>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    droupdownText: {
        fontFamily: Constants.fontFamilyRegular,
        color: '#FFFFFF',
        fontSize: 17
    },
    iosDropUpDownStyle: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
    },
    androidDropUpDownStyle: {
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
    },
});

export default AddPlaceScreen;
