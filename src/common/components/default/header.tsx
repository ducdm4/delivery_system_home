import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { useRouter } from 'next/router';
import { Avatar } from 'primereact/avatar';

export default function Header() {
  const router = useRouter();

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
          separator: true,
        },
        {
          label: 'Route config',
          icon: 'pi pi-fw pi-external-link',
        },
        {
          label: 'Master config',
          icon: 'pi pi-fw pi-external-link',
        },
      ],
    },
    {
      label: 'Business',
      icon: 'pi pi-fw pi-pencil',
      items: [
        {
          label: 'Order',
          icon: 'pi pi-fw pi-align-left',
        },
        {
          label: 'Customer',
          icon: 'pi pi-fw pi-align-left',
        },
        {
          label: 'Employee',
          icon: 'pi pi-fw pi-align-right',
        },
        {
          label: 'Station',
          icon: 'pi pi-fw pi-align-right',
        },
      ],
    },
    {
      label: 'Duong Duc',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Profile',
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
    <p className={'font-bold text-xl text-green-400 pr-5'}>Delivery System</p>
  );
  const end = (
    <div className={'flex items-center '}>
      <Avatar className={'lg:!w-[3.5rem] lg:!h-[3.5rem]'} shape="circle">
        <img
          className={'object-fill'}
          src={'https://primefaces.org/cdn/primereact/images/logo.png'}
        />
      </Avatar>
    </div>
  );

  return (
    <Menubar
      className={'fixed w-[98%] left-[1%] top-4 z-10 justify-between'}
      model={items}
      start={start}
      end={end}
    />
  );
}
