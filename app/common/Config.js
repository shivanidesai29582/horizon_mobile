/** @format */

import Icons from "./Icons";

export default {

  SpaceLayout: 5, // setting align right

  showStatusBar: true,
  // LogoImage: require("@images/logo.png"),
  //  slides : [
  //   {
  //     key: 'somethun',
  //     title: 'Title 1',
  //     text: 'Description.\nSay something cool',
  //     image: require('../images/AppIntro/1.jpg'),
  //     backgroundColor: '#59b2ab',
  //   },
  //   {
  //     key: 'somethun-dos',
  //     title: 'Title 2',
  //     text: 'Other cool stuff',
  //     image: require('../images/AppIntro/2.jpg'),
  //     backgroundColor: '#febe29',
  //   },
  //   {
  //     key: 'somethun1',
  //     title: 'Rocket guy',
  //     text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
  //     image: require('../images/AppIntro/3.jpg'),
  //     backgroundColor: '#22bcb5',
  //   }
  // ],

  slides : [
        {
            key: 'somethun',
            title: 'Quick setup, good defaults',
            text:
                'React-native-app-intro-slider is easy to setup with a small footprint and no dependencies. And it comes with good default layouts!',
            icon: 'ios-images',
            colors: ['#63E2FF', '#B066FE'],
        },
        {
            key: 'somethun1',
            title: 'Super customizable',
            text:
                'The component is also super customizable, so you can adapt it to cover your needs and wants.',
            icon: 'ios-options',
            colors: ['#A3A1FF', '#3A3897'],
        },
        {
            key: 'somethun2',
            title: 'No need to buy me beer',
            text: 'Usage is all free',
            icon: 'ios-beer',
            colors: ['#29ABE2', '#4F00BC'],
        },
    ],

menu: {
    // has child generalData
    isMultiChild: true,
    // Unlogged
    listMenuUnlogged: [
      {
        text: "Login",
        routeName: "Login",
        params: {
          isLogout: false,
        },
        icon: Icons.MaterialCommunityIcons.SignIn,
      },
    ],
    // user logged in
    listMenuLogged: [
        {
            text: "Home",
            routeName: "FreelancerHomeScreen",
            icon: Icons.MaterialCommunityIcons.Home,
        },
           {
            text: "Profile",
            routeName: "MyProjectListScreen",
            icon: Icons.MaterialCommunityIcons.Profile,
        },  

        {
            text: "Portfolio",
            routeName: "homeScreen",
            icon: Icons.MaterialCommunityIcons.portfolio,
        }, 

        {
            text: "My Projects",
            routeName: "MyProjectListScreen",
            icon: Icons.MaterialCommunityIcons.projects,
        }, 
        {
            text: "Contract List",
            routeName: "ContractList",
            icon: Icons.MaterialCommunityIcons.contract,
        }, 

        
        {
            text: "Settings",
            routeName: "settingScreen",
            icon: Icons.MaterialCommunityIcons.Setting,
        },
        {
            text: "Help",
            routeName: "homeScreen",
            icon: Icons.MaterialCommunityIcons.Help,
        },
        {
            text: "Logout",
            routeName: "homeScreen",
            icon: Icons.MaterialCommunityIcons.SignOut,
        },
    ],
    seekerlistMenuLogged: [
        {
            text: "Home",
            routeName: "homeSeekerStack",
            icon: Icons.MaterialCommunityIcons.Home,
        },
        {
            text: "Profile",
            routeName: "MyProjectListScreen",
            icon: Icons.MaterialCommunityIcons.Profile,
        },
        {
            text: "My Projects",
            routeName: "MyProjectListScreen",
            icon: Icons.MaterialCommunityIcons.projects,
        },
        {
            text: "Contract List",
            routeName: "ContractList",
            icon: Icons.MaterialCommunityIcons.contract,
        },


        {
            text: "Settings",
            routeName: "settingScreen",
            icon: Icons.MaterialCommunityIcons.Setting,
        },
        {
            text: "Help",
            routeName: "homeScreen",
            icon: Icons.MaterialCommunityIcons.Help,
        },
        {
            text: "Logout",
            routeName: "homeScreen",
            icon: Icons.MaterialCommunityIcons.SignOut,
        },
    ],
    // Default List
    listMenu: [
      {
        text: "Home",
        routeName: "homeScreen",
        icon: Icons.MaterialCommunityIcons.Home,
      },     {
            text: "Profile",
            routeName: "profileScreen",
            icon: Icons.MaterialCommunityIcons.Profile,
        },     {
            text: "Settings",
            routeName: "settingScreen",
            icon: Icons.MaterialCommunityIcons.Setting,
        },
    ],
  },
};
