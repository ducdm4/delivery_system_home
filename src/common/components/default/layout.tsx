import Header from './header';
import Sidebar from './sidebar';
import { PropsWithChildren, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  userLoggedIn,
  verifyUserLogin,
} from '../../../features/auth/authSlice';

export default function Layout({ children }: PropsWithChildren) {
  const userInfo = useAppSelector(userLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem(
        process.env.NEXT_PUBLIC_API_KEY || 'DSAccessToken',
      );
      if (token && !userInfo.id) {
        try {
          await dispatch(verifyUserLogin()).unwrap();
        } catch (e) {}
      }
    };
    verifyUser();
    console.log('ducdm', userInfo);
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <main>{children}</main>
    </>
  );
}
