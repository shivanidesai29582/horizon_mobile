import React, { useEffect } from 'react';
import ProfileComponent from './Authentication/ProfileComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getByUserId } from './../redux/userlogin';

const UserProfile = (props) => {
    const dispatch = useDispatch();
    let userData = props?.route?.params?.item?.id ? useSelector((state) => state?.userlogin?.userProfileInfo) : [];
    useEffect(() => {
        props?.route?.params?.item?.id ? dispatch(getByUserId({ id: props?.route?.params?.item?.id })).then(() => { setLoading(false) }) : toast("User not found");
    }, []);
    
    return (
        <ProfileComponent user={userData} navigation={props.navigation} route={props.route} requestFrom="UserProfile" />
    );
}
export default UserProfile;