import { NextPage } from 'next';
import UserInfo from '../../../common/components/profile/userInfo';
import EmployeeInfo from '../../../common/components/employee/employeeInfo';
import { TabMenu } from 'primereact/tabmenu';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import { userLoading } from '../../../features/user/userSlice';
import { KeyValue } from '../../../common/config/interfaces';
import Head from 'next/head';
import { Card } from 'primereact/card';

const DetailEmployee: NextPage = () => {
  const keyStringAnyObj: KeyValue = {};
  const items = [
    { label: 'Personal Info', icon: 'pi pi-fw pi-home' },
    { label: 'Work Info', icon: 'pi pi-fw pi-id-card' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
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
    role: 2,
    address: {
      building: '',
      detail: '',
      street: keyStringAnyObj,
      ward: keyStringAnyObj,
      district: keyStringAnyObj,
      city: keyStringAnyObj,
    },
  });
  const [inputErrors, setInputErrors] = useState({});
  const dispatch = useAppDispatch();
  const userLoadingStatus = useAppSelector(userLoading);

  function handleSubmit() {
    return true;
  }

  function header() {
    return (
      <>
        <div className="rounded-none p-4">
          <div className="flex items-center justify-between gap-8">
            <div>
              <p className={'text-xl font-bold'}>Employee</p>
              <p className={'text-sm'}>Update employee info</p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
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
        <TabMenu
          model={items}
          className="mx-auto"
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        />
      </>
    );
  }

  const pageToDisplay = () => {
    return !activeIndex ? (
      <UserInfo
        inputs={inputs}
        inputsError={inputErrors}
        isShowProfilePicture={false}
        setInputs={setInputs}
      />
    ) : (
      <EmployeeInfo />
    );
  };

  return (
    <>
      <Head>
        <title>Employee Profile</title>
      </Head>
      <Card header={header} className="mx-auto my-5">
        {pageToDisplay()}
      </Card>
    </>
  );
};

export default DetailEmployee;
