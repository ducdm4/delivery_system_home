import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@material-tailwind/react';

import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import store from '../store';

import Layout from '../common/components/default/layout';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </Provider>
    </ThemeProvider>
  );
}
