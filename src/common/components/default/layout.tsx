import React, { PropsWithChildren, useLayoutEffect } from 'react';
import { useAppDispatch } from '../../hooks';
import HeaderForUser from './headerForUser';
import Footer from './footer';
import { getAllConfigInfo } from '../../../features/config/configSlice';
import ChatDialog from '../chat/ChatDialog';

export default function Layout({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();

  if (typeof window !== 'undefined') {
    useLayoutEffect(() => {
      const getConfig = dispatch(getAllConfigInfo()).unwrap();
      getConfig.then();
    }, []);
  }

  const header = () => {
    return <HeaderForUser />;
  };

  return (
    <>
      <main className={'bg-gray-100'}>
        {header()}
        <div className={'flex '}>
          <div
            className={
              'mt-[5rem] mb-8 lg:w-[1440px] relative lg:min-h-[calc(100vh-176px)] min-h-[calc(100vh-192px)] m-auto'
            }
          >
            {children}
          </div>
        </div>
        <Footer />
        <ChatDialog />
      </main>
    </>
  );
}
