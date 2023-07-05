import { NextPage } from 'next';
import UserInfo from '../../../common/components/profile/userInfo';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import {
  getLoggedInProfile,
  updateSelfProfile,
  userLoading,
  userLoggedInDetail,
} from '../../../features/user/userSlice';
import { toast } from 'react-toastify';
import PasswordInfo from '../../../common/components/profile/passwordInfo';
import {
  createNewPhoto,
  getPhotoInfo,
} from '../../../features/photo/photoSlice';
import { imageType } from '../../../common/config/constant';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import Head from 'next/head';
import { KeyValue } from '../../../common/config/interfaces';
import { format } from 'date-fns';
import { Card } from 'primereact/card';

interface keyStringAny {
  [key: string]: any;
}

const Profile: NextPage = () => {
  const [showPopupPassword, setShowPopupPassword] = useState(false);
  const dispatch = useAppDispatch();
  const userLoadingStatus = useAppSelector(userLoading);
  const userDetail = useAppSelector(userLoggedInDetail);

  const keyStringAnyObj: KeyValue = {};

  const [inputs, setInputs] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: true,
    phone: '',
    profilePicture: {
      id: null,
    },
    address: {
      building: '',
      detail: '',
      street: keyStringAnyObj,
      ward: keyStringAnyObj,
      district: keyStringAnyObj,
      city: keyStringAnyObj,
    },
  });
  const [inputsError, setInputErrors] = useState({
    image: '',
  });

  function prepareAddress(address: keyStringAny, key: string, key2 = '') {
    if (!address[key]) {
      return keyStringAnyObj;
    } else {
      const res: keyStringAny = {
        id: address[key].id,
        name: address[key].name,
      };
      if (key2) res[`${key2}Id`] = address[key2].id;
      return res;
    }
  }

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await dispatch(getLoggedInProfile()).unwrap();
        if (res.isSuccess) {
          const data = res.data.userInfo;
          const user = {
            ...inputs,
            ...data,
          };
          if (user.dob) {
            user.dob = new Date(user.dob);
          }
          let address = JSON.parse(JSON.stringify(user.address));
          if (!address) {
            address = inputs.address;
          } else {
            address.city = prepareAddress(address, 'city');
            address.district = prepareAddress(address, 'district', 'city');
            address.ward = prepareAddress(address, 'ward', 'district');
            address.street = prepareAddress(address, 'street', 'ward');
          }
          user.address = address;
          setInputs(user);
          if (user.profilePicture && user.profilePicture.id) {
            const resPhoto = await dispatch(
              getPhotoInfo({ id: user.profilePicture.id }),
            ).unwrap();
            if (resPhoto.isSuccess) {
              const img = document.getElementById('img-profile');
              if (img) {
                img.setAttribute('src', URL.createObjectURL(resPhoto.data));
              }
            }
          }
        }
      } catch (e) {}
    };
    getUserProfile();
  }, []);

  function setErrorByValue(key: string, val: any) {
    setInputErrors((values) => {
      return { ...values, [key]: val };
    });
  }

  async function handleSubmit() {
    const input: HTMLInputElement = document.getElementById(
      'file-upload',
    ) as HTMLInputElement;
    let profilePictureObj = Object.assign({}, inputs.profilePicture);
    if (input.files && input.files[0]) {
      const resPhoto = await handleUploadImage(input.files[0]);
      if (resPhoto) {
        profilePictureObj = { id: resPhoto.data.photoInfo.id };
        setInputs((values) => {
          return {
            ...values,
            profilePicture: { id: resPhoto.data.photoInfo.id },
          };
        });
      }
    }
    const sendAddressData = {
      ...inputs.address,
      cityId: inputs.address.city.id || null,
      districtId: inputs.address.district.id || null,
      wardId: inputs.address.ward.id || null,
      streetId: inputs.address.street.id || null,
    };
    let dob = '';
    if (inputs.dob) {
      dob = format(new Date(inputs.dob), 'yyyy-MM-dd');
    }
    const res = dispatch(
      updateSelfProfile({
        ...inputs,
        profilePicture: profilePictureObj,
        address: sendAddressData,
        dob,
      }),
    ).unwrap();
    res.then((data) => {
      if (data.isSuccess) {
        toast(`Update profile successfully`, {
          hideProgressBar: true,
          autoClose: 2000,
          type: 'success',
        });
      }
    });
  }

  async function handleUploadImage(image: File) {
    if (validateFile(image)) {
      const formData = new FormData();
      formData.append('image', image as Blob);
      return await dispatch(createNewPhoto(formData)).unwrap();
    }
  }

  function validateFile(image: File) {
    let check = true;
    if (image.size > 2048000) {
      setErrorByValue('image', 'Image must smaller than 2mb');
      check = false;
    } else if (imageType.findIndex((x) => x === image.type) < 0) {
      setErrorByValue('image', 'Please select an image');
      check = false;
    } else {
      setErrorByValue('image', '');
    }
    return check;
  }

  function header() {
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
              severity="info"
              size="small"
              onClick={() => setShowPopupPassword(true)}
            >
              <i className="pi pi-cog" style={{ fontSize: '1rem' }}></i>
              Change Password
            </Button>
            <Button
              className="flex items-center gap-3"
              severity="success"
              size="small"
              onClick={handleSubmit}
            >
              {userLoadingStatus === 'loading' ? (
                <ProgressSpinner
                  style={{ width: '22px', height: '22px' }}
                  strokeWidth="8"
                  animationDuration="2s"
                />
              ) : (
                <>
                  <PaperAirplaneIcon strokeWidth={2} className="h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Card header={header} className="mx-auto my-5">
        <UserInfo
          inputs={inputs}
          inputsError={inputsError}
          setInputs={setInputs}
          isShowProfilePicture={true}
        />
      </Card>
      <PasswordInfo
        showPopupPassword={showPopupPassword}
        setShowPopupPassword={setShowPopupPassword}
      />
    </>
  );
};

export default Profile;
