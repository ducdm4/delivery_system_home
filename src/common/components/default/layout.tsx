import Header from './header';
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
import { getUserProfilePicture } from '../../../features/photo/photoSlice';

export default function Layout({ children }: PropsWithChildren) {
  const userInfo = useAppSelector(userLoggedIn);
  const dispatch = useAppDispatch();
  const [isShowHeader, setIsShowHeader] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const router = useRouter();
  const isAdminPage = router.pathname.split('/').indexOf('admin') > -1;

  if (typeof window !== 'undefined') {
    useLayoutEffect(() => {
      if (isAdminPage) {
        if (router.pathname.split('/').indexOf('login') === -1) {
          const token = localStorage.getItem(
            process.env.NEXT_PUBLIC_API_KEY || 'DSAccessToken',
          );
          if (token && !userInfo.id) {
            const verify = dispatch(verifyUserLogin()).unwrap();
            verify.then((res) => {
              if (res.isSuccess) {
                setIsVerified(true);
                if (res.data.user.profilePicture) {
                  const getUserProfileImage = dispatch(
                    getUserProfilePicture({
                      id: res.data.user.profilePicture.id,
                    }),
                  ).unwrap();
                  getUserProfileImage.then();
                }
              }
            });
          } else if (!token) {
            router.push('/');
          }
        }
      }
    }, []);
  }

  useEffect(() => {
    if (router.pathname.split('/').indexOf('login') > -1) {
      setIsVerified(true);
    }
    checkShowHeader();
  }, [router.pathname]);

  const checkShowHeader = () => {
    setIsShowHeader(
      isAdminPage && router.pathname.split('/').indexOf('login') === -1,
    );
  };

  return (
    <>
      <main className={'bg-gray-100'}>
        {isVerified && isShowHeader && <Header />}
        <div className={'flex'}>
          <div
            className={
              (isShowHeader ? 'mt-[4.5rem]' : '') +
              ' lg:w-[1440px] relative min-h-[calc(100vh-74px)] m-auto'
            }
          >
            {isVerified && children}
          </div>
        </div>
      </main>
    </>
  );
}
