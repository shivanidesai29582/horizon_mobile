import { Color } from "../common";

export const defaultTheme = {
  backgroundColor: '#fff',
  textColor: '#000000',
  descriptiontextColor: '#777',
  textReverseColor: '#fff',
  textColor1: '#202124',
  deletetextColor: '#FF3300',
  toggleActiveButtonColor: '#1DA1F2',
  trackActiveColor: '#000000',
  toggleDisableButtonColor: '#ACACAC',
  trackDisableColor: '#7C7C7C',

  bottomNav: {
    backgroundColor: '#202124',
    active: '#000000',
    inActive: '#000000',
  },
  modalBackgroundColor: '#fff',
  tabBarBackgroundColor: '#B9B8BC',
  activeIcon: '#000000',
  themeMode: 'default',
  borderColor: Color.primary,
  homeFlatListItemColor: "#F5F5F5"
};

export const darkTheme = {
  backgroundColor: Color.primary,
  textColor: '#fff',
  descriptiontextColor: '#AAA',
  textReverseColor: '#000000',
  deletetextColor: '#FF3300',
  toggleActiveButtonColor: '#1DA1F2',
  trackActiveColor: '#ffffff',
  toggleDisableButtonColor: '#ACACAC',
  trackDisableColor: '#7C7C7C',
  bottomNav: {
    backgroundColor: '#c489bc',
    active: '#fff',
    inActive: '#fff',
  },
  modalBackgroundColor: '#262626',
  tabBarBackgroundColor: '#262626',
  activeIcon: '#fff',
  themeMode: 'dark',
  borderColor: '#fff',
  homeFlatListItemColor: "#141414"

};

export const greyTheme = {
  backgroundColor: '#7f7f7f',
  textColor: '#fff',
  descriptiontextColor: '#fff',
  textReverseColor: '#fff',
  textColor1: '#202124',
  deletetextColor: '#FF3300',
  bottomNav: {
    backgroundColor: '#202124',
    active: '#fff',
    inActive: '#fff',
  },
  modalBackgroundColor: '#7f7f7f',
  tabBarBackgroundColor: '#B9B8BC',
  activeIcon: '#000000',
  themeMode: 'grey',
  borderColor: Color.primary,
  homeFlatListItemColor: "#F5F5F5"
};