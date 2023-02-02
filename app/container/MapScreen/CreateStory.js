import React, { useState, useCallback, useRef } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    ImageBackground
} from 'react-native';
import Color from "../../common/Color";
import FieldComonent from "../../Components/FieldComonent";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import ButtonComponent from "../../Components/ButtonComponent";
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useTheme } from './../../Context';
import { useDispatch, useSelector } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
// import { RNCamera } from "react-native-camera";
import Ionicons from "react-native-vector-icons/Ionicons";
import global from './../../common/globals'
import { addAuction } from "./../../redux/auction"

const CreateStory = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const connector = useWalletConnect();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const usernftList = user?.nfts;
    const auctionablenftlist = usernftList && usernftList.filter(ele => ele.auction_iscreated === false);

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

    const FutureVisitComponent = () => {


        return (<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

        </View>)
    }

    const IllustrationComponent = () => {
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


                    <TouchableOpacity style={{ marginTop: 10, paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: '#9F9696', borderRadius: 15 }} onPress={() => setauctionExpDateOpen(true)} >

                        <Text style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }}>{moment(auctionExpDate).format("YYYY-MM-DD")}</Text>
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
                <Button1Component onPress={() => { validation() }} extraviewstyle={{ width: '90%' }} title={'Create Auction'} />
            </View>
        </View>
        )
    }

    const StoryComponent = () => {

        const [isFront, setIsFront] = useState(false);
        const [imageurl, setimageurl] = useState(null);

        const cameraRef = useRef(null);

        const takePicture = async () => {

            if (cameraRef) {
                const options = { quality: 0.5, base64: true };
                const data = await cameraRef.current.takePictureAsync(options);
                setimageurl(data.uri);
            }
        }

        const UploadtakePicture = async () => {
            if (imageurl !== null) {
                props.navigation.navigate('AddStoryScreens', { imageurl: imageurl })
            }
        }

        return (<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            {imageurl !== null ?
                <ImageBackground source={{ uri: imageurl === null ? global.COLLECTION_IMAGE_URL2 : imageurl }} style={{ flex: 1 }}>
                    <View style={{ flex: 1, padding: 20 }}>

                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons onPress={() => { props.navigation.pop() }} name={'close'} color={'#fff'} size={25} style={{ position: 'absolute', left: 10 }} />


                            {/* <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Image source={require('../../Images/musicIcon.png')}
                                    style={{ width: 15, height: undefined, aspectRatio: 1 }} />

                                <Text style={{
                                    fontFamily: Constants.fontFamilyMedium,
                                    fontSize: 12,
                                    includeFontPadding: false,
                                    color: 'white',
                                    marginHorizontal: 5
                                }}>Sounds</Text>


                            </View> */}

                        </View>


                        {/* <View style={{ position: 'absolute', right: 20, top: 100 }}>

                            <TouchableOpacity onPress={() => setIsFront(() => !isFront)}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={require('../../Images/revertIcon.png')}
                                        style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                                    <Text style={{
                                        fontFamily: Constants.fontFamilySemiBold,
                                        fontSize: 10,
                                        includeFontPadding: false,
                                        color: 'white',
                                        marginHorizontal: 5
                                    }}>Flip</Text>

                                </View>
                            </TouchableOpacity>

                            <View style={{ alignItems: 'center', marginTop: 15 }}>
                                <Image source={require('../../Images/timmerIcon.png')}
                                    style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                                <Text style={{
                                    fontFamily: Constants.fontFamilySemiBold,
                                    fontSize: 10,
                                    includeFontPadding: false,
                                    color: 'white',
                                    marginHorizontal: 5
                                }}>Speed</Text>

                            </View>
                            <View style={{ alignItems: 'center', marginTop: 15 }}>
                                <Image source={require('../../Images/megicIcon.png')}
                                    style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                                <Text style={{
                                    fontFamily: Constants.fontFamilySemiBold,
                                    fontSize: 10,
                                    includeFontPadding: false,
                                    color: 'white',
                                    marginHorizontal: 5
                                }}>Beauty</Text>

                            </View>
                            <View style={{ alignItems: 'center', marginTop: 15 }}>
                                <Image source={require('../../Images/efffectIcon.png')}
                                    style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                                <Text style={{
                                    fontFamily: Constants.fontFamilySemiBold,
                                    fontSize: 10,
                                    includeFontPadding: false,
                                    color: 'white',
                                    marginHorizontal: 5
                                }}>Filters</Text>

                            </View>
                            <View style={{ alignItems: 'center', marginTop: 15 }}>
                                <Image source={require('../../Images/timmer.png')}
                                    style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                                <Text style={{
                                    fontFamily: Constants.fontFamilySemiBold,
                                    fontSize: 10,
                                    includeFontPadding: false,
                                    color: 'white',
                                    marginHorizontal: 5
                                }}>Timer</Text>

                            </View>
                            <View style={{ alignItems: 'center', marginTop: 15 }}>
                                <Image source={require('../../Images/flashIcon.png')}
                                    style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                                <Text style={{
                                    fontFamily: Constants.fontFamilySemiBold,
                                    fontSize: 10,
                                    includeFontPadding: false,
                                    color: 'white',
                                    marginHorizontal: 5
                                }}>Flash</Text>

                            </View>

                        </View> */}


                        <View style={{ flex: 1 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Image source={require('../../Images/emojisIcon.png')}
                                    style={{ width: 40, height: undefined, aspectRatio: 1 }} />

                                <Text style={{
                                    fontFamily: Constants.fontFamilyMedium,
                                    fontSize: 12,
                                    includeFontPadding: false,
                                    color: 'white',
                                    marginHorizontal: 5
                                }}>Effects</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}></View>
                            {/* <TouchableOpacity onPress={() => {
                                takePicture();
                            }} style={{ flex: 1, alignItems: 'center' }}>
                                <Image source={require('../../Images/captureIcon.png')}
                                    style={{ width: 70, height: undefined, aspectRatio: 1 }} />

                            </TouchableOpacity> */}

                            <TouchableOpacity onPress={() => { }} style={{ alignItems: 'center', flex: 1 }}>

                                <ButtonComponent onPress={() => { UploadtakePicture() }} extraviewstyle={{ alignSelf: 'center', backgroundColor: Color.secondary, borderRadius: 10, marginTop: 10 }} extratextstyle={{ paddingVertical: 2 }} title={'Next'} />


                            </TouchableOpacity>
                        </View>




                    </View>
                </ImageBackground>
                :

                // <RNCamera
                //     ref={cameraRef}
                //     defaultVideoQuality={RNCamera.Constants.VideoQuality["240p"]}
                //     captureAudio={false}
                //     style={{ flex: 1 }}
                //     type={isFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                //     androidCameraPermissionOptions={{
                //         title: "Permission to use camera",
                //         message: "We need your permission to use your camera",
                //         buttonPositive: "Ok",
                //         buttonNegative: "Cancel",
                //     }}
                //     androidRecordAudioPermissionOptions={{
                //         title: "Permission to use audio recording",
                //         message: "We need your permission to use your audio",
                //         buttonPositive: "Ok",
                //         buttonNegative: "Cancel",
                //     }}>



                <View style={{ flex: 1, padding: 20 }}>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>


                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <Image source={require('../../Images/musicIcon.png')}
                                style={{ width: 15, height: undefined, aspectRatio: 1 }} />

                            <Text style={{
                                fontFamily: Constants.fontFamilyMedium,
                                fontSize: 12,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Sounds</Text>


                        </View>

                    </View>


                    <View style={{ position: 'absolute', right: 20, top: 100 }}>

                        <TouchableOpacity onPress={() => setIsFront(() => !isFront)}>
                            <View style={{ alignItems: 'center' }}>
                                <Image source={require('../../Images/revertIcon.png')}
                                    style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                                <Text style={{
                                    fontFamily: Constants.fontFamilySemiBold,
                                    fontSize: 10,
                                    includeFontPadding: false,
                                    color: 'white',
                                    marginHorizontal: 5
                                }}>Flip</Text>

                            </View>
                        </TouchableOpacity>

                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <Image source={require('../../Images/timmerIcon.png')}
                                style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                            <Text style={{
                                fontFamily: Constants.fontFamilySemiBold,
                                fontSize: 10,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Speed</Text>

                        </View>
                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <Image source={require('../../Images/megicIcon.png')}
                                style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                            <Text style={{
                                fontFamily: Constants.fontFamilySemiBold,
                                fontSize: 10,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Beauty</Text>

                        </View>
                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <Image source={require('../../Images/efffectIcon.png')}
                                style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                            <Text style={{
                                fontFamily: Constants.fontFamilySemiBold,
                                fontSize: 10,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Filters</Text>

                        </View>
                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <Image source={require('../../Images/timmer.png')}
                                style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                            <Text style={{
                                fontFamily: Constants.fontFamilySemiBold,
                                fontSize: 10,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Timer</Text>

                        </View>
                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <Image source={require('../../Images/flashIcon.png')}
                                style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                            <Text style={{
                                fontFamily: Constants.fontFamilySemiBold,
                                fontSize: 10,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Flash</Text>

                        </View>

                    </View>


                    <View style={{ flex: 1 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { }} style={{ flex: 1, alignItems: 'center' }}>
                            <Image source={require('../../Images/galleryIcon.png')}
                                style={{ width: 40, height: undefined, aspectRatio: 1 }} />

                            <Text style={{
                                fontFamily: Constants.fontFamilyMedium,
                                fontSize: 12,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Upload</Text>
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => {
                            takePicture();
                        }} style={{ flex: 1, alignItems: 'center' }}>
                            <Image source={require('../../Images/captureIcon.png')}
                                style={{ width: 70, height: undefined, aspectRatio: 1 }} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, alignItems: 'center' }}>

                            <Image source={require('../../Images/emojisIcon.png')}
                                style={{ width: 40, height: undefined, aspectRatio: 1 }} />

                            <Text style={{
                                fontFamily: Constants.fontFamilyMedium,
                                fontSize: 12,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Effects</Text>
                        </View>

                    </View>

                </View>
                // </RNCamera>
            }
        </View>)
    }

    const renderScene = SceneMap({
        story: StoryComponent,
        illustration: IllustrationComponent,
        future: FutureVisitComponent
    });

    const [index, setIndex] = useState(0);

    const [routes] = useState([
        { key: 'story', title: 'Story' },
        { key: 'illustration', title: 'Illustration' },
        { key: 'future', title: 'Future Visit' },

    ]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                tabBarPosition='bottom'
                renderTabBar={props => <TabBar {...props} style={{ backgroundColor: theme.backgroundColor, height: 40 }}
                    renderLabel={({ focused, route }) => {
                        return (<View style={{}} >
                            <Text numberOfLines={1} style={{ fontSize: 18, color: theme.textColor, fontFamily: Constants.fontFamilySemiBold }}>{route.title}</Text>
                        </View>);
                    }}
                    indicatorStyle={{
                        backgroundColor: Color.secondary,
                        padding: 1.5,
                    }} />}
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

});

export default CreateStory;
