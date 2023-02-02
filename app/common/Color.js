/** @format */

import color from "color";
import { Color } from ".";

export default {
  error: "#f44336",
  facebook: "#363A9A",
  google: "#d34836",


  textColor: '#B9B8BC',
  fieldLabelColor: '#D5D5D5',
  textColorLight: '#747474',

  main: "#fff",
  primaryDark: "#126EB3",
  primaryYellow: "#FF9633",
  textgrey: '#999999',
  grey: '#9094AF',
  primary: "#000000",
  secondary: "#1DA1F2",
  primaryLight: "#666666",
  accent: "#00A859",
  accentLight: "#FFD54F",
  lightgray: "#707070",
  lightDot: '#CCCCCC',
  stepActive: "#2AB5B3",
  stepInActive: "rgba(207, 212, 216, 0.8)",

  blackTextPrimary: "#212121",
  blackTextSecondary: "rgba(0,0,0,0.5)",
  blackTextDisable: "rgba(0,0,0,0.3)",

  lightTextPrimary: "rgba(255,255,255,1)",
  lightTextSecondary: "rgba(255,255,255,255.5)",
  lightTextDisable: "rgba(255,255,255,0.3)",

  lightDivide: "rgba(255,255,255,0.12)",
  blackDivide: "rgba(0,0,0,0.05)",

  background: "white",

  Background: "#FFFFFF",
  DirtyBackground: "#F0F0F0",
  Error: "#f96b6b",

  // Toolbar
  Toolbar: "white",
  ToolbarText: "#283747",
  ToolbarIcon: "#283747",

  ToolbarTrans: "transparent",
  ToolbarTextTrans: "black",
  ToolbarIconTrans: "black",

  TopBar: "white",
  TopBarIcon: "#283747",

  // Button
  ButtonBackground: "#00aef0",
  ButtonText: "white",
  ButtonBorder: "#bcbebb",

  // Product tabs
  TabActive: "#00BCD4",
  TabDeActive: "white",
  TabActiveText: "#333",
  TabText: "#333",
  BuyNowButton: "#00BCD4",
  OutOfStockButton: "#a44",

  ViewBorder: "#bcbebb",

  // Text
  Text: "#585858",
  TextDefault: "#585858",
  TextNormal: "#77a464",
  TextLight: "darkgray",
  TextDark: "#000000",

  // sidemenu
  get SideMenuBg() {
    // console.log(String(color(this.primary).alpha(0.5)));
    return String(color(this.primary).alpha(0.9));
  },
  SideMenuText: "#5BBA9D",
  SideMenuTextActived: "#000",
  SideMenuIcon: "white",

  // bottom tab bar
  tabbar: "rgba(255, 255, 255, 1)",
  get tabbarTint() {
    return this.primary;
  },
  tabbarColor: "#000",

  // navigation bar
  get headerTintColor() {
    return this.primary;
  },
  navigationBarColor: "#ffffff",
  navigationBarIcon: "rgba(0, 0, 0, 0.3)",
  navigationTitleColor: "rgba(0, 0, 0, 0.8)",

  // wishlist
  heartActiveWishList: "rgba(252, 31, 74, 1)",

  spin: "#333333",

  attributes: {
    black: "#333",
    red: "#DF3737",
    green: "#2AB5B3",
    blue: "#38B1E7",
    yellow: "#FDF12C",
  },
  lightGrey: "rgba(247, 248, 250, 1)",
  lightGrey1: "rgba(212, 220, 255, 1)",
  darkOrange: "rgba(255, 132, 11, 1)",
  darkYellow: "rgba(255, 164, 31, 1)",
  yellow: "#FFFC00",
  darkRed: "#8B0000",
  red: "#FF0000",
  lightgrey: "#D3D3D3",
  green: "#2AB5B3",
  blue: "#0091ea",
  lightBlue: "#9ddaff",
  placeHolderGrey: '#9B9B9B',
  blue1: "rgba(30, 165, 233, 1)",
  blue2: "rgba(3, 207, 254, 1)",
  darkGrey: "#242423",
  darkGrey2: "#171717",
  darkGrey3: "#383838"
};

