import React, { useEffect } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Color from "../../common/Color";
import { Header } from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import BidItem from "./Components/BidItem";
import global from "./../../common/globals"
import { useDispatch, useSelector } from 'react-redux';
import { getByIdAuction } from "./../../redux/auction";

const PlaceBidScreen = (props) => {
    const dispatch = useDispatch();
    const auctionData = useSelector((state) => state?.auction?.auction);
    const bidData = auctionData != null ? auctionData.bids : [];

    useEffect(() => {
        dispatch(getByIdAuction({ id: props?.route?.params?.item?.id }));
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>
            <Header title={'Description'} onBackPress={() => {
                props.navigation.pop()
            }} />
            <ScrollView >
                <View style={{ flex: 1, paddingHorizontal: 30 }}>
                    <Image source={{ uri: auctionData?.auctionImage == null ? global.COLLECTION_IMAGE_URL2 : auctionData?.auctionImage }} style={{ width: '100%', alignSelf: 'center', borderRadius: 20, height: undefined, aspectRatio: 1.2, marginVertical: 10 }} />

                    <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 22, includeFontPadding: false, color: 'white' }}>{auctionData?.name}</Text>
                            <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 12, includeFontPadding: false, color: '#B9B8BC' }}>$ 123,000 , 10 in Stock</Text>

                        </View>
                        <View>
                            <Text style={{ color: 'white', fontFamily: Constants.fontFamilyBold, fontSize: 11, backgroundColor: Color.secondary, borderRadius: 5, paddingVertical: 3, paddingHorizontal: 10 }}>2h  37 m  left</Text>
                        </View>
                    </View>
                    <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 12, includeFontPadding: false, color: '#B9B8BC' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it </Text>

                    <View style={{ flexDirection: 'row', paddingVertical: 10, marginTop: 20, alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 15, includeFontPadding: false, color: '#B9B8BC' }}>Highest Bid</Text>
                            <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 20, includeFontPadding: false, color: 'white' }}>ETH 144.78</Text>

                        </View>
                        <TouchableOpacity onPress={() => { props.navigation.navigate('AuctionDetailScreen') }} style={{ backgroundColor: Color.secondary, borderRadius: 25, paddingVertical: 10, paddingHorizontal: 20 }} >
                            <Text style={{ color: 'white', fontFamily: Constants.fontFamilySemiBold, fontSize: 17 }}>Place a Bid</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 12, includeFontPadding: false, color: '#EA4335', marginTop: 10 }}>Bid Offers</Text>
                    <FlatList data={bidData} renderItem={({ item }) => {
                        return (
                            <BidItem item={item} />)
                    }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );

}
export default PlaceBidScreen;
