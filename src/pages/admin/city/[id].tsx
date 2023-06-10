import { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import {
  ArrowLeftIcon,
  BackspaceIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';
import {
  cityLoading,
  createNewCity,
  getCityInfo,
  editCityInfo,
} from '../../../features/city/citySlice';
import { KeyValue } from '../../../common/config/interfaces';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';

const DetailCity: NextPage = () => {
  const [inputsInitialState, setInputsInitialState] = useState({
    name: '',
    slug: '',
  });
  const [inputs, setInputs] = useState(inputsInitialState);
  const [inputsError, setInputErrors] = useState({ name: '' });
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loadingStatus = useAppSelector(cityLoading);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => {
      return { ...values, [name]: value };
    });
  }

  function handleSubmit() {
    if (validate()) {
      try {
        const res = dispatch(
          isEdit ? editCityInfo(inputs) : createNewCity(inputs),
        ).unwrap();
        res.then(async (data: KeyValue) => {
          if (data.isSuccess) {
            toast(`City ${isEdit ? 'edited' : 'added'} successfully`, {
              hideProgressBar: true,
              autoClose: 2000,
              type: 'success',
            });
            await router.push('/admin/city');
          }
        });
      } catch (e) {}
    }
  }

  function validate() {
    let isValid = true;
    if (!inputs.name) {
      isValid = false;
      setInputErrors((values) => ({
        ...values,
        name: 'City name can not be empty',
      }));
    } else {
      setInputErrors((values) => ({ ...values, name: '' }));
    }
    return isValid;
  }

  function resetInput() {
    setInputs(inputsInitialState);
  }

  useEffect(() => {
    const cityId = router.query.id;
    if (cityId && cityId !== 'add') {
      const cityIdNum = parseInt(cityId as string);
      if (!isNaN(cityIdNum)) {
        setIsEdit(true);
        const response = dispatch(getCityInfo({ id: cityIdNum })).unwrap();
        response.then((resData) => {
          if (resData.isSuccess) {
            setInputs(resData.data.city);
            setInputsInitialState(resData.data.city);
          }
        });
      }
    }
  }, [router.query]);

  async function goToList() {
    await router.push(`/admin/city`);
  }

  const header = () => {
    return (
      <div className="rounded-none p-4">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <p className={'text-xl font-bold'}>
              {isEdit ? `Edit City` : `Add City`}
            </p>
            <p className={'text-sm'}>
              {isEdit ? `Edit a city information` : `Add a new City`}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              className="flex items-center gap-3"
              severity="success"
              size="small"
              onClick={handleSubmit}
            >
              <PlusCircleIcon strokeWidth={2} className="h-4 w-4" />
              Submit
            </Button>
            <Button
              className="flex items-center gap-3"
              color="yellow"
              onClick={resetInput}
              severity="warning"
              outlined
              size="small"
            >
              <BackspaceIcon strokeWidth={2} className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              className="flex items-center gap-3"
              color="blue"
              size="small"
              severity="info"
              onClick={goToList}
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Back to list
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>City management</title>
      </Head>
      {loadingStatus === 'loading' && (
        <ProgressSpinner className="h-12 w-12 absolute top-[100px] left-[calc(50%-50px)] z-20" />
      )}
      {loadingStatus === 'idle' && (
        <Card header={header} className="mx-auto my-5">
          <div>
            <div className={'flex-row flex gap-8'}>
              <div className={'basis-1/2'}>
                <span className="p-float-label">
                  <InputText
                    id="cityname"
                    name="name"
                    value={inputs.name}
                    onChange={handleChange}
                    className={
                      (inputsError.name !== '' ? 'p-invalid' : '') +
                      ' w-full p-inputtext-sm'
                    }
                  />
                  <label htmlFor="cityname">City name</label>
                </span>
                <p className={'text-xs mt-1 text-red-300'}>
                  {inputsError.name}
                </p>
              </div>
              <div className={'basis-1/2'}>
                <span className="p-float-label">
                  <InputText
                    id="slug"
                    name="slug"
                    value={inputs.slug}
                    onChange={handleChange}
                    className={'w-full p-inputtext-sm'}
                  />
                  <label htmlFor="slug">Search name</label>
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default DetailCity;
