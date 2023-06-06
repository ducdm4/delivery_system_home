import type { NextPage } from 'next';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useAppDispatch } from '../../../common/hooks';
import { userLogin } from '../../../features/auth/authSlice';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, Input } from '@material-tailwind/react';
import { ValidateEmail } from '../../../common/functions';

const LoginPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
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
    if (validate()) {
      try {
        const result = await dispatch(
          userLogin({ ...inputs, role: 1 }),
        ).unwrap();
        if (result.isSuccess) {
          await router.push('/admin');
        }
      } catch (e) {}
    }
  }

  function validate() {
    let isValid = true;
    if (!inputs.email) {
      setErrors((values) => {
        return { ...values, email: 'Email cannot be empty' };
      });
      isValid = false;
    } else if (!ValidateEmail(inputs.email)) {
      setErrors((values) => {
        return { ...values, email: 'Wrong email format' };
      });
      isValid = false;
    } else {
      setErrors((values) => {
        return { ...values, email: '' };
      });
    }

    if (!inputs.password) {
      setErrors((values) => {
        return { ...values, password: 'Password cannot be empty' };
      });
      isValid = false;
    } else if (inputs.password.length < 6) {
      setErrors((values) => {
        return {
          ...values,
          password: 'Password must have at least 6 characters',
        };
      });
      isValid = false;
    } else {
      setErrors((values) => {
        return { ...values, password: '' };
      });
    }
    return isValid;
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
              <div className="mt-2">
                <Input
                  type="text"
                  name="email"
                  label="Email"
                  error={errors.email !== ''}
                  value={inputs.email || ''}
                  onChange={handleChange}
                />
                <p className={'text-red-300 mt-0.5 ml-1 text-sm'}>
                  {errors.email}
                </p>
              </div>
            </div>

            <div>
              <div className="mt-2">
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  error={errors.password !== ''}
                  value={inputs.password || ''}
                  onChange={handleChange}
                />
                <p className={'text-red-300 mt-0.5 ml-1 text-sm'}>
                  {errors.password}
                </p>
              </div>
            </div>

            <div>
              <Button className={'w-full'} type="submit" color="green">
                Sign in
              </Button>
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
