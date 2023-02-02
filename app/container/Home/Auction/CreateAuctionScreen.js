import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Color from "../../../common/Color";
import FieldComonent from "../../../Components/FieldComonent";
import LoginHeader from "../../Components/LoginHeader";
import Constants from "../../../common/Constants";
import global from "../../../common/globals";

import Button1Component from "../../../Components/Button1Component";
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addAuction } from "./../../../redux/auction"
import { useTheme } from './../../../Context';


const CreateAuctionScreen = (props) => {
    const { theme } = useTheme();

    const dispatch = useDispatch();

    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const usernftList = user?.nfts;
    const auctionablenftlist = usernftList && usernftList.filter(ele => ele.auction_iscreated === false);

    const [auctionName, setAuctionName] = useState('');
    const [auctionDesc, setAuctionDesc] = useState('');
    const [auctionStartBid, setAuctionStartBid] = useState(0);
    const [auctionExpDate, setAuctionExpDate] = useState(new Date());
    const [auctionExpDateopen, setauctionExpDateOpen] = useState(false);
    const [auctionnftsid, setAuctionnftsid] = useState(null);

    const [errorMsg, setErrorMsg] = useState('');

    const validation = () => {

        if (auctionName === '') {
            setErrorMsg('Please enter auction name');
        } else if (auctionDesc === '') {
            setErrorMsg('Please enter auction description');
        } else if (auctionStartBid === 0) {
            setErrorMsg('Please enter valid start bid');
        } else if (auctionnftsid === null) {
            setErrorMsg('Please select one nfts');
        } else {
            setErrorMsg();

            dispatch(addAuction({
                name: auctionName,
                description: auctionDesc,
                start_bid: auctionStartBid,
                nfts: auctionnftsid,
                auctionDate: moment(auctionExpDate).format("YYYY-MM-DDTHH:mm:ss.000Z")
            })).then(props.navigation.navigate('AuctionDetailScreen'))
        }
    }



    return (<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <LoginHeader onBackPress={() => {
            props.navigation.pop()
        }} />
        <ScrollView style={{ flex: 1 }}>

            <View style={{ padding: 20, flex: 1 }}>

                <Image source={require('../../../Images/signupIcon.png')} style={{
                    height: undefined,
                    width: '30%',
                    aspectRatio: 1,
                    alignSelf: 'center'
                }} />

                <Text style={{
                    fontSize: 25,
                    fontFamily: Constants.fontFamilyBold,
                    color: theme.textColor,
                    marginTop: 15,
                    includeFontPadding: false,
                    padding: 0
                }}>Create Auction</Text>

                <FieldComonent exterViewStyle={{ marginTop: 30 }} value={auctionName} title={'Auction Name'} onChangeText={(text) => {
                    setAuctionName(text);
                }}>
                    <Image source={require('../../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                </FieldComonent>
                <FieldComonent exterViewStyle={{ marginTop: 10 }} value={auctionDesc} title={'Auction Description'} onChangeText={(text) => {
                    setAuctionDesc(text)
                }}>
                    <Image source={require('../../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                </FieldComonent>


                <TouchableOpacity style={{ marginTop: 10, paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: '#9F9696', borderRadius: 15 }} onPress={() => setauctionExpDateOpen(true)} >

                    <Text style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}>{moment(auctionExpDate).format("YYYY-MM-DD")}</Text>
                </TouchableOpacity>


                <FieldComonent exterViewStyle={{ marginTop: 10 }} value={auctionStartBid} title={'Start Bid'} onChangeText={(text) => {
                    setAuctionStartBid(text)
                }}>
                    <Image source={require('../../../Images/email_icon.png')} resizeMode={"contain"}
                        style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                </FieldComonent>

                <Text style={{ color: Color.textColor, fontFamily: Constants.fontFamilyRegular, alignItems: 'center', fontSize: 18, marginTop: 10 }}>Select NFTs</Text>

                <View style={{ flexDirection: 'row' }}>

                    <FlatList
                        horizontal={true}
                        data={auctionablenftlist}
                        renderItem={({ item, index }) => {
                            return (<TouchableOpacity style={{ borderWidth: item.id === auctionnftsid ? 1 : 0, borderColor: "red" }} onPress={() => { setAuctionnftsid(item.id) }}>
                                <Image style={{ height: 80, width: undefined, aspectRatio: 0.9, margin: 3 }} source={{ uri: item?.image_url == null ? global.COLLECTION_IMAGE_URL2 : item?.image_url }} />
                            </TouchableOpacity>)
                        }} />

                </View>
                <Text style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: '#FFFFFF' }}>{errorMsg}</Text>


                <DatePicker
                    modal
                    open={auctionExpDateopen}
                    date={auctionExpDate}
                    onConfirm={(date) => {
                        setauctionExpDateOpen(false)
                        setAuctionExpDate(date)
                    }}
                    onCancel={() => {
                        setauctionExpDateOpen(false)
                    }}
                    mode="date"
                    minimumDate={auctionExpDate}
                />

            </View>
        </ScrollView>

        <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Button1Component onPress={() => { validation() }} extraviewstyle={{ width: '90%' }} title={'Create Auction'} />
        </View>
    </SafeAreaView>
    );
}





export default CreateAuctionScreen;
