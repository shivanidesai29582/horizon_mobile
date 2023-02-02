import React, { useState, useEffect, useCallback } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, FlatList, Modal, StyleSheet } from 'react-native';
import Color from "../../common/Color";
import FieldComonent from "../../Components/FieldComonent";
import LoginHeader from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import { useDispatch, useSelector } from 'react-redux';
import { getByIdAuction } from "./../../redux/auction";
import global from "./../../common/globals"
import moment from 'moment';
import BidItem from "./Components/BidItem";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dropdown } from 'react-native-element-dropdown';
import { useIsFocused } from '@react-navigation/native';
import horizonApiAxios from '../../services/restclient/horizonApiAxios';
import { useTheme } from './../../Context';

const AuctionDetailScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const auctionData = useSelector((state) => state?.auction?.auction);
    const bidData = auctionData != null ? auctionData?.bids : [];

    const [cryptoCost, setCryptoCost] = useState('');
    const [cryptoType, setCryptoType] = useState('ETH');
    const [errorMsg, setErrorMsg] = useState('');


    const data = [
        { label: 'Ethereum', value: 'ETH' },
        { label: 'Binance', value: 'BNB' },
        { label: 'Avalance', value: 'AVAX' },
        { label: 'Polygon', value: 'MATIC' }]

    const [modalVisible, setModalVisible] = useState(false);



    useEffect(() => {
        Reload();
    }, [isFocused]);


    const Reload = () => {
        props?.route?.params?.item?.id ? dispatch(getByIdAuction({ id: props?.route?.params?.item?.id })) : null;
    }

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Reload();
        wait(2000).then(() =>
            setRefreshing(false));
        setLoading(false);
    }, []);



    const validation = async () => {
        let cryptoCostFloat = parseFloat(cryptoCost);

        if (cryptoCost === '' || isNaN(cryptoCostFloat)) {
            setErrorMsg('Please enter crypto Cost ');
        } else {
            setLoading(true);

            horizonApiAxios.post('/bids', { cryptoCost: cryptoCostFloat, cryptoType, auction_id: auctionData?.id })
                .then((response) => {
                    setErrorMsg('')
                    setModalVisible(false)
                    onRefresh();

                })
                .catch((data) => {
                    const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
                    setErrorMsg(error?.message);
                    setLoading(false);
                });

        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <LoginHeader onBackPress={() => {
                setErrorMsg('')
                props.navigation.pop()
            }} />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                    setErrorMsg()
                }}
            >
                <View style={{ backgroundColor: theme.backgroundColor, flex: 1, justifyContent: 'center', marginHorizontal: 10 }}>
                    <TouchableOpacity style={{ position: 'absolute', left: 20, top: 50 }} onPress={() => {
                        setModalVisible(false);
                    }} >
                        <Ionicons name={'close'} color={theme.borderColor} size={25} />

                    </TouchableOpacity>

                    <FieldComonent exterViewStyle={{ marginTop: 30 }} value={cryptoCost} title={'Crypto Cost'} onChangeText={(text) => {
                        setCryptoCost(text);
                    }}>
                        <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>


                    <Dropdown
                        style={[Platform.OS == 'ios' ? styles.iosDropUpDownStyle : styles.androidDropUpDownStyle, { borderWidth: 1, borderColor: '#9F9696', borderRadius: 15, marginTop: 10 }]}
                        placeholderStyle={[styles.droupdownText, { color: theme.textColor }]}
                        selectedTextStyle={[styles.droupdownText, { color: theme.textColor }]}
                        data={data}
                        maxHeight={220}
                        labelField="label"
                        valueField="value"
                        placeholder={cryptoType}
                        value={cryptoType}
                        containerStyle={{ backgroundColor: theme.backgroundColor }}
                        activeColor={theme.backgroundColor}
                        onChange={item => {
                            setCryptoType(item.value);
                        }}
                    />
                    <Text style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}>{errorMsg}</Text>


                    <Button1Component visible={loading} onPress={() => validation()} title={'Create Bid'} extraviewstyle={{ margin: 20 }} />

                </View>
            </Modal>


            <ScrollView>
                {(!auctionData || auctionData.length === 0) ?
                    <NoDataScreen isVisible={(!auctionData || auctionData.length === 0)} message="Looks like you dont't search anything yet." />
                    :
                    <>
                        <View style={{ flex: 1, paddingHorizontal: 30 }}>
                            <Image source={{ uri: auctionData?.auctionImage == null ? global.COLLECTION_IMAGE_URL2 : auctionData?.auctionImage }} style={{ width: '100%', alignSelf: 'center', borderRadius: 20, height: undefined, aspectRatio: 1.2, marginVertical: 10 }} />

                            <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 22, includeFontPadding: false, color: theme.textColor }}>{auctionData?.name}</Text>
                                    <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 12, includeFontPadding: false, color: '#B9B8BC' }}>Starting Bid {auctionData?.start_bid}</Text>

                                </View>
                                <View>
                                    <Text style={{ color: 'white', fontFamily: Constants.fontFamilyBold, fontSize: 11, backgroundColor: Color.secondary, borderRadius: 5, paddingVertical: 3, paddingHorizontal: 10 }}>{dateDiffFormat(auctionData?.auctionDate)}</Text>
                                </View>
                            </View>
                            <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 12, includeFontPadding: false, color: '#B9B8BC' }}>{auctionData?.description}</Text>

                            <View style={{ flexDirection: 'row', paddingVertical: 10, marginTop: 20, alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 15, includeFontPadding: false, color: '#B9B8BC' }}>Highest Bid</Text>
                                    <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 20, includeFontPadding: false, color: theme.textColor }}>{auctionData?.highest_bid === null ? auctionData?.start_bid : auctionData?.highest_bid}</Text>

                                </View>
                                {/* <TouchableOpacity onPress={() => { setModalVisible(true); }} style={{ backgroundColor: Color.secondary, borderRadius: 25, paddingVertical: 10, paddingHorizontal: 20 }} >
                                    <Text style={{ color: 'white', fontFamily: Constants.fontFamilySemiBold, fontSize: 17 }}>Place a Bid</Text>
                                </TouchableOpacity> */}
                            </View>

                            {bidData?.length > 0 ? <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 12, includeFontPadding: false, color: '#EA4335', marginTop: 10 }}>Bid Offers</Text> : null}
                            <FlatList data={bidData} renderItem={({ item }) => {
                                return (
                                    <BidItem item={item} />)
                            }} />
                        </View>
                    </>
                }
            </ScrollView>
        </SafeAreaView>
    );
}



export const dateDiffFormat = (creation_timestamp) => {
    let createdDate;
    if (moment(creation_timestamp).isValid()) {
        createdDate =
            moment().diff(creation_timestamp, 'hours') < 24
                ? `${moment(creation_timestamp).fromNow(true)} left`
                : moment(creation_timestamp).format('MMM DD, YYYY');
    }
    return createdDate;
};

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
export default AuctionDetailScreen;
