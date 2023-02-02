import React from 'react'
import { PermissionsAndroid, Platform, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import Modal from "react-native-modal";

import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { Constants } from "../common";
import { toast } from "../Omni";
import { useTheme } from './../Context';


const options = {
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    cameraType: 'back',
    includeBase64: false,
    saveToPhotos: false

}

const ImagePickerDialog = ({ isModalVisible, setModalVisibility, onImagePic, onViewImage, isImageView = false, onRemoveImage }) => {
    const { theme } = useTheme();


    const requestCameraPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true
                } else {
                    toast("Camera permission denied");
                    return false
                }
            } else {
                return true
            }

        } catch (err) {
            console.warn(err);
        }
    };

    const pickImageFromCamera = async () => {
        if (await requestCameraPermission()) {
            launchCamera(options, (response) => {
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
                            value.uri = Platform.OS == 'ios' ? value.uri.replace('file://', '/private') : value.uri
                            value.name = value.fileName
                            onImagePic(value)
                        } else {
                            toast('Something went wrong, please try again')
                        }
                        setModalVisibility(false)
                    } else {
                        if (response.errorMessage) {
                            toast(response.errorMessage)

                        } else {
                            toast('Something went wrong, please try again')

                        }
                    }

                }
            })
        }


    }

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
                        value.name = value.fileName
                        onImagePic(value)
                    } else {
                        toast('Something went wrong, please try again')
                    }
                    setModalVisibility(false)
                } else {
                    toast('Something went wrong, please try again')
                }

            }
        })
    }

    return (<Modal
        transparent={true}
        isVisible={isModalVisible}
        onRequestClose={() => {
            setModalVisibility(false);
        }}
        onBackdropPress={() => {
            setModalVisibility(false);
        }}
        style={{
            margin: 0,
            bottom: 0,
            position: 'absolute',
            width: '100%',

        }}>

        <View style={{ backgroundColor: theme.modalBackgroundColor, borderTopRightRadius: 20, borderTopLeftRadius: 20, paddingBottom: 20, marginTop: 'auto' }}>


            <View style={{ marginLeft: 20 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                    <Text style={styles(theme).heading}>Select Image</Text>
                </View>

                {isImageView ? <TouchableOpacity onPress={() => { onRemoveImage(true) }} style={{ marginVertical: 15 }}>
                    <Text style={styles(theme).title}>Remove Photo</Text>
                </TouchableOpacity> : null}

                {isImageView ? <TouchableOpacity onPress={() => { onViewImage() }} style={{ marginVertical: 15 }}>
                    <Text style={styles(theme).title}>View Photo</Text>
                </TouchableOpacity> : null}

                <TouchableOpacity onPress={() => pickImageFromCamera()} style={{ marginVertical: 15 }}>
                    <Text style={styles(theme).title}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => pickImageFromGallery()} style={{ marginVertical: 15 }}>
                    <Text style={styles(theme).title}>Choose from Library</Text>
                </TouchableOpacity>
            </View>

        </View>

    </Modal>
    )
}

export default ImagePickerDialog

const styles = (theme) => StyleSheet.create({
    heading: {
        fontFamily: Constants.fontFamilyBold,
        fontSize: 18,
        includeFontPadding: false,
        color: theme.textColor
    },
    title: {
        fontFamily: Constants.fontFamilyMedium,
        fontSize: 13,
        includeFontPadding: false,
        color: theme.textColor
    }
})
