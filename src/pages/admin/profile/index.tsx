import { NextPage } from 'next';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import {
  getLoggedInProfile,
  userLoggedInDetail,
} from '../../../features/user/userSlice';
import { Button } from 'primereact/button';
import {
  ArrowLeftIcon,
  BackspaceIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';

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

  return (
    <div className="rounded-none p-4">
      <div className="mb-8 flex items-center justify-between gap-8">
        <div>
          <p className={'text-xl font-bold'}>Profile</p>
          <p className={'text-sm'}>Update your profile</p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            className="flex items-center gap-3"
            severity="success"
            size="small"
          >
            <PlusCircleIcon strokeWidth={2} className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
