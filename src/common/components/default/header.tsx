import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { useRouter } from 'next/router';
import { Avatar } from 'primereact/avatar';
import { useAppSelector } from '../../hooks';
import { userLoggedIn } from '../../../features/auth/authSlice';
import { profileImageState } from '../../../features/photo/photoSlice';

export default function Header() {
  const router = useRouter();
  const userInfo = useAppSelector(userLoggedIn);
  const userProfileImage = useAppSelector(profileImageState);

  const items = [
    {
      label: 'Master Data',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'City',
          command: () => {
            router.push('/admin/city');
          },
        },
        {
          label: 'District',
          command: () => {
            router.push('/admin/district');
          },
        },
        {
          label: 'Ward',
          command: () => {
            router.push('/admin/ward');
          },
        },
        {
          label: 'Street',
          command: () => {
            router.push('/admin/street');
          },
        },
        {
          separator: true,
        },
        {
          label: 'Route config',
        },
        {
          label: 'Master config',
        },
      ],
    },
    {
      label: 'Business',
      icon: 'pi pi-fw pi-truck',
      items: [
        {
          label: 'Order',
          icon: 'pi pi-fw pi-file',
        },
        {
          label: 'Customer',
          icon: 'pi pi-fw pi-users',
        },
        {
          label: 'Employee',
          icon: 'pi pi-fw pi-user',
          command: () => {
            router.push('/admin/employee');
          },
        },
        {
          label: 'Station',
          icon: 'pi pi-fw pi-building',
          command: () => {
            router.push('/admin/station');
          },
        },
      ],
    },
    {
      label: `${userInfo.firstName} ${userInfo.lastName}`,
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Profile',
          command: () => {
            router.push('/admin/profile');
          },
        },
        {
          label: 'Notifications',
        },
        {
          label: 'Logout',
        },
      ],
    },
  ];

  const start = (
    <p className={'font-bold text-xl text-gray-700 pr-5'}>Delivery System</p>
  );
  const end = (
    <div className={'flex items-center '}>
      <Avatar className={'lg:!w-[3.5rem] lg:!h-[3.5rem]'} shape="circle">
        <img className={'object-cover'} src={userProfileImage} />
      </Avatar>
    </div>
  );

  return (
    <Menubar
      className={
        'fixed lg:w-full left-0 !px-[calc((100vw-1400px)/2)] z-10 justify-between !rounded-none !border-none'
      }
      model={items}
      start={start}
      end={end}
    />
  );
}
