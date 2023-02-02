import React, { useRef, useEffect, useState } from 'react';
import { View, Dimensions, Image, SafeAreaView, ActivityIndicator, FlatList, Text, KeyboardAvoidingView, Keyboard, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import AutogrowInput from 'react-native-autogrow-input';
import Color from '../../common/Color';
import { styles } from './Styles/CommentsStyle';
import { getComments, postComment } from '../../redux/comments';
import { Header } from '../Components/LoginHeader';
import global from "./../../common/globals";
import { useTheme } from './../../Context';
import style from '../../Components/ModalPickerImage/style';

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const CommentsScreen = props => {
  const dispatch = useDispatch();
  const listViewRef = useRef();
  const comments = useSelector(state => state?.comments?.comments);
  const user = useSelector(state => state?.userlogin?.userInfo);
  const { reelId, postid, manageCommentCount, currentCnt } = props.route.params;
  const [inputBarText, setInputBarText] = useState('')

  useEffect(() => {
    reelId ? dispatch(getComments(reelId, 'reels')) : null
    postid ? dispatch(getComments(postid, 'posts')) : null

  }, []);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const screenHeight = Dimensions.get('screen').height;

  const renderFooter = () => {
    // const { isLoadMore } = this.state;
    const { loading } = props;
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color={Color.secondary}
        />
      );
    } else {
      return null;
    }
  };

  const profileImage = user?.profile_photo == null ? global.USER_PROFILE_URL : user?.profile_photo;
  console.log("comments", comments);
  return (
    <SafeAreaView
      style={{
        width: windowWidth,
        height: '100%',
      }}>
      <Header isShownSearch={false} title={"Comments"} onBackPress={() => {
        props.navigation.pop()
      }} colors={'white'} />
      <FlatList
        // inverted
        ref={listViewRef}
        data={comments}
        style={styles.showListStyle}
        bounces={false}
        ListFooterComponent={renderFooter()}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, idx) => `comment_${item.id}_${idx}`}
        // ItemSeparatorComponent={() => <View style={styles.line} />}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          let commenter = item.author || {};
          let dateStr = dayjs(item.created_at).fromNow(true);
          return (
            <View>
              <View
                style={[
                  styles.listContainer,
                  // index === 0 && styles.marginBottom20
                ]}>
                <View style={styles.listLeftView}>
                  <Image
                    style={styles.listProfileImg}
                    source={{ uri: commenter.profile_photo || global.USER_PROFILE_URL }}
                  />
                </View>
                <View style={styles.listRightView}>
                  <Text style={styles.usernameTxt}>
                    {commenter.username}
                  </Text>
                  <Text style={styles.commentTxt}>
                    {item.comment}
                  </Text>
                  <Text style={styles.timeTxt}>
                    {dateStr}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        onEndReachedThreshold={0.01}
        onMomentumScrollBegin={() => {
          // this.onEndReachedCalledDuringMomentum = false;
        }}
        onEndReached={() => {
          // !loading && this.loadMore();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <InputBar
          profileImg={profileImage}
          user={user}
          text={inputBarText}
          onSendPressed={() => {
            if (inputBarText.trim().length > 0) {
              let data = {
                comment: inputBarText.trim(),
                // user: userObj,
                type_id: reelId || postid
              };
              setInputBarText('');

              reelId ? dispatch(postComment(data, 'reels')) : null
              postid ? dispatch(postComment(data, 'posts')) : null

              postid ? manageCommentCount(currentCnt + 1) : null;

              listViewRef?.current?.scrollToOffset({
                offset: 0,
                animated: true
              });
            }
          }}
          onChangeText={(text) => setInputBarText(text)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const InputBar = props => {
  const { theme } = useTheme();
  const [isVisible, setKeyboardVisible] = useState(undefined);
  const autogrowInputRef = useRef();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);


  // componentWillReceiveProps = (nextProps: any) => {
  //   if (nextProps.text === '') {
  //     autogrowInput.resetInputText();
  //   }
  // };

  const {
    profileImg,
    user,
    onChangeText,
    onSendPressed,
    text,
  } = props;
  return (
    <>
      <View
        style={[
          styles.chatMainView,
          // isVisible && styles.keyBoardOpenBottomSpace,
        ]}>
        <Image source={{ uri: profileImg }} style={styles.userProfileImg} />
        <View style={styles.chatInputBox}>
          <AutogrowInput
            multiline
            style={styles.chatInput}
            ref={autogrowInputRef}
            numberOfLines={1}
            defaultHeight={Platform.OS === 'ios' ? 30 : 40}
            value={text}
            placeholder={`Comment as ${user.username}...`}
            placeholderTextColor={Color.placeHolderGrey}
            onChangeText={(val) => onChangeText(val)}
          />
        </View>
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => onSendPressed()}>
          <Image style={{ height: 25, width: 25, alignItems: 'center', justifyContent: 'center', tintColor: 'white', transform: ([{ rotateX: '0deg' }, { rotateZ: '40deg' }]) }} source={require('../../Images/send.png')} />
          {/* <Text style={styles.sendBtnTxt}>Post</Text> */}
        </TouchableOpacity>
      </View>
    </>
  );

}

export default CommentsScreen;