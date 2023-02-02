import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, Text, TouchableOpacity, View, } from 'react-native';
import Color from "../../common/Color";
import Constants from "../../common/Constants";

import Video from 'react-native-video';
import Button1Component from "../../Components/Button1Component";


const ReelPreviewScreen = (props) => {


    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [videoURL, setVideoURL] = useState('');

    useEffect(() => {
        setVideoURL(props?.route?.params?.previewUrl);
    }, [])

    const uploadReel = async () => {

        // if (imageurl !== null) {


        //     if (props.route.params.action == 'reel') {
        //         props.navigation.replace('UploadReelScreens', { imageurl: imageurl })
        //     } else {
        //         props.navigation.navigate('AddStoryScreens', { imageurl: imageurl, coordinates: props?.route?.params?.coordinates })
        //     }
        // }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>

            <View
                style={{
                    width: windowWidth,
                    height: windowHeight,
                    backgroundColor: Color.primary
                }}>

                <Video
                    source={{
                        uri: videoURL,
                    }}
                    autoPlay={true}
                    repeat={true}
                    resizeMode='cover'
                    style={{
                        width: '100%',
                        height: '92%',
                        borderRadius: 10,
                    }}
                    playInBackground={false}
                    ignoreSilentSwitch={'ignore'}
                    onError={(e) => {
                        console.log("e", e);
                    }}
                />

                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>

                    <TouchableOpacity onPress={() => {
                        props.navigation.pop();
                    }}>
                        <Text style={{
                            fontFamily: Constants.fontFamilySemiBold,
                            fontSize: 18,
                            includeFontPadding: false,
                            color: 'white',
                            marginLeft: 10
                        }}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { uploadReel() }}>
                        <Text style={{
                            fontFamily: Constants.fontFamilySemiBold,
                            fontSize: 18,
                            includeFontPadding: false,
                            color: 'white',
                            marginRight: 10
                        }}>Next</Text>
                    </TouchableOpacity>

                </View>
            </View>

        </SafeAreaView >
    );
}



export default ReelPreviewScreen;