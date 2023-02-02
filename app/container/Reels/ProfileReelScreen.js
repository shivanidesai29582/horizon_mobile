import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, Dimensions, Image, SafeAreaView, FlatList, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getReelCategory, getReelsByUserID } from '../../redux/reels';
import { toast } from '../../Omni';
import ReelItem from './Components/ReelItem';
import { useIsFocused } from '@react-navigation/native';
import Constants from '../../common/Constants';
import { putUserUpdate } from "./../../redux/userlogin";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


const ProfileReelScreen = props => {
  const dispatch = useDispatch();
  let currentReelsData = useSelector((state) => state?.reels?.userreels);
  const [tradingReelsData, settradingReelsData] = useState(currentReelsData)
  // tradingReelsData = useSelector(state => state?.reels?.userreels);
  // console.log("tradingReelsData",tradingReelsData);

  let user = useSelector((state) => state?.userlogin?.userInfo);
  const currentLogedinUserId = user?.id;
  let UserId = (props?.route?.params?.item?.from && props?.route?.params?.item?.from === 'userprofile') ? props?.route?.params?.item?.UserId : currentLogedinUserId;
  const ReelCategory = useSelector(state => state?.reels?.reelCategory);
  let startPage = (props?.route?.params?.item?.page && props?.route?.params?.item?.page !== undefined) ? props?.route?.params?.item?.page : 1;
  const [startFrom, setstartFrom] = useState(startPage);
  const [requesting, setrequesting] = useState(true);
  const [firstCall, setfirstCall] = useState(true);
  const [selectCategory, setSelectCategory] = useState([]);
  const [selectLanguage, setSelectLanguage] = useState('ENGLISH');
  const [isReels, setIsReels] = useState(user?.language === null ? false : true);
  const [loading, setLoading] = useState(false);
  const [showCollectionScalitonLoader, setshowCollectionScalitonLoader] = useState(true);
  const language = ReelCategory[0]?.language;
  const category = ReelCategory[0]?.categories;

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const refFlatList = useRef();

  useEffect(() => {
    dispatch(getReelCategory());
  }, []);

  const __isAvailable = (boxName) => {
    return selectCategory.findIndex((ele) => ele === boxName) > -1;
  }

  const __isAdded = (boxName) => {
    const oldData = [...selectCategory];

    if (__isAvailable(boxName) == false) {
      oldData.push(boxName);
    } else {
      oldData.splice(selectCategory.findIndex((ele) => ele === boxName), 1)
    }
    setSelectCategory(oldData);
  }


  let currentIndex = (props?.route?.params?.item?.currentIndex && props?.route?.params?.item?.currentIndex !== undefined) ? props?.route?.params?.item?.currentIndex : 0;
  useEffect(() => {
    const GetReels = async () => {
      dispatch(getReelsByUserID(UserId, startFrom, true)).then((newData)=>{
        settradingReelsData([...tradingReelsData, ...newData ])
      });
      await setrequesting(false);
    };
    if (firstCall) {
      setrequesting(false);
      setTimeout(() => {
        setshowCollectionScalitonLoader(false);
      }, 1000);
    }
    else {
      GetReels();
    }
  }, [startFrom]);


  const onSave = () => {
    setLoading(true);
    const data = {
      language: selectLanguage,
      reels_category: [...selectCategory]
    }

    dispatch(putUserUpdate(data)).then((response) => {
      setLoading(false);

      if (response.statusCode === 200) {
        setIsReels(true)
      } else {
        toast(response?.message)
      }

    });

  }


  const [scrollY] = useState(new Animated.Value(0));
  const [scrollInfo, setScrollInfo] = useState({ isViewable: true, index: 0 });
  const [isReelsFocused, setIsReelsFocused] = useState(false);

  const focus = useIsFocused();

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 80 };
  const onViewableItemsChanged = useRef(viewableItems => {
    const info = {
      isViewable: viewableItems.changed[0].isViewable,
      index: viewableItems.changed[0].index,
    };

    setScrollInfo(info);
  });

  const getItemLayout = (item, index) => ({
    length: windowHeight,
    offset: windowHeight * index,
    index,
  });

  const onEndReached = () => {
    setrequesting(true);
    setstartFrom(startFrom + 1);
  };

  const keyExtractor = (item, index) => {
    return `${item.id}`;
  };

  useEffect(() => {
    setIsReelsFocused(focus)
  }, [focus]);

  const renderItem = ({ item, index }) => {
    const scrollIndex = scrollInfo?.index || 0;
    const isNext = index >= scrollIndex - 1 && index <= scrollIndex + 1;
    return (
      <ReelItem
        key={item.id}
        item={item}
        isNext={isNext}
        index={index}
        visible={scrollInfo}
        isFocus={scrollIndex === index && isReelsFocused}
        isVisible={scrollIndex === index && isReelsFocused}
        navigation={props.navigation}
      />
    );
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View
        style={{
          width: windowWidth,
          height: Platform.OS === 'ios' ? windowHeight : windowHeight - 50
        }}>
        {
          !isReels ?
            <View style={{ marginTop: 10 }}>

              <Text style={[{ marginVertical: 10, color: 'white', alignSelf: 'center', fontSize: 27, fontFamily: Constants.fontFamilyBold }]} numberOfLines={1}>Select languge</Text>
              <FlatList
                horizontal={false}
                numColumns={3}
                data={language}
                renderItem={({ item, index }) => {
                  return (<View style={{ marginVertical: 5, height: "100%", flex: 1, margin: 10, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { setSelectLanguage(item?.key) }} style={[{ width: '100%', justifyContent: 'center', borderRadius: 30, backgroundColor: selectLanguage === item?.key ? '#FFFC00' : '#F4F4F4E5', paddingVertical: 2, height: 38 }]}>
                      <Text style={[{ color: 'black', alignSelf: 'center', fontSize: 16, fontFamily: Constants.fontFamilyMedium }]} numberOfLines={1}>{item?.name}</Text>
                    </TouchableOpacity>
                  </View>)
                }} />

              <Text style={[{ marginVertical: 10, color: 'white', alignSelf: 'center', fontSize: 27, fontFamily: Constants.fontFamilyBold }]} numberOfLines={1}>Select Categories</Text>
              <FlatList
                horizontal={false}
                numColumns={3}
                data={category}
                scrollEventThrottle={1}
                renderItem={({ item, index }) => {
                  return (<View style={{ marginVertical: 5, height: "100%", flex: 1, margin: 10, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { __isAdded(item?.key) }} style={[{ width: '100%', justifyContent: 'center', borderRadius: 30, backgroundColor: __isAvailable(item?.key) == true ? '#FFFC00' : '#F4F4F4E5', paddingVertical: 2, height: 38 }]}>
                      <Text style={[{ color: 'black', alignSelf: 'center', fontSize: 16, fontFamily: Constants.fontFamilyMedium }]} numberOfLines={1}>{item?.name}</Text>
                    </TouchableOpacity>
                  </View>)
                }} />

              <TouchableOpacity onPress={() => { onSave() }} style={{ marginHorizontal: 50, marginVertical: 35, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 40, backgroundColor: '#FFFC00', justifyContent: 'center', alignItems: "center", flexDirection: 'row' }}>
                <Text style={[{ fontFamily: Constants.fontFamilyBold, color: "black", fontSize: 24 }]}>Limelight</Text>
                <Image source={require('./../../Images/ic_limelight.png')} resizeMode='contain' style={{ height: 17, width: 17, marginLeft: 10 }} />
              </TouchableOpacity>

            </View>
            :
            <>
              {showCollectionScalitonLoader ?
                <View style={{ height: 150, marginTop: (windowHeight - 150), marginLeft: 10 }}>
                  <SkeletonPlaceholder backgroundColor='#777' highlightColor='#999' speed={1000}>
                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                      <SkeletonPlaceholder.Item marginLeft={5} width={40} height={40} borderRadius={20} />
                      <SkeletonPlaceholder.Item marginLeft={15}>
                        <SkeletonPlaceholder.Item width={120} height={15} borderRadius={4} />
                      </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={5}>
                      <SkeletonPlaceholder.Item marginLeft={10} width={100} height={15} borderRadius={4}></SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={5}>
                      <SkeletonPlaceholder.Item marginLeft={10} width={200} height={15} borderRadius={4}></SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder>
                </View>
                :
                <FlatList
                  pagingEnabled
                  showsVerticalScrollIndicator={false}
                  ref={refFlatList}
                  data={tradingReelsData}
                  extraData={tradingReelsData}
                  renderItem={renderItem}
                  automaticallyAdjustContentInsets={true}
                  onViewableItemsChanged={onViewableItemsChanged.current}
                  viewabilityConfig={viewabilityConfig}
                  keyExtractor={keyExtractor}
                  onEndReachedThreshold={5}
                  onEndReached={!requesting ? onEndReached : null}
                  initialNumToRender={currentIndex}
                  updateCellsBatchingPeriod={50}
                  decelerationRate={"fast"}
                  disableIntervalMomentum={false}
                  windowSize={5}
                  maxToRenderPerBatch={5}
                  removeClippedSubviews={false}
                  onContentSizeChange={() => {
                    if (firstCall && refFlatList && refFlatList.current.scrollToIndex && tradingReelsData && tradingReelsData.length) {
                      refFlatList.current.scrollToIndex({ animated: false, index: currentIndex });
                      setfirstCall(false);
                    }
                  }}
                  onScrollToIndexFailed={() => { }}
                // onScrollToIndexFailed={info => {
                //   const wait = new Promise(resolve => setTimeout(resolve, 500));
                //   wait.then(() => {
                //     refFlatList.current.scrollToIndex({ animated: false, index: currentIndex })
                //   });
                // }}
                />
              }
            </>
        }
      </View>
    </SafeAreaView >
  );
};
export default ProfileReelScreen;
