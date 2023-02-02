import { Dimensions } from 'react-native'

const Constants = {
  nameStore: 'plantnmore',
  RTL: false, // default to set redux. Only use first time
  useReactotron: true,
  Language: 'English', // Arabic, English. Default to set redux. Only use first time
  fontFamilyRegular: 'Roboto-Regular',
  fontFamilyMedium: 'Roboto-Medium',
  fontFamilyBold: 'Roboto-Bold',
  fontFamilySemiBold: 'Poppins-SemiBold',

  kickOffCountry: ['in', 'il', 'am', 'ro'],

  EmitCode: {
    Toast: 'toast',
    Notification: 'notification',
    Timmer: 'timmer'

  },
  Dimension: {
    ScreenWidth(percent = 1) {
      return Dimensions.get('window').width * percent
    },
    ScreenHeight(percent = 1) {
      return Dimensions.get('window').height * percent
    }
  },

  LimitAddToCart: 100,
  ShowQuickCart: false, // show hide quick add to cart in product item
  PostImage: {
    small: 'small',
    medium: 'medium',
    medium_large: 'medium_large',
    large: 'large'
  },
  Layout: {
    card: 1,
    twoColumn: 2,
    simple: 3,
    list: 4,
    advance: 5,
    threeColumn: 6,
    horizon: 7,
    twoColumnHigh: 8,
    miniBanner: 9
  },
  pagingLimit: 10,

  fontText: {
    size: 16
  },

  // Export font size
  sizes: {
    base: 14,
    h1: 30,
    h2: 24,
    h3: 20,
    h4: 16,
    h5: 14,
    h6: 12
  },

  // Export lineheights
  lineHeights: {
    base: 20,
    h1: 43,
    h2: 33,
    h3: 28,
    h4: 23,
    h5: 20,
    h6: 17
  },

}

export default Constants
