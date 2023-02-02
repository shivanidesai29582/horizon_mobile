import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from 'react-redux';
import { useTheme } from './../Context';
import global from "./../common/globals";
import { Color, Constants } from '../common';
const windowWidth = Dimensions.get('window').width;

const DrawerContent = (props) => {
  const { theme, updateTheme } = useTheme();
  const [isDark, setIsDark] = useState('');
  const [isGrey, setIsGrey] = useState('');
  const [isLight, setIsLight] = useState('');
  const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
  const profileImage = { uri: user?.profile_photo == null ? global.USER_PROFILE_URL : user?.profile_photo };
  const name = user?.first_name === null ? "unnamed" : `${user?.first_name}`;
  const username = user?.username === null ? "unnamed" : user?.username;
  const changeTheme = (newtheme) => updateTheme(theme.themeMode, newtheme);
  const toggleTheme = (newtheme) => { changeTheme(newtheme) }

  const menuItems = (iconName, title, onPress) => {
    return (
      <TouchableOpacity style={styles(theme).row} onPress={onPress}>
        <View style={styles(theme).section}>
          <Ionicons name={iconName} color={theme.textColor} size={20} style={{ marginRight: 10 }} />
          <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 16, lineHeight: 18, color: theme.textColor }}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const detailItems = (iconName, title, onPress) => {
    return (
      <TouchableOpacity style={styles(theme).row} onPress={onPress}>
        <View style={styles(theme).section}>
          <Image style={{ height: 20, width: 20, tintColor: theme.textColor, marginRight: 10, resizeMode: 'contain' }} source={iconName} />
          <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 16, lineHeight: 18, color: theme.textColor }}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <DrawerContentScrollView {...props} >
        <View style={{ padding: 10, borderBottomWidth: 0.5, borderBottomColor: Color.placeHolderGrey }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image style={{ height: 50, width: 50, borderRadius: 35 }} source={profileImage} />
            <TouchableOpacity onPress={() => {
              props.navigation.navigate('NoficationScreen')
            }}>
              <Image style={{ height: 25, width: 25, alignSelf: 'center', tintColor: theme.textColor }} source={require('../Images/bell.png')} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 20, lineHeight: 24, color: theme.textColor }}>{name}</Text>
            <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 16, lineHeight: 18, color: theme.textColor, paddingTop: 8 }}>{username}</Text>
          </View>
        </View>
        {menuItems('person-outline', 'Profile', () => {
          props.navigation.navigate('ProfileStack')
        })}
        {menuItems('md-save-outline', 'Saved', () => {
          props.navigation.closeDrawer();
          props.navigation.navigate('UserCollection')
        })}
        {menuItems('wallet-outline', 'Wallet', () => {
          props.navigation.navigate('WalletScreen')
        })}
        {menuItems('md-information-circle-outline', 'Horizon referal program ', () => {
          props.navigation.navigate('ReferalScreen1')
        })}
        {detailItems(require("./../Images/Proffessional.png"), 'Horizon for Proffessionals', () => {
          props.navigation.navigate('ProffessionalScreen')
        })}
        {detailItems(require("./../Images/medal.png"), 'COVID-19 Information Center', () => {
          props.navigation.navigate('WebviewScreen', { url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019' })
        })}
      </DrawerContentScrollView>
      <View style={{ alignItems: 'center', padding: 15 }}>
        <View style={{ flexDirection: 'row', padding: 8, width: windowWidth - 200, borderRadius: 30, borderColor: theme.textColor, alignItems: "center", justifyContent: 'space-between', borderWidth: 1, }} >
          <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: "row", height: 40, width: 40, borderRadius: 30, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 5, shadowRadius: 2 }, android: { elevation: 25 } }), alignItems: "center", justifyContent: "center", backgroundColor: 'white' }} onPress={() => toggleTheme('dark')}>
            <Image style={{ height: 25, width: 25, borderRadius: 35 }} source={(require('../Images/darkMode.png'))} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: "row", height: 40, width: 40, borderRadius: 30, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 5, shadowRadius: 2 }, android: { elevation: 25 } }), alignItems: "center", justifyContent: "center", backgroundColor: '#7f7f7f' }} onPress={() => toggleTheme('grey')}>
            <Image style={{ height: 25, width: 25, borderRadius: 35, resizeMode: 'contain' }} source={(require('../Images/gray_theme.png'))} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: "row", height: 40, width: 40, borderRadius: 30, ...Platform.select({ ios: { shadowColor: '#fff', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 5, shadowRadius: 2 }, android: { elevation: 25 } }), alignItems: "center", justifyContent: "center", backgroundColor: 'black' }} onPress={() => toggleTheme('default')}>
            <Image style={{ height: 30, width: 30, borderRadius: 35 }} source={(require('../Images/light1.png'))} />
          </TouchableOpacity>
        </View>
      </View >

      {/* <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center'}} onPress={() => { toggleTheme() }}>
        <Image style={{ height: 100, width: 200, resizeMode: 'contain' }} source={(require('../Images/light.png'))} />
      </TouchableOpacity> */}
      {/* <View style={{ padding: 10, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
        {isDark ?
        <TouchableOpacity style={{ height: 45, width: 80, paddingHorizontal:5, justifyContent: 'center', backgroundColor: 'white', borderRadius: 25}} onPress={() => { toggleTheme() }}>
          <Image style={{ height: 35, width: 35, borderRadius: 35 }} source={(require('../Images/darkMode.png'))} />
        </TouchableOpacity>
        :
        <TouchableOpacity style={{ height: 45, width: 80, paddingHorizontal:5, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'black' ,borderRadius: 50}} onPress={() => { toggleTheme() }}>
          <Image style={{ height: 30, width: 30, borderRadius: 35}} source={(require('../Images/light1.png'))} />
        </TouchableOpacity>
        }
      </View> */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        isVisible={modalVisible}
        // backdropColor={'transparent'}
        onRequestClose={() => {
          setmodalVisible(false);
        }}
        onBackdropPress={() => {
          setmodalVisible(false);
        }}
        style={{
            height:100,
            bottom: 130,
            position: 'absolute',
            backgroundColor: Color.yellow,
            backfaceVisibility: 'visible'
        }}>
          <View style={{ alignItems: 'center', justifyContent: "center" }}>
            <Text style={{ color: theme.textColor, fontSize: 17 }} onPress={() => setmodalVisible(false)}>Save</Text>
          </View>
        </Modal> */}
    </SafeAreaView >
  );
}

const styles = (theme) => StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: 'red'
  },
  userInfoSection: {
    backgroundColor: 'pink',
    paddingHorizontal: 10
  },
  row: {
    marginTop: 25,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerContent;
