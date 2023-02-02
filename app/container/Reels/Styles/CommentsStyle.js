import { StyleSheet, Platform } from "react-native";
import Color from "../../../common/Color";
import Constants from '../../../common/Constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eaeaea"
  },
  line: {
    height: 0.5,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Color.lightGrey
  },
  listContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10
  },
  marginBottom20: {
    marginBottom: 20
  },
  showListStyle: {
    width: '100%',
    backgroundColor: Color.darkGrey2
  },
  listLeftView: {
    width: '10%',
    alignItems: 'center'
  },
  listProfileImg: {
    height: 30,
    width: 30,
    borderRadius: 15
  },
  listRightView: {
    flexDirection: 'column',
    width: '85%',
    alignItems: 'flex-start',
    marginHorizontal: 10
  },
  usernameTxt: {
    fontFamily: Constants.fontFamilySemiBold,
    includeFontPadding: false,
    fontSize: 14,
    // ...Fonts.style.titleTxt,
    color: '#fff',
    width: '75%'
  },
  commentTxt: {
    fontFamily: Constants.fontFamilyRegular,
    fontSize: 14,
    color: '#fff',
  },
  timeTxt: {
    fontFamily: Constants.fontFamilyRegular,
    includeFontPadding: false,
    fontSize: 12,
    // ...Fonts.style.titleTxt,
    color: Color.grey,
    marginTop: 3
  },
  keyboardView: {
    flex: 0,
    width: '100%'
  },
  chatMainView: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primary,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5
  },
  userProfileImg: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
    marginBottom: 15,
    backgroundColor: '#000',
    position: 'absolute',
    left: 20,
    ...Platform.select({
      android: {
        bottom: 10,
      },
      ios: {
        bottom: 0,
      },
    }),

  },
  chatInputBox: {
    width: 230,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    // right: '30rem'
    // right: 10
  },
  chatInput: {
    alignSelf: 'center',
    maxHeight: Platform.OS === 'ios' ? 50 : 60,
    width: 210,
    fontFamily: Constants.fontFamilyRegular,
    color: '#fff',
    fontSize: 14,
    includeFontPadding: false,
  },

  sendBtn: {
    position: 'absolute',
    right: 18,
    height: 38,
    bottom: Platform.OS === 'ios' ? 8 : 15
  },
  sendBtnTxt: {
    fontFamily: Constants.fontFamilyRegular,
    fontSize: 14,
    color: '#fff'
  }
});
