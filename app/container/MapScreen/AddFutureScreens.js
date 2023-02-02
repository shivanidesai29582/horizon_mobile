import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, DeviceEventEmitter } from 'react-native';
import LoginHeader from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import { toast } from '../../Omni';
import Button1Component from "../../Components/Button1Component";
import { useDispatch } from 'react-redux';
import { AddFutureVisit } from "./../../redux/futurevisit"
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { useTheme } from './../../Context';

const AddFutureScreens = (props) => {
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const [priority, setPriority] = useState('High');
    const [expectedDate, setExpectedDate] = useState(new Date());
    const [cardExpDateopen, setcardExpDateOpen] = useState(false);
    const [locationName, setLocationName] = useState('Select Location');
    const [location, setLocation] = useState([]);
    const data = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }]

    useEffect(() => {
        DeviceEventEmitter.addListener('setfutureLocation', (value) => {
            setLocationName(value?.name);
            setLocation(value?.location);
        });
    }, [1])

    const checkValidation = () => {
        if (location.length !== 0) {
            AddFuture();
        } else {
            toast('Please add your future visit location')
        }
    }

    const AddFuture = () => {

        const latitude = `${location?.latitude}`;
        const longitude = `${location?.longitude}`;
        dispatch(AddFutureVisit({ latitude, longitude, priority, expected_date: moment(expectedDate).format("YYYY-MM-DDTHH:mm:ss.000Z") })).then(() => props.navigation.pop())

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <LoginHeader onBackPress={() => {
                props.navigation.pop()
            }} />

            <View style={{ padding: 20, flex: 1 }}>

                <Image source={require('../../Images/addFutureVisit.png')} style={{
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
                }}>Add Future Visit</Text>

                <TouchableOpacity onPress={() => { props.navigation.navigate('AddLocation', { location, TYPE: 'future' }) }} style={{ paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: '#9F9696', borderRadius: 15, marginTop: 30 }}>
                    <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"} style={{ width: 20, aspectRatio: 1, height: undefined, tintColor: theme.textColor }} />
                    {/* <TextInput editable={false} selectTextOnFocus={false} value={locationName} style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }} placeholderTextColor={'#B9B8BC'} placeholder={'Select Location'}></TextInput > */}
                    <Text numberOfLines={2} style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }} >{locationName} </Text >

                </TouchableOpacity>

                {/* <Dropdown
                    style={[Platform.OS == 'ios' ? styles.iosDropUpDownStyle : styles.androidDropUpDownStyle, { borderWidth: 1, borderColor: '#9F9696', borderRadius: 15, marginTop: 10 }]}
                    placeholderStyle={[styles.droupdownText, { color: theme.textColor }]}
                    selectedTextStyle={[styles.droupdownText, { color: theme.textColor }]}
                    data={data}
                    maxHeight={155}
                    labelField="label"
                    valueField="value"
                    placeholder={priority}
                    value={priority}
                    containerStyle={{ backgroundColor: theme.backgroundColor }}
                    activeColor={theme.backgroundColor}
                    onChange={item => {
                        setPriority(item.value);
                    }}
                /> */}


                <TouchableOpacity style={{ marginTop: 10, paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: '#9F9696', borderRadius: 15 }} onPress={() => setcardExpDateOpen(true)} >
                    <Text style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}>{moment(expectedDate).format("YYYY-MM-DD")}</Text>
                </TouchableOpacity>


            </View>

            <View style={{ alignItems: 'center', marginVertical: 20 }}>

                <Button1Component onPress={() => { checkValidation() }} extraviewstyle={{ width: '60%' }} title={'Add Future Visit'} />
            </View>

            <DatePicker
                modal
                open={cardExpDateopen}
                date={expectedDate}
                onConfirm={(date) => {
                    setcardExpDateOpen(false)
                    setExpectedDate(date)
                }}
                onCancel={() => {
                    setcardExpDateOpen(false)
                }}
                mode="date"
                minimumDate={expectedDate}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    droupdownText: {
        fontFamily: Constants.fontFamilyRegular,
        color: '#FFFFFF',
        fontSize: 13
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

export default AddFutureScreens;
