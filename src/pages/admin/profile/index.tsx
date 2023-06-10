import { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import {
  getLoggedInProfile,
  userLoggedInDetail,
} from '../../../features/user/userSlice';

const Profile: NextPage = () => {
  const dispatch = useAppDispatch();
  const userDetail = useAppSelector(userLoggedInDetail);
  const [inputs, setInputs] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: true,
    phone: '',
    profilePicture: {},
    address: {},
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => {
      return { ...values, [name]: value };
    });
  }

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await dispatch(getLoggedInProfile()).unwrap();
        if (res.isSuccess) {
          setInputs(res.data.userInfo);
        }
      } catch (e) {}
    };
    getUserProfile();
  }, []);

  return <></>;
};

export default Profile;
