import type { NextPage } from 'next';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useAppDispatch } from '../../../common/hooks';
import { userLogin } from '../../../features/auth/authSlice';
import { useRouter } from 'next/router';
import Head from 'next/head';

const LoginPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const router = useRouter();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => {
      return { ...values, [name]: value };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO validate input
    try {
      const result = await dispatch(userLogin({ ...inputs, role: 1 })).unwrap();
      await router.push('/admin');
    } catch (e) {}
  }

  return (
    <>
      <Head>
        <title>Login Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="text-center text-3xl font-bold text-bubble-gum-600">
            DELIVERY SYSTEM
          </h1>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  name="email"
                  type="email"
                  value={inputs.email || ''}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-emerald-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={inputs.password || ''}
                  required
                  minLength={6}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-emerald-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a
              href=""
              className="font-semibold leading-6 text-emerald-600 hover:text-indigo-500"
            >
              Register now!
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
