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
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const router = useRouter();

  if (typeof window !== 'undefined') {
    useLayoutEffect(() => {
      if (router.pathname.split('/').indexOf('login') === -1) {
        const verifyUser = async () => {
          const token = localStorage.getItem(
            process.env.NEXT_PUBLIC_API_KEY || 'DSAccessToken',
          );
          if (token && !userInfo.id) {
            try {
              const verify = await dispatch(verifyUserLogin()).unwrap();
              if (verify.isSuccess) {
                setIsVerified(true);
                if (verify.data.user.profilePicture) {
                  await dispatch(
                    getUserProfilePicture({
                      id: verify.data.user.profilePicture.id,
                    }),
                  ).unwrap();
                }
              }
            } catch (e) {}
          }
        };
        checkShowHeader();
        if (isShowHeader) {
          verifyUser();
        }
      } else {
        setIsVerified(true);
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
    setIsShowHeader(router.pathname.split('/').indexOf('login') === -1);
  };

  return (
    <>
      <main className={'bg-gray-100'}>
        {isShowHeader && <Header />}
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
