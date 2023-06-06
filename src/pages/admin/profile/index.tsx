import { NextPage } from 'next';
import { Card, CardBody, Input } from '@material-tailwind/react';
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

  return (
    <>
      <Card className={'mt-6 mx-5'}>
        <CardBody>
          <h1 className={'text-center text-3xl font-bold mb-10'}>Profile</h1>
          <Input
            variant="static"
            label="Email"
            value={inputs.email}
            onChange={handleChange}
            name="email"
            placeholder="Email"
          />
          <div className="grid gap-4 grid-cols-2 mt-8">
            <Input
              variant="static"
              label="First name"
              value={inputs.firstName}
              onChange={handleChange}
              name="firstName"
              placeholder="First name"
            />
            <Input
              variant="static"
              label="Last name"
              value={inputs.lastName}
              onChange={handleChange}
              name="lastName"
              placeholder="Last name"
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Profile;
