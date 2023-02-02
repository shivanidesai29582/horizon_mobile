import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from "../common/Constants";
import Button1Component from '../Components/Button1Component';
import { Dropdown } from 'react-native-element-dropdown';
import { putUserUpdate } from "./../redux/userlogin"
import Color from '../common/Color';
import { useDispatch } from 'react-redux';
import { useTheme } from '../Context';

const ProffessionalScreen2 = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [businessType, setBusinessType] = useState('Digital Creator');
    const data = [
        { label: 'News/Media', value: 'News/Media' },
        { label: 'Sport', value: 'Sport' },
        { label: 'Government and Politics', value: 'Government and Politics' },
        { label: 'Music', value: 'Music' },
        { label: 'Fashion', value: 'Fashion' },
        { label: 'Entertainment', value: 'Entertainment' },
        { label: 'Gamer', value: 'Gamer' },
        { label: 'Digital Creator', value: 'Digital Creator' },
        { label: 'Global Business/brand/organization', value: 'Global Business/brand/organization' },
        { label: 'Others', value: 'Others' }]

    const onSave = () => {
        setLoading(true);
        const data = {
            professional_account: true,
            business_category: businessType
        }

        dispatch(putUserUpdate(data)).then(() => {
            setLoading(false);
            props.navigation.replace('BussinessSetupScreen')
        });
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


                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 18, textAlign: 'center', marginTop: 10 }}>What best describes you ?</Text>
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 14, textAlign: 'center', marginTop: 10 }}>Categories help people find accounts like yours.</Text>


                <Text style={{ marginHorizontal: 15, fontSize: 18, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Business Type</Text>
                <Dropdown
                    style={[Platform.OS == 'ios' ? styles.iosDropUpDownStyle : styles.androidDropUpDownStyle, { backgroundColor: '#F4F4F4', borderRadius: 40 }]}
                    placeholderStyle={[styles.droupdownText, { color: Color.placeHolderGrey }]}
                    selectedTextStyle={[styles.droupdownText, { color: 'black' }]}
                    data={data}
                    maxHeight={410}
                    labelField="label"
                    valueField="value"
                    placeholder={businessType}
                    value={businessType}
                    containerStyle={{ backgroundColor: '#F4F4F4', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                    activeColor={Color.placeHolderGrey}
                    onChange={item => {
                        setBusinessType(item.value);
                    }}
                />



            </View>
        </ScrollView>

        <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>


            </View>
            <Button1Component visible={loading} onPress={() => { onSave() }} title={'Done'} extraviewstyle={{ bottom: 30, marginHorizontal: 120, marginVertical: 5, paddingHorizontal: 10, paddingVertical: 12 }}>
            </Button1Component>
        </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    droupdownText: {
        fontFamily: Constants.fontFamilyRegular,
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

export default ProffessionalScreen2;

