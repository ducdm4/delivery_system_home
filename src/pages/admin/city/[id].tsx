import { NextPage } from 'next';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner,
  Typography,
} from '@material-tailwind/react';
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
          console.log('data', data);
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

  return (
    <>
      <Head>
        <title>City management</title>
      </Head>
      {loadingStatus === 'loading' && (
        <Spinner className="h-12 w-12 absolute top-[calc(50%-30px)] left-[50%] z-20" />
      )}
      {loadingStatus === 'idle' && (
        <Card className="py-10 lg:w-[calc(96%)] mx-auto my-5">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  {isEdit ? `Edit City` : `Add City`}
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  {isEdit ? `Edit a city information` : `Add a new City`}
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button
                  className="flex items-center gap-3"
                  color="green"
                  size="sm"
                  onClick={handleSubmit}
                >
                  <PlusCircleIcon strokeWidth={2} className="h-4 w-4" />
                  Submit
                </Button>
                <Button
                  className="flex items-center gap-3"
                  color="yellow"
                  onClick={resetInput}
                  size="sm"
                >
                  <BackspaceIcon strokeWidth={2} className="h-4 w-4" />
                  Reset
                </Button>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button
                  className="flex items-center gap-3"
                  color="blue"
                  size="sm"
                  onClick={goToList}
                >
                  <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Back to
                  list
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className={'flex-row flex gap-8'}>
              <div className={'basis-1/2'}>
                <Input
                  variant="static"
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                  error={inputsError.name !== ''}
                  label="City name"
                />
                <p className={'text-xs mt-1 text-red-300'}>
                  {inputsError.name}
                </p>
              </div>
              <div className={'basis-1/2'}>
                <Input
                  variant="static"
                  name="slug"
                  value={inputs.slug}
                  onChange={handleChange}
                  label="Search name"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default DetailCity;
