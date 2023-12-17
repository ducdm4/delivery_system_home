import type { NextPage } from 'next';
import Head from 'next/head';

import { useRouter } from 'next/router';

const IndexPage: NextPage = () => {
  const router = useRouter();

  function addNew() {
    router.push('/new');
  }

  function goToTracking() {
    router.push('/track');
  }

  return (
    <>
      <Head>
        <title>Delivery system</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="banner-block" className={'bg-blue-100 rounded mt-4 py-24'}>
        <p
          className={
            'text-4xl uppercase font-semibold text-center text-gray-700'
          }
        >
          Welcome to Delivery System, a simple logistic system!
        </p>
        <div className="mt-16 flex items-center justify-center">
          <span className="mr-2 text-lg text-slate-500">
            You can create a new order here
          </span>
          <button
            onClick={() => addNew()}
            className="bg-green-500 text-white px-10 py-4 rounded-md shadow-md"
          >
            NEW
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <span className="mr-2 text-lg text-slate-500">
            Or track your current order here
          </span>
          <button
            onClick={() => goToTracking()}
            className="bg-blue-500 text-white px-8 py-3 ml-2 rounded-md shadow-md"
          >
            FIND!
          </button>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
