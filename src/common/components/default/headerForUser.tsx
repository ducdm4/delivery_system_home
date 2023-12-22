import React, { useRef, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { useRouter } from 'next/router';

export default function HeaderForUser() {
  const router = useRouter();

  function goAnyWhere(url: string) {
    router.push(url);
  }

  const items = [
    {
      label: 'Station',
    },
    {
      label: 'Hiring',
    },
  ];

  const start = (
    <p
      onClick={() => goAnyWhere('/')}
      className={
        'pl-4 lg:pl-0 font-bold text-xl hover:cursor-pointer text-white pr-5'
      }
    >
      Delivery System
    </p>
  );

  return (
    <Menubar
      className={
        'user-header min-h-[5rem] !bg-[#59a5ec] fixed lg:w-full left-0 !px-[calc((100vw-1400px)/2)] z-10 justify-between !rounded-none !border-none'
      }
      model={[]}
      start={start}
      end={''}
      pt={{
        label: {
          className: '!text-white',
        },
        button: {
          className: 'mr-4',
        },
        menuitem: (el) => ({
          className: el?.context.active ? '!bg-[#4db542]' : undefined,
        }),
      }}
    />
  );
}
