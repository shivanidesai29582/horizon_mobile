import React, { useRef, useState, useContext } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  Animated
} from 'react-native';
import Constants from '../../../common/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { normalize, wp, hp } from '../../../common/ResponsiveScreen';
import ReadMore from './ReadMore';
import * as Animatable from 'react-native-animatable';
import { setLikes } from '../../../redux/likes';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../Context';
import global from "./../../../common/globals";
import Modal from "react-native-modal";
import Share from 'react-native-share';
import Color from '../../../common/Color';
import NoDataScreen from '../../NoDataScreen';
import { Dropdown } from 'react-native-element-dropdown';
import Button1Component from "../../../Components/Button1Component";
import { addFollow, removeFollow, addFavCollection, getMyFollowing } from './../../../redux/userlogin';
import { AddReport } from './../../../redux/contentreport';
import { Deletereel } from './../../../redux/reels';
import { AppContext } from '../../../Context';
import horizonApiAxios from '../../../services/restclient/horizonApiAxios';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export default function ReelFooter({ item, navigation }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const currentLogedUser = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
  let currentLogedUserID = currentLogedUser?.id;
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [searchTxt, setSearchTxt] = useState('')
  const profileImage = { uri: item?.author_profile_photo == null ? global.USER_PROFILE_URL : item?.author_profile_photo };
  const [isFollowing, setIsFollowing] = useState(item?.is_follow);
  const [isLiked, setIsLiked] = useState(item?.is_liked);
  const [isSaved, setIsSaved] = useState(item?.is_in_collection ? item?.is_in_collection : false);
  let myFollowingsList = useSelector((state) => state?.userlogin?.myFollowings);
  let reportsCategory = useSelector((state) => state?.contentreport?.reportcategories);
  const [reportKey, setreportKey] = useState(reportsCategory ? reportsCategory[0]?.key : '');
  const [loading, setLoading] = useState(false);

  const { isMute, setIsMute } = useContext(AppContext);
  const [viewAnim] = useState(new Animated.Value(0));
  const [viewLikeAnim] = useState(new Animated.Value(0));

  let lastTap = null;
  const timer = useRef(null);
  const lottieRef = useRef(null);

  const onVolumePress = () => {

    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 350;

    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      clearTimeout(timer.current);
      Animated.timing(viewLikeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        fadeOut(viewLikeAnim);
      });

      !isLiked ? OnLike() : null;

    } else {
      lastTap = now;
      timer.current = setTimeout(() => {
        setIsMute();
        Animated.timing(viewAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          fadeOut(viewAnim);
        });
      }, DOUBLE_PRESS_DELAY)
    }
  };

  const fadeOut = (anim) => {
    Animated.timing(anim, {
      delay: 500,
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const OnFollow = () => {
    dispatch(addFollow({ id: `${item?.authorId}` }))
    setIsFollowing(true);
  }

  const OnUnFollow = () => {
    dispatch(removeFollow({ id: item?.authorId }))
    setIsFollowing(false);
  }

  const OnSaved = () => {
    dispatch(addFavCollection(item?.id, 'reels'))
    setIsSaved(() => !isSaved)
  }

  const OnLike = () => {
    setIsLiked(() => !isLiked)
    dispatch(setLikes(item?.id))
  }

  const OnSend = () => {
    dispatch(getMyFollowing()).then(() => {
      setIsSendModalVisible(true);
    });
  }

  const OnReportSend = () => {
    setLoading(true);
    dispatch(AddReport(item?.id, 'reels', reportKey)).then(() => {
      setIsReportModalVisible(false);
      setLoading(false);
    });
  }

  const OnUserSend = async (user) => {
    setIsSendModalVisible(false);
    console.log("************ currentLogedUserID", currentLogedUserID);
    console.log("************ to", user?.id);

    // file_url: { url: response?.data?.data[0]?.url },
    // type: response?.data?.data[0]?.type

    // await horizonApiAxios.post(`/addmsg`, {
    //   from: currentLogedUserID,
    //   to: user?.id,
    //   message: '',
    // }).then(() => {
    //   setIsSendModalVisible(false);
    // }).catch((error) => {
    //   setIsSendModalVisible(false);
    // })
  }

  // Delete Reel
  const OnDelete = async () => {
    setAlertModalVisible(true);
  }

  // Edit Reel
  const OnEdit = () => {
    setIsMoreModalVisible(false);
    if (navigation) {
      navigation.navigate('UploadReelScreens', { item });
    }
  }

  const OnReelDeleteReject = async () => {
    setAlertModalVisible(false);
    setIsMoreModalVisible(false);
  }

  const OnReelDeleteConform = async () => {
    dispatch(Deletereel(item?.id, 'tranding')).then((resp) => {
      setIsMoreModalVisible(false);
      setAlertModalVisible(false);
      if (resp.status == 200) {
        console.log('Hide Reel id ' + item);
      }
    });
  }

  const buildLink = async () => {

    const link = await dynamicLinks().buildShortLink({
      link: `${global.DEEPLINKING_URL}/REEL/${item?.id}`,
      domainUriPrefix: 'https://horizonbird.page.link',
      android: { packageName: 'com.whiteorigin.horizon' },

    });

    let options = {
      title: 'Horizon',
      message: `Check out this awesome reel from ${item?.author_username}: ${link}`
    }
    Share.open(options)
      .then((res) => {
        setIsMoreModalVisible(false);
      })
      .catch((err) => {
        setIsMoreModalVisible(false);
      });

  }
  return (<TouchableOpacity
    activeOpacity={1}
    onPress={onVolumePress}
    style={styles.touchArea}>
    <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.6)']} style={styles.footerContainer}>

      <View style={styles.userContainer}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 120 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
            navigation.navigate('UserProfile', { item: { id: item?.authorId } })
          }}>
            <Image
              source={profileImage}
              style={styles.userImage}
            />
            <View style={{ maxWidth: 140 }}>
              <Text style={styles.txtUserName} numberOfLines={1}>{item?.author_username == null ? 'null' : item?.author_username}</Text>
            </View>
          </TouchableOpacity>
          {(currentLogedUserID && item?.authorId !== currentLogedUserID) && <TouchableOpacity style={styles.followBtn} onPress={() => { isFollowing ? OnUnFollow() : OnFollow() }}>
            <Text style={styles.txtFollow}>{isFollowing ? "Following" : "Follow"}</Text>
          </TouchableOpacity>}
        </View>
        <View>
          <TouchableOpacity style={[styles.circleImage, { marginBottom: 25 }]} onPress={() => {
            OnLike();
          }}>
            <Image
              source={require('./../../../Images/ic_red_like.png')}
              style={{ resizeMode: 'contain', height: 20, width: 20, tintColor: isLiked ? '#FF0000' : '#F2F2F2' }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.circleImage, { marginBottom: 25 }]} onPress={() => { navigation.navigate('CommentsScreen', { reelId: item.id }) }}>
            <Image
              source={require('./../../../Images/ic_comment.png')}
              style={{ resizeMode: 'contain', height: 20, width: 40 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleImage} onPress={() => { OnSend() }}>
            <Image
              source={require('./../../../Images/ic_send.png')}
              style={{ resizeMode: 'contain', height: 20, width: 20 }}
            />
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.txtDate}>
            {moment(item?.created_at).format('MMM DD')}
          </Text> */}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginTop: 5 }}>

          {item?.title.length > 30 ? <ReadMore numberOfLines={1}>
            <Text style={styles.txtAudioTitle}>
              {item?.title}
            </Text>
          </ReadMore> :
            <Text style={styles.txtAudioTitle}>
              {item?.title}
            </Text>
          }

          {item?.description.length > 30 ? <ReadMore numberOfLines={1}>
            <Text style={styles.txtDescription}>
              {item?.description}
            </Text>
          </ReadMore> :
            <Text style={styles.txtDescription}>
              {item?.description}
            </Text>
          }

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.circleImage}
            onPress={() => {
              OnLike();
            }}
          >
            {isLiked ?
              <Animated.View style={{
                height: 50,
                width: 50
              }}>
                <LottieView
                  ref={lottieRef}
                  style={{ height: 50, width: 50 }}
                  source={require('./../../../assets/heart.json')}
                  autoPlay={true}
                  loop={false}
                />
              </Animated.View>
              :
              <View style={{ height: 25, width: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ height: 25, width: 25, tintColor: 'white', resizeMode: 'contain' }} source={require('./../../../Images/like.png')} />
              </View>
            }
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.circleImage} onPress={() => {
            OnLike();
          }}>

            <Image
              source={require('./../../../Images/ic_red_like.png')}
              style={{ resizeMode: 'contain', height: 20, width: 20, tintColor: isLiked ? '#FF0000' : '#F2F2F2' }}
            />
          </TouchableOpacity> */}
          <TouchableOpacity style={[styles.circleImage, { marginHorizontal: 24 }]} onPress={() => { navigation.navigate('CommentsScreen', { reelId: item.id }) }}>
            <Image
              source={require('./../../../Images/Comments.png')}
              style={{ resizeMode: 'contain', height: 30, width: 30 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleImage} onPress={() => { OnSend() }}>
            <Image
              source={require('./../../../Images/send.png')}
              style={{ resizeMode: 'contain', height: 20, width: 20 }}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => {
            setIsMoreModalVisible(true)
          }}>
            <Entypo
              name={'dots-three-horizontal'}
              style={styles.footerIcon}
              color={'#fff'}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../../Images/music2.jpg')}
              style={styles.userImage}
            />
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity style={[styles.circleImage, { marginTop: 20 }]} onPress={() => {
          setIsMoreModalVisible(true)
        }}>
          <Image resizeMode='contain' source={require('./../../../Images/ic_more.png')}
            style={{ height: 25, width: 25 }}
          />
        </TouchableOpacity>

      </View>

      <Modal
        animationType="slide"
        transparent={true}
        isVisible={isSendModalVisible}
        // backdropColor={'transparent'}
        onRequestClose={() => {
          setIsSendModalVisible(false);
        }}
        onBackdropPress={() => {
          setIsSendModalVisible(false);
        }}
        style={{
          margin: 0,
          bottom: 0,
          position: 'absolute',
          width: '100%',
          backgroundColor: 'transparent',
          backfaceVisibility: 'visible'
        }}>
        <View style={{ backgroundColor: theme.modalBackgroundColor, borderTopRightRadius: 20, borderTopLeftRadius: 20, height: 500 }}>
          {(!myFollowingsList || myFollowingsList.length === 0) ?
            <NoDataScreen isVisible={(!myFollowingsList || myFollowingsList.length === 0)} message="Looks like you dont't search anything yet." />
            :
            <FlatList
              data={myFollowingsList?.filter((following) => following.username.toLowerCase().includes(searchTxt.toLowerCase())) || []}
              stickyHeaderIndices={[0]}
              style={{ marginTop: 20 }}
              ListHeaderComponent={
                <View style={styles.searchView}>
                  <Ionicons name={'search-outline'} size={20} style={{ marginHorizontal: 8, color: "#fff" }} />
                  <TextInput
                    value={searchTxt}
                    placeholder='Search'
                    placeholderTextColor={Color.grey}
                    style={{ height: 30, width: '80%', fontFamily: Constants.fontFamilyRegular, textAlignVertical: 'center', color: '#fff', paddingVertical: 0 }}
                    onChangeText={(val) => setSearchTxt(val)}
                  />
                </View>
              }
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity style={{ marginVertical: 8, flexDirection: 'row' }} onPress={() => {
                    // setIsSendModalVisible(false)
                  }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between', width: '100%' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: item?.profile_photo == null ? global.USER_PROFILE_URL : item?.profile_photo }} />
                        <Text
                          style={{ marginLeft: 15, color: theme.textColor, fontSize: 15, fontFamily: Constants.fontFamilyRegular, width: '60%' }}
                          numberOfLines={1}>{item?.username}</Text>
                      </View>

                      <TouchableOpacity style={{ height: 30, width: 70, backgroundColor: '#458eff', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} onPress={() => { OnUserSend(item) }}>
                        <Text style={{
                          fontFamily: Constants.fontFamilySemiBold,
                          color: '#fff'
                        }}>Send</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )
              }} />
          }
        </View>
      </Modal>

      <Modal
        transparent={true}
        isVisible={isMoreModalVisible}
        // backdropColor={'transparent'}
        onRequestClose={() => {
          setIsMoreModalVisible(false);
          setAlertModalVisible(false);
        }}
        onBackdropPress={() => {
          setIsMoreModalVisible(false);
          setAlertModalVisible(false);
        }}
        style={{
          margin: 0,
          bottom: 0,
          position: 'absolute',
          width: '100%',
          backgroundColor: 'transparent',
          backfaceVisibility: 'visible'
        }}>
        <View style={{ backgroundColor: theme.modalBackgroundColor, borderTopRightRadius: 20, borderTopLeftRadius: 20, }}>
          {isAlertModalVisible ?
            (
              <View style={{ marginTop: 10 }}>
                <Text style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row', color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Are you sure you want to delete this?</Text>
                <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnReelDeleteConform(); }} >
                  <Ionicons name={'ios-checkmark-sharp'} color={theme.deletetextColor} size={25} style={{ marginRight: 10 }} />
                  <Text style={{ color: theme.deletetextColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnReelDeleteReject(); }} >
                  <Ionicons name={'ios-close-sharp'} color={theme.textColor} size={25} style={{ marginRight: 10 }} />
                  <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>No</Text>
                </TouchableOpacity>

              </View>
            )
            :
            (
              <View style={{ marginTop: 10, flex: 1 }}>

                <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => {
                  // setIsMoreModalVisible(false)
                  // setTimeout(() => {
                  //   let options = {
                  //     title: 'Horizon',
                  //     message: `Check out this awesome reel from ${item?.author?.username}: ${item?.video_url}\nhttps://horizon.whiteorigin.in?reel=${item?.id}`
                  //   }
                  //   Share.open(options)
                  //     .then((res) => {
                  //     })
                  //     .catch((err) => {
                  //     });
                  // }, 500);
                  buildLink();
                }} >
                  <Ionicons name={'share-social-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                  <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Share</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }} onPress={() => {
                  setIsMoreModalVisible(false)
                }} >
                  <Ionicons name={'link-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                  <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Link</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnSaved(); }} >
                  <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                  <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>{isSaved ? "Saved" : "Save"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => {
                  setIsMoreModalVisible(false);
                  setIsReportModalVisible(true)
                }}>
                  <Ionicons name={'alert-circle-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                  <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Report</Text>
                </TouchableOpacity>

                {(currentLogedUserID && item?.authorId == currentLogedUserID) && <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnDelete() }}>
                  <Ionicons name={'ios-trash-outline'} color={theme.deletetextColor} size={25} style={{ marginRight: 5 }} />
                  <Text style={{ color: theme.deletetextColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Delete</Text>
                </TouchableOpacity>}

                {(currentLogedUserID && item?.authorId == currentLogedUserID) && <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnEdit() }}>
                  <Ionicons name={'pencil'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                  <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Edit</Text>
                </TouchableOpacity>}

              </View>
            )
          }
        </View>
      </Modal>

      <Modal
        transparent={true}
        isVisible={isReportModalVisible}
        // backdropColor={'transparent'}
        onRequestClose={() => {
          setIsReportModalVisible(false);
        }}
        onBackdropPress={() => {
          setIsReportModalVisible(false);
        }}
        style={{
          margin: 0,
          bottom: 0,
          position: 'absolute',
          width: '100%',
          backgroundColor: 'transparent',
          backfaceVisibility: 'visible'
        }}

      >
        <View style={{ backgroundColor: theme.modalBackgroundColor, borderTopRightRadius: 20, borderTopLeftRadius: 20, flex: 1 }}>
          <View style={{ marginTop: 10 }}>
            <Dropdown
              style={[Platform.OS == 'ios' ? styles.iosDropUpDownStyle : styles.androidDropUpDownStyle, { alignSelf: 'center', marginVertical: 10, borderWidth: 1, borderColor: '#9F9696', borderRadius: 15, }]}
              placeholderStyle={[styles.droupdownText, { color: theme.textColor }]}
              selectedTextStyle={[styles.droupdownText, { color: theme.textColor }]}
              data={reportsCategory}
              maxHeight={220}
              labelField="value"
              valueField="key"
              placeholder={reportsCategory[0]?.value}
              value={reportsCategory[0]?.key}
              containerStyle={{ backgroundColor: theme.backgroundColor }}
              activeColor={theme.backgroundColor}
              onChange={item => {
                setreportKey(item.value);
              }}
            />
            <Button1Component visible={loading} onPress={() => { OnReportSend() }} title={'Submit Report'} extraviewstyle={{ margin: 20 }} />

            {/* <FlatList
              data={DATA}
              renderItem={renderItem}
              bounces={false}
              showsVerticalScrollIndicator={false}
              style={{ paddingLeft: 20, paddingVertical: 15 }}
            /> */}
            {/* <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>
              <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }}>
                <Ionicons name={'share-social-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ marginVertical: 15, flexDirection: 'row' }}>
                <Ionicons name={'bookmark-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Save</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </Modal >

    </LinearGradient >

    <Animated.View
      style={[
        styles.muteBtn,
        {
          opacity: viewAnim,
        },
      ]}>

      <Ionicons
        name={isMute ? 'volume-mute' : 'md-volume-medium'}
        style={{ paddingHorizontal: 5 }}
        color={'#fff'}
        size={25}
      />
    </Animated.View>

    <Animated.View
      style={[
        {
          opacity: viewLikeAnim,
        },
      ]}>
      <LottieView
        ref={lottieRef}
        style={{
          height: 180,
          width: 180
        }}
        source={require('./../../../assets/heart.json')}
        autoPlay={true}
      />
    </Animated.View>

  </TouchableOpacity >

  );
}

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    ...Platform.select({
      android: {
        bottom: 0,
      },
      ios: {
        bottom: 110,
      },
    }),
    right: 0,
    left: 0,
    paddingHorizontal: wp(5),
  },
  txtAudioTitle: {
    fontFamily: Constants.fontFamilyRegular,
    fontSize: normalize(13),
    includeFontPadding: false,
    color: 'white',
    padding: 0,
    marginTop: wp(2),
    marginBottom: wp(2),
  },
  txtDescription: {
    fontFamily: Constants.fontFamilyRegular,
    fontSize: normalize(13),
    includeFontPadding: false,
    color: 'white',
    padding: 0,
    textAlign: 'left',
    marginBottom: wp(2),
  },
  redHeart: {
    position: 'absolute',
    top: -15,
    right: -10,
  },
  userImage: {
    height: wp(10),
    width: wp(10),
    borderRadius: wp(5),
    alignSelf: 'flex-start',
  },
  footerIcon: {
    paddingHorizontal: 12
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchView: {
    height: 40,
    marginHorizontal: 15,
    backgroundColor: Color.darkGrey3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
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
  },
  circleImage: {
    alignItems: 'center',
    height: 35,
    width: 35,
    borderRadius: 35,
    backgroundColor: '#F2F2F24D',
    justifyContent: 'center'
  },
  droupdownText: {
    fontFamily: Constants.fontFamilyRegular,
    fontSize: 13
  },
  iosDropUpDownStyle: {
    height: 48,
    width: '95%',
    padding: 15,
    borderRadius: 10,
  },
  androidDropUpDownStyle: {
    height: 48,
    width: '95%',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
  },
  touchArea: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteBtn: {
    position: 'absolute',
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
