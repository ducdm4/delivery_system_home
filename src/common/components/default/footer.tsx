import React from 'react';

export default function Footer() {
  return (
    <div
      className={
        'lg:h-[4rem] !px-[calc((100vw-1400px)/2)] bg-gray-800 text-white flex items-center'
      }
    >
      <p className={'text-sm'}>
        Copyright DucDM. This website is for learning purpose only. Contact info
        ducdm03016.dev@gmail.com
      </p>
    </div>
  );
}
