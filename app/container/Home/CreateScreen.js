import React, { useState, useCallback, useEffect } from 'react';
import {
    Animated,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Color from "../../common/Color";
import FieldComonent from "../../Components/FieldComonent";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import { launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useTheme } from './../../Context';
import { toast } from '../../Omni';
import { useDispatch, useSelector } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Ionicons from "react-native-vector-icons/Ionicons";
import global from './../../common/globals'
import { addAuction } from "./../../redux/auction"
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { get } from '../../storage';
import horizonApiAxios from '../../services/restclient/horizonApiAxios';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const options = {
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    cameraType: 'back',
    includeBase64: false,
    saveToPhotos: false

}

const CreateScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();

    const connector = useWalletConnect();

    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const usernftList = user?.nfts;
    const auctionablenftlist = usernftList && usernftList.filter(ele => ele.auction_iscreated === false);

    let EditData = props?.route?.params?.item;
    useEffect(() => {
        EditData = props?.route?.params?.item;
    }, [props?.route?.params?.requestFrom, props?.route?.params?.item?.id]);
    const [NFTImage, setNFTImage] = useState(EditData ? EditData?.image_url : '');
    const [collectionCoverImage, setCollectionCoverImage] = useState('');
    const [collectionLogoImage, setCollectionLogoImage] = useState('');

    const [collection_cover_image, setCollection_cover_image] = useState('');
    const [collection_logo_image, setCollection_logo_image] = useState('');

    const [loading, setLoading] = useState(false);


    const connectWallet = useCallback(() => {
        return connector.connect();
    }, [connector]);

    const killSession = useCallback(() => {
        return connector.killSession();
    }, [connector]);

    const shortenAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(
            address.length - 4,
            address.length
        )}`;
    };

    // useEffect(() => {
    //     horizonApiAxios.get('/collection/findById')
    //         .then((response) => {
    //             console.log("******** response", response);
    //         })
    //         .catch((data) => {
    //             const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
    //             console.log("******** Error", error?.message);
    //         });
    // }, []);



    const NFTComponent = () => {

        const [isMarketPlace, setIsMarketPlace] = useState(true);

        const [cryptoType, setCryptoType] = useState('ETH');
        const [cryptoCost, setCryptoCost] = useState(EditData ? EditData?.cryptoCost : '');
        const [name, setName] = useState(EditData ? EditData?.name : '');
        const [description, setDescription] = useState(EditData ? EditData?.description : '');
        const [royalties, setRoyalties] = useState('10');

        const data = [
            { label: 'Ethereum', value: 'ETH' },
            { label: 'Binance', value: 'BNB' },
            { label: 'Avalance', value: 'AVAX' },
            { label: 'Polygon', value: 'MATIC' }]

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
                            setNFTImage(value.uri)
                        } else {
                            toast('Something went wrong, please try again')
                        }
                    } else {
                        toast('Something went wrong, please try again')
                    }

                }
            })
        }

        const [isSelected, setIsSelected] = useState(1);

        const toggleMarketPlace = () => {
            // isMarketPlace ? OnRemoveMute() : OnAddMute();
            setIsMarketPlace(previousState => !previousState);
        }

        const validation = async () => {
            let cryptoCostFloat = parseFloat(cryptoCost);

            if (NFTImage === '' || cryptoCost === '' || isNaN(cryptoCostFloat)) {
                toast('Please enter crypto Cost ');
            } else {
                setLoading(true);

                if (EditData) {

                    const data = {
                        name,
                        description,
                        image_url: NFTImage,
                        cryptoCost: `${cryptoCost}`,
                        cryptoType: `${cryptoType}`,
                        service_fee: 1,
                        royalties: parseInt(royalties)
                    }

                    horizonApiAxios.post(`/nfts/update_nft/${EditData?.id}`, data)
                        .then((response) => {
                            setLoading(false);
                            props.navigation.pop();
                        })
                        .catch((data) => {
                            const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
                            toast(error?.message);
                            setLoading(false);
                        });

                } else {

                    let storageToken = await get('horizon_token');

                    let formData = new FormData();

                    formData.append("file", {
                        uri: NFTImage,
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
                        const data = {
                            name,
                            description,
                            image_url: response?.data?.image,
                            cryptoCost: `${cryptoCost}`,
                            cryptoType: `${cryptoType}`,
                            service_fee: 1,
                            royalties: parseInt(royalties)
                        }

                        horizonApiAxios.post('/nfts/create_nft', data)
                            .then((response) => {
                                setLoading(false);
                                props.navigation.pop();
                            })
                            .catch((data) => {
                                const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
                                toast(error?.message);
                                setLoading(false);
                            });

                    }).catch((error) => {
                        setLoading(false);
                    })
                }
            }
        }


        return (<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

            <ScrollView style={{ flex: 1 }}>

                <View style={{ flex: 1 }}>
                    <View style={{ marginTop: 10, height: 150, borderWidth: 1, borderColor: '#9F9696', borderRadius: 15, justifyContent: 'center' }}>

                        {NFTImage ? <Image source={{ uri: NFTImage }} style={{ height: 150, borderRadius: 15, overflow: 'hidden' }} /> :

                            <TouchableOpacity style={{ margin: 5, justifyContent: 'center', flex: 1 }} onPress={() => pickImageFromGallery()} >
                                <Text style={{ alignSelf: 'center', marginHorizontal: 15, fontSize: 13, paddingVertical: 10, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}>Choose image from Library</Text>
                            </TouchableOpacity>
                        }

                    </View>
                    <View style={{ marginTop: 20, marginHorizontal: 10, }}>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 18, textAlign: 'left' }}>Put on marketplace</Text>
                            <MaterialIcons name={'navigate-next'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                            <Switch
                                style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                                trackColor={{ false: theme.activeIcon, true: theme.activeIcon }}
                                thumbColor={Color.secondary}
                                onValueChange={toggleMarketPlace}
                                value={isMarketPlace}>
                            </Switch>
                        </View> */}

                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 14, textAlign: 'left', marginRight: 50 }}>Enter price to allow users instantly purchase your NFT</Text>

                        <View style={{ flexDirection: 'row', marginTop: 10, height: 150, }}>

                            <View style={{ margin: 5, borderWidth: 1, borderColor: isSelected === 1 ? theme.activeIcon : '#9F9696', borderRadius: 15, flex: 1, justifyContent: 'center' }} onPress={() => { }} >
                                <TouchableOpacity disabled style={{ flexDirection: "column", justifyContent: 'center' }} onPress={() => { setIsSelected(1) }}>
                                    <Ionicons style={{ alignSelf: 'center' }} color={theme.activeIcon} name={'location-outline'} size={25} />
                                    <Text style={{ margin: 10, alignSelf: 'center', fontSize: 14, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Fixed price</Text>
                                </TouchableOpacity>
                            </View>

                            {/* <View style={{ margin: 5, borderWidth: 1, borderColor: isSelected === 2 ? theme.activeIcon : '#9F9696', borderRadius: 15, flex: 1, justifyContent: 'center' }} onPress={() => { }} >
                        <TouchableOpacity style={{ flexDirection: "column", justifyContent: 'center' }} onPress={() => { setIsSelected(2) }}>
                            <Ionicons style={{ alignSelf: 'center' }} color={theme.activeIcon} name={'location-outline'} size={25} />
                            <Text style={{ margin: 10, alignSelf: 'center', fontSize: 14, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Open for bids</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ margin: 5, borderWidth: 1, borderColor: isSelected === 3 ? theme.activeIcon : '#9F9696', borderRadius: 15, flex: 1, justifyContent: 'center' }} onPress={() => { }} >
                        <TouchableOpacity style={{ flexDirection: "column", justifyContent: 'center' }} onPress={() => { setIsSelected(3) }}>
                            <Ionicons style={{ alignSelf: 'center' }} color={theme.activeIcon} name={'location-outline'} size={25} />
                            <Text style={{ margin: 10, alignSelf: 'center', fontSize: 14, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Timed auction</Text>
                        </TouchableOpacity>
                    </View> */}

                        </View>

                        <Text style={{ marginTop: 10, color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'left', marginRight: 50 }}>Price</Text>

                        <FieldComonent keyboardType="numeric" exterViewStyle={{ marginTop: 10 }} value={cryptoCost} title={'Enter price for one piece'} onChangeText={(text) => {
                            setCryptoCost(text);
                        }}>
                            <Dropdown
                                style={[Platform.OS == 'ios' ? styles.iosDropUpDownStyle : styles.androidDropUpDownStyle, { width: 75, }]}
                                placeholderStyle={[styles.droupdownText, { color: theme.textColor }]}
                                selectedTextStyle={[styles.droupdownText, { color: 'black' }]}
                                data={data}
                                maxHeight={220}
                                labelField="value"
                                valueField="value"
                                placeholder={cryptoType}
                                value={cryptoType}
                                containerStyle={{ backgroundColor: '#F4F4F4', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                                activeColor={'gray'}
                                onChange={item => {
                                    setCryptoType(item.value);
                                }}
                            />
                        </FieldComonent>

                        <View style={{ marginTop: 10, paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", justifyContent: 'space-between', borderRadius: 30, backgroundColor: '#F4F4F4' }}>
                            <Text style={{ fontSize: 13, paddingVertical: 15, fontFamily: Constants.fontFamilyRegular, color: 'black' }}>Service fee</Text>
                            <Text style={{ fontSize: 13, paddingVertical: 15, fontFamily: Constants.fontFamilyRegular, color: 'black' }}>1%</Text>
                        </View>

                        <Text style={{ marginTop: 10, color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'left', marginRight: 50 }}>Choose collection</Text>

                        <View style={{ flexDirection: 'row', marginTop: 10, height: 150, }}>

                            <View style={{ margin: 5, borderWidth: 1, borderColor: isSelected === 1 ? theme.activeIcon : '#9F9696', borderRadius: 15, flex: 1, justifyContent: 'center' }} onPress={() => { }} >
                                <TouchableOpacity disabled style={{ flexDirection: "column", justifyContent: 'center' }} onPress={() => { setIsSelected(1) }}>
                                    <Ionicons style={{ alignSelf: 'center' }} color={theme.activeIcon} name={'location-outline'} size={25} />
                                    <Text style={{ margin: 10, alignSelf: 'center', fontSize: 14, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor }}>Fixed price</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={{ marginTop: 10, color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'left', marginRight: 50 }}>Name</Text>
                        <FieldComonent exterViewStyle={{ marginTop: 10 }} value={name} title={'e. g. Horizon T-Shirt with logo'} onChangeText={(text) => {
                            setName(text);
                        }} >
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent>

                        <Text style={{ marginTop: 10, color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'left', marginRight: 50 }}>Description</Text>
                        <FieldComonent exterViewStyle={{ marginTop: 10 }} value={description} title={'e. g. After purchasing you will be able to get real T-shirt'} onChangeText={(text) => {
                            setDescription(text);
                        }} >
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent>


                        <Text style={{ marginTop: 10, color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'left', marginRight: 50 }}>Royalties(%)</Text>

                        <FieldComonent keyboardType="numeric" exterViewStyle={{ marginTop: 10 }} value={royalties} onChangeText={(text) => {
                            setRoyalties(text);
                        }} >
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent>

                    </View>
                </View>
            </ScrollView>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Button1Component visible={loading} onPress={() => validation()} title={EditData ? 'Edit' : 'Create'} extraviewstyle={{ width: '60%' }} />
            </View>
        </View>)
    }

    const AuctionComponent = () => {
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
        return (<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <ScrollView style={{ flex: 1 }}>

                <View style={{ padding: 20, flex: 1 }}>

                    <Image source={require('../../Images/signupIcon.png')} style={{
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
                        <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>
                    <FieldComonent exterViewStyle={{ marginTop: 10 }} value={auctionDesc} title={'Auction Description'} onChangeText={(text) => {
                        setAuctionDesc(text)
                    }}>
                        <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                            style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                    </FieldComonent>


                    <TouchableOpacity style={{ marginTop: 10, paddingVertical: 5, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", backgroundColor: '#f4f4f4', borderRadius: 30 }} onPress={() => setauctionExpDateOpen(true)}>
                        <Text style={{ marginHorizontal: 15, fontSize: 16, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: 'black' }}>{moment(auctionExpDate).format("YYYY-MM-DD")}</Text>
                    </TouchableOpacity>


                    <FieldComonent exterViewStyle={{ marginTop: 10 }} value={auctionStartBid} title={'Start Bid'} onChangeText={(text) => {
                        setAuctionStartBid(text)
                    }}>
                        <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
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
                <Button1Component onPress={() => { validation() }} extraviewstyle={{ width: '60%' }} title={'Create Auction'} />
            </View>
        </View>
        )
    }

    const CollectionsComponent = () => {

        const [name, setName] = useState(EditData ? EditData?.collection_name : '');
        const [description, setDescription] = useState(EditData ? EditData?.description : '');
        const [symbol, setSymbol] = useState(EditData ? EditData?.collection_symbol : '');

        const [CollectionType, setCollectionType] = useState(EditData ? EditData?.category : 'Art');

        if (EditData) {
            setCollectionCoverImage(EditData?.collection_cover_image);
            setCollectionLogoImage(EditData?.collection_logo_image);
        }
        const data = [
            { label: 'Art', value: 'Art' },
            { label: 'Virtual Worlds', value: 'Virtual Worlds' },
            { label: 'Collectibles', value: 'Collectibles' },
            { label: 'Domains', value: 'Domains' },
            { label: 'Music', value: 'Music' },
            { label: 'Games', value: 'Games' },
            { label: 'Memes', value: 'Memes' },
            { label: 'Trending Cards', value: 'Trending Cards' },
            { label: 'NFT Gifts', value: 'NFT Gifts' }]

        const pickCoverImageFromGallery = () => {
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
                            setCollectionCoverImage(value.uri)
                        } else {
                            toast('Something went wrong, please try again')
                        }
                    } else {
                        toast('Something went wrong, please try again')
                    }

                }
            })
        }

        const pickLogoImageFromGallery = () => {
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
                            setCollectionLogoImage(value.uri)
                        } else {
                            toast('Something went wrong, please try again')
                        }
                    } else {
                        toast('Something went wrong, please try again')
                    }

                }
            })
        }

        const validation = async () => {


            if (name === '' || symbol === '' || collectionCoverImage === '' || collectionLogoImage === '') {

            } else {
                setLoading(true);

                if (EditData) {

                    const data = {
                        collection_name: name,
                        description,
                        // collection_cover_image: coverresponse?.data?.image,
                        // collection_logo_image: logoresponse?.data?.image,
                        collection_symbol: symbol,
                        category: CollectionType
                    }

                    horizonApiAxios.put(`/collection/${EditData?.id}`, data)
                        .then((response) => {
                            setLoading(false);
                            props.navigation.pop();
                        })
                        .catch((data) => {
                            const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
                            toast(error?.message);
                            setLoading(false);
                        });

                } else {
                    let storageToken = await get('horizon_token');

                    let formData = new FormData();

                    formData.append("file", {
                        uri: collectionCoverImage,
                        type: 'image/jpeg',
                        name: `dummy${Date.now()}.jpg`
                    });

                    axios.post(`${global.HORIZON_BASE_URL}/attachments`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${storageToken}`
                        },
                    }).then((coverresponse) => {


                        let formData = new FormData();

                        formData.append("file", {
                            uri: collectionLogoImage,
                            type: 'image/jpeg',
                            name: `dummy${Date.now()}.jpg`
                        });

                        axios.post(`${global.HORIZON_BASE_URL}/attachments`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${storageToken}`
                            },
                        }).then((logoresponse) => {

                            const data = {
                                collection_name: name,
                                description,
                                collection_cover_image: coverresponse?.data?.image,
                                collection_logo_image: logoresponse?.data?.image,
                                collection_symbol: symbol,
                                category: CollectionType
                            }

                            horizonApiAxios.post('/collection', data)
                                .then((response) => {
                                    setLoading(false);
                                    props.navigation.pop();
                                })
                                .catch((data) => {
                                    const error = data.hasOwnProperty('response') && data.response != undefined ? data.response.data : data;
                                    toast(error?.message);
                                    setLoading(false);
                                });


                        }).catch((error) => {
                            setLoading(false);
                        })



                    }).catch((error) => {
                        setLoading(false);
                    })
                }

            }
        }


        return (<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

            <ScrollView style={{ flex: 1 }}>

                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>

                        <View style={{ flex: 1, marginTop: 10, marginHorizontal: 5 }}>

                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'center' }}>Cover Image</Text>

                            <View style={{ marginTop: 10, height: 150, borderWidth: 1, borderColor: '#9F9696', borderRadius: 15, justifyContent: 'center' }}>

                                {collectionCoverImage ? <Image source={{ uri: collectionCoverImage }} style={{ height: 150, borderRadius: 15, overflow: 'hidden' }} /> :
                                    <TouchableOpacity style={{ margin: 5, justifyContent: 'center', flex: 1 }} onPress={() => (EditData) ? () => { } : pickCoverImageFromGallery()} >
                                        <Text style={{ alignSelf: 'center', marginHorizontal: 15, fontSize: 13, paddingVertical: 10, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}>Choose images from Library</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                        </View>
                        <View style={{ flex: 1, marginTop: 10, marginHorizontal: 5 }}>

                            <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'center' }}>Logo Image</Text>

                            <View style={{ marginTop: 10, height: 150, borderWidth: 1, borderColor: '#9F9696', borderRadius: 15, justifyContent: 'center' }}>

                                {collectionLogoImage ? <Image source={{ uri: collectionLogoImage }} style={{ height: 150, borderRadius: 15, overflow: 'hidden' }} /> :
                                    <TouchableOpacity style={{ margin: 5, justifyContent: 'center', flex: 1 }} onPress={() => (EditData) ? () => { } : pickLogoImageFromGallery()} >
                                        <Text style={{ alignSelf: 'center', marginHorizontal: 15, fontSize: 13, paddingVertical: 10, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}>Choose images from Library</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, marginHorizontal: 10, }}>

                        <Text style={{ marginTop: 10, color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'left', marginRight: 50 }}>Display name</Text>
                        <FieldComonent exterViewStyle={{ marginTop: 10 }} value={name} title={'Enter collection name'} onChangeText={(text) => {
                            setName(text);
                        }} >
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent>

                        <Text style={{ marginTop: 10, color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'left', marginRight: 50 }}>Description</Text>
                        <FieldComonent exterViewStyle={{ marginTop: 10 }} value={description} title={'Speard some words about your token collection'} onChangeText={(text) => {
                            setDescription(text);
                        }} >
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent>

                        <Text style={{ marginTop: 10, color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'left', marginRight: 50 }}>Symbol</Text>
                        <FieldComonent exterViewStyle={{ marginTop: 10 }} value={symbol} title={'Enter token symbol'} onChangeText={(text) => {
                            setSymbol(text);
                        }} >
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent>


                        <Text style={{ marginTop: 10, color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 14, textAlign: 'left', marginRight: 50 }}>Collection Type</Text>

                        <Dropdown
                            style={[Platform.OS == 'ios' ? styles.iosDropUpDownStyle : styles.androidDropUpDownStyle, { backgroundColor: '#F4F4F4', borderRadius: 30, marginTop: 10 }]}
                            placeholderStyle={[styles.droupdownText, { color: 'black' }]}
                            selectedTextStyle={[styles.droupdownText, { color: 'black' }]}
                            data={data}
                            maxHeight={220}
                            labelField="value"
                            valueField="value"
                            placeholder={CollectionType}
                            value={CollectionType}
                            containerStyle={{ backgroundColor: '#F4F4F4', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                            activeColor={'gray'}
                            onChange={item => {
                                setCollectionType(item.value);
                            }}
                        />

                    </View>
                </View>
            </ScrollView>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Button1Component visible={loading} onPress={() => validation()} title={'Create collection'} extraviewstyle={{ width: '60%' }} />
            </View>
        </View>)
    }

    const renderScene = SceneMap({
        nfts: NFTComponent,
        collections: CollectionsComponent,
        auction: AuctionComponent
    });
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const startIndex = (props?.route?.params?.requestFrom && props?.route?.params?.requestFrom == 'collectionEdit') ? 2 : 0;
        setIndex(startIndex);
    }, [props?.route?.params?.requestFrom]);
    const [routes] = useState([
        { key: 'nfts', title: 'NFT' },
        { key: 'collections', title: 'Collections' },
        { key: 'auction', title: 'Auction' },
    ]);

    const renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {props.navigationState.routes.map((route, i) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex) => (
                            inputIndex === i ? 1 : 0.6
                        )),
                    });

                    return (
                        <TouchableOpacity
                            style={{ alignItems: 'center', width: 85, marginBottom: 20 }}
                            activeOpacity={0.8}
                            onPress={() => setIndex(i)}
                        >
                            <View style={{ paddingBottom: 4, borderBottomWidth: 3, borderBottomColor: props.navigationState.index == i ? Color.secondary : 'transparent' }}>
                                <Animated.Text style={{ opacity, fontSize: 16, fontFamily: Constants.fontFamilyBold, color: theme.textColor, borderBottomColor: 'transparent', borderBottomWidth: 0 }}>{route.title}</Animated.Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

            <TabView
                tabBarPosition='top'
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
            />


            {/* <Button1Component onPress={() => {
                    props.navigation.navigate('CreateNFTScreen')
                }} title={'Create NFT'} extraviewstyle={{ margin: 20 }} />


                <Button1Component onPress={() => {
                    props.navigation.navigate('CreateCollectionScreen')
                }} title={'Create Collection'} extraviewstyle={{ margin: 20 }} />


                <Button1Component onPress={() => {
                    !connector.connected ? connectWallet() : killSession()
                }} title={!connector.connected ? "Connect a wallet" : shortenAddress(connector.accounts[0])} extraviewstyle={{ margin: 20 }} />


                <Button1Component onPress={() => {
                    props.navigation.navigate('CreateAuctionScreen')
                }} title={'Create Auction'} extraviewstyle={{ margin: 20 }} /> */}


        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    droupdownText: {
        fontFamily: Constants.fontFamilyRegular,
        fontSize: 17,
        color: "black",
        textAlign: "center"
    },
    iosDropUpDownStyle: {
        height: 48,
        width: '100%',
        padding: 8,
        borderRadius: 20,
    },
    androidDropUpDownStyle: {
        height: 48,
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20
    },
});

export default CreateScreen;
