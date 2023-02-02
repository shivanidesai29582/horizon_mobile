import React from 'react';
import { useSelector } from 'react-redux';
import ProfileComponent from './ProfileComponent';


const Profile = (props) => {
    const userData = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    return (
        <ProfileComponent user={userData} navigation={props.navigation} route={props.route} requestFrom="Profile" />
    );
}

export default Profile;