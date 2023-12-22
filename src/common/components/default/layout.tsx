import React, {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  userLoggedIn,
  verifyUserLogin,
} from '../../../features/auth/authSlice';
import { useRouter } from 'next/router';
import HeaderForUser from './headerForUser';
import Head from 'next/head';
import Footer from './footer';
import { getAllConfigInfo } from '../../../features/config/configSlice';
import ChatDialog from '../chat/ChatDialog';

export default function Layout({ children }: PropsWithChildren) {
  const userInfo = useAppSelector(userLoggedIn);
  const dispatch = useAppDispatch();

  const router = useRouter();

  if (typeof window !== 'undefined') {
    useLayoutEffect(() => {
      const token = localStorage.getItem(
        process.env.NEXT_PUBLIC_API_KEY || 'DSAccessToken',
      );
      const getConfig = dispatch(getAllConfigInfo()).unwrap();
      getConfig.then();
    }, []);
  }

  const header = () => {
    return <HeaderForUser />;
  };

  return (
    <>
      <Head>
        <link
          id="theme-link"
          rel="stylesheet"
          href="/themes/lara-light-blue/theme.css"
        />
      </Head>
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
