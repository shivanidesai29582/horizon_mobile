import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, Dimensions, AppState, Image, SafeAreaView, FlatList, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getTrandingReels, getReelCategory } from '../../redux/reels';
import ReelItem from './Components/ReelItem';
import { useIsFocused } from '@react-navigation/native';
import Constants from '../../common/Constants';
import { useTheme } from '../../Context';
import { putUserUpdate } from "./../../redux/userlogin";
import NoDataScreen from '../NoDataScreen';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const PlayReelScreen = (props) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const tradingReelsData = useSelector(state => state?.reels?.trading_reels);
  let user = useSelector((state) => state?.userlogin?.userInfo);
  const ReelCategory = useSelector(state => state?.reels?.reelCategory);
  const likes = useSelector(state => state?.likes?.likes);
  const [startFrom, setstartFrom] = useState(1);
  const [requesting, setrequesting] = useState(true);
  const [selectCategory, setSelectCategory] = useState([]);
  const [selectLanguage, setSelectLanguage] = useState('ENGLISH');
  const [isReels, setIsReels] = useState(user?.language === null ? false : true);
  const [loading, setLoading] = useState(false);
  const [showCollectionScalitonLoader, setshowCollectionScalitonLoader] = useState(true);
  const language = ReelCategory[0]?.language;
  const category = ReelCategory[0]?.categories;

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


  useEffect(() => {
    const GetReels = async () => {
      const FirstReel = (props?.route?.params?.item?.requestFrom === 'deepLink' && startFrom == 1) ? props?.route?.params?.item?.id : 0;
      await dispatch(getTrandingReels(startFrom, FirstReel));
      await setrequesting(false);
      setshowCollectionScalitonLoader(false);
    };
    GetReels();
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

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", nextAppState => {
  //     if (nextAppState.match(/inactive|background/)) {
  //       setIsReelsFocused(false)
  //     }
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       setIsReelsFocused(true)
  //     }
  //     appState.current = nextAppState;
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const screenHeight = Dimensions.get('screen').height;

  const refFlatList = useRef();
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

    // let itemKey = viewableItems?.viewableItems[0]?.key
    // dispatch(getLikes(itemKey));
  });

  const getItemLayout = (item, index) => ({
    length: windowHeight,
    offset: windowHeight * index,
    index,
  });

  // const onLayout = ({nativeEvent}) => {
  //   setDisplayHeight((!isIOS && nativeEvent.layout.height) || height);
  // };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View
        style={{
          width: windowWidth,
          height: Platform.OS === 'ios' ? windowHeight : windowHeight - 50,
          // paddingTop: Platform.OS === 'android' ? 25 : 0
        }}>
        {!isReels ?
          <ScrollView bounces={false} style={{ marginTop: 10 }}>

            <Text style={[{ marginVertical: 10, color: theme.textColor, alignSelf: 'center', fontSize: 27, fontFamily: Constants.fontFamilyBold }]} numberOfLines={1}>Select languge</Text>
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

            <Text style={[{ marginVertical: 10, color: theme.textColor, alignSelf: 'center', fontSize: 27, fontFamily: Constants.fontFamilyBold }]} numberOfLines={1}>Select Categories</Text>
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

            <TouchableOpacity onPress={() => { onSave() }} style={{ marginHorizontal: 80, marginVertical: 35, paddingVertical: 10, borderRadius: 40, backgroundColor: '#FFFC00', justifyContent: 'center', alignItems: "center", flexDirection: 'row' }}>
              <Text style={[{ fontFamily: Constants.fontFamilyBold, color: 'black', fontSize: 24 }]}>Limelight</Text>
              <Image source={require('./../../Images/ic_limelight.png')} resizeMode='contain' style={{ height: 17, width: 17, marginLeft: 10 }} />
            </TouchableOpacity>

          </ScrollView>
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
              (!tradingReelsData || tradingReelsData.length === 0 ?
                <NoDataScreen isVisible={(!tradingReelsData || tradingReelsData.length === 0)} message="Looks like you dont't search anything yet." />
                :
                <>
                  <FlatList
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    ref={refFlatList}
                    data={tradingReelsData}
                    renderItem={renderItem}
                    automaticallyAdjustContentInsets={true}
                    onViewableItemsChanged={onViewableItemsChanged.current}
                    viewabilityConfig={viewabilityConfig}
                    keyExtractor={keyExtractor}
                    onEndReachedThreshold={5}
                    onEndReached={!requesting ? onEndReached : null}
                    initialNumToRender={10}
                    updateCellsBatchingPeriod={50}
                    decelerationRate={"fast"}
                    disableIntervalMomentum={false}
                    windowSize={5}
                    maxToRenderPerBatch={5}
                    removeClippedSubviews={false}
                  />
                </>
              )
            }
          </>
        }
      </View>
    </SafeAreaView>
  );
};
export default PlayReelScreen;
