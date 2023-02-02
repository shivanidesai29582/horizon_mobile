import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import Constants from '../../../common/Constants';
import { hp, normalize, wp } from '../../../common/ResponsiveScreen';
import LinearGradient from 'react-native-linear-gradient';

export default function ReelHeader({ item, navigation }) {

  return (
    // <View style={styles.headerContainer}>
    <LinearGradient colors={['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0)']} style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => { navigation.navigate('CreateReelScreen') }}
          style={styles.headerIcon}>
          <Image
            source={require('../../../Images/ic_create_reel_camera.png')}
            style={styles.cameraImage}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { flex: 1 }]}>Limelight</Text>


      </View>
    </LinearGradient>
    // </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    // top: isIOS ? (isX ? hp(4) : hp(2)) : hp(0),
    top: 0,
    right: 0,
    left: 0,
    padding: wp(5),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    height: wp(10),
    width: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Constants.fontFamilyBold,
    fontSize: normalize(20),
    includeFontPadding: false,
    color: 'white',
    marginLeft: wp(7),
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
  },
  userImage: {
    width: wp(12),
    height: undefined,
    aspectRatio: 1,
    borderRadius: wp(7.5),
  },
  cameraImage: {
    width: wp(8),
    height: wp(8),
  },

  txtUserName: {
    fontFamily: Constants.fontFamilyMedium,
    fontSize: normalize(18),
    includeFontPadding: false,
    color: 'white',
    padding: 0,
    marginLeft: wp(3),
    maxWidth: wp(50),
  },
  txtDate: {
    fontFamily: Constants.fontFamilyRegular,
    fontSize: normalize(16),
    includeFontPadding: false,
    color: 'white',
    padding: 0,
    marginLeft: wp(3),
  },
  txtFollow: {
    fontFamily: Constants.fontFamilySemiBold,
    fontSize: normalize(15),
    includeFontPadding: false,
    color: 'white',
    padding: 0,
  },
  followBtn: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  }
});
