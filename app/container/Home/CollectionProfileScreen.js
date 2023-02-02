import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity, SafeAreaView, ImageBackground, Dimensions, FlatList, Linking

} from 'react-native';
import Modal from "react-native-modal";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginHeader from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import Color from "../../common/Color";
import { useDispatch, useSelector } from 'react-redux';
import { getCollectionById } from "../../redux/collection";
import global from "./../../common/globals";
import { useTheme } from './../../Context';
import NoDataScreen from '../NoDataScreen';
import ButtonComponent from "../../Components/ButtonComponent";

const { width } = Dimensions.get("window");


const CollectionProfileScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const collectionData = useSelector((state) => state?.collection?.collection);

    useEffect(() => {
        props?.route?.params?.item?.id ? dispatch(getCollectionById({ id: props?.route?.params?.item?.id })) : null;
    }, [props?.route?.params?.item?.id]);


    const name = collectionData?.collection_name;
    const description = collectionData?.description;
    const collectionAddress = collectionData?.collection_address;
    const profileImage = { uri: collectionData?.collection_logo_image == null ? global.USER_PROFILE_URL : collectionData?.collection_logo_image };
    const profileCoverImage = { uri: collectionData?.collection_cover_image == null ? global.COLLECTION_IMAGE_URL2 : collectionData?.collection_cover_image };
    const NFTArray = collectionData?.nfts;

    const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
    const currentLogedUser = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    let currentLogedUserID = currentLogedUser?.id;

    const OnEdit = () => {
        setIsMoreModalVisible(false);
        if (props) {
            props.navigation.navigate('CreateScreen', { item: props?.route?.params?.item, requestFrom: 'collectionEdit' })
        }
    }

    const NFTComponent = () => {
        return (
            <FlatList

                horizontal={false}
                numColumns={3}
                data={NFTArray}
                style={{}}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity onPress={() => { props.navigation.navigate('NFTDetailScreen', { item }) }} style={{ height: "100%", width: (width / 3) - 4, margin: 2 }}>
                            <Image style={{ resizeMode: 'contain', aspectRatio: 1 }} source={{ uri: item?.image_url == null ? global.COLLECTION_IMAGE_URL2 : item?.image_url }} />
                        </TouchableOpacity>
                    )
                }} />

        )
    }


    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            {(!collectionData || collectionData.length === 0) ?
                <NoDataScreen isVisible={(!collectionData || collectionData.length === 0)} message="Looks like you dont't search anything yet." />
                :
                <>
                    <ImageBackground source={profileCoverImage} style={{ width: '100%', height: undefined, aspectRatio: 3.07, alignItems: 'center' }}>

                        <LoginHeader onBackPress={() => {
                            props.navigation.pop()
                        }} />

                        <View style={{ borderWidth: 1, borderColor: "red", borderRadius: 42.5, height: 85, width: 85, justifyContent: 'center', position: 'absolute', bottom: -40 }}>
                            <Image source={profileImage} style={{ height: 80, width: 80, borderRadius: 40, alignSelf: "center" }} resizeMode='contain' />
                        </View>
                    </ImageBackground>

                    <View style={{ flex: 1, marginTop: 40 }}>
                        <View style={{ padding: 20, alignItems: 'center', marginBottom: 20 }}>
                            <Text style={{
                                fontSize: 25,
                                fontFamily: Constants.fontFamilyBold,
                                color: theme.textColor,
                                marginTop: 15,
                                includeFontPadding: false,
                                padding: 0
                            }}>{name}</Text>
                            <Text style={{
                                fontSize: 11,
                                color: '#B9B8BC',
                                fontFamily: Constants.fontFamilyRegular,
                                textAlign: 'center'
                            }}>{description}</Text>

                            {/* <Text style={{
                        fontSize: 11,
                        color: 'white',
                        fontFamily: Constants.fontFamilyRegular,
                        textAlign: 'center'
                    }}>Collection Address</Text> */}
                            <Text style={{
                                fontSize: 12,
                                color: theme.textColor,
                                fontFamily: Constants.fontFamilyRegular,
                                textAlign: 'center'
                            }}>{collectionAddress}</Text>

                        </View>

                        {NFTComponent()}


                    </View>
                </>
            }
            <ButtonComponent onPress={() => {
                Linking.openURL(`https://metamask.app.link/dapp/marketplace.whiteorigin.in/nft/${props?.route?.params?.item?.id}`)
            }} extraviewstyle={{ position: "absolute", bottom: 10, width: '30%', alignSelf: 'center', backgroundColor: Color.yellow, borderRadius: 30, justifyContent: 'center' }} extratextstyle={{ fontSize: 18, color: 'black', paddingVertical: 5 }} title={"Open"} />

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

    elevationLow: {
        backgroundColor: 'white',
        padding: 7,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3, },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
            android: {
                elevation: 10,
            },
        }),
    },
});
export default CollectionProfileScreen;

