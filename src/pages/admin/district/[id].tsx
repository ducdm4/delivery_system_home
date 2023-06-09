import { NextPage } from 'next';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Option,
  Spinner,
  Typography,
} from '@material-tailwind/react';
import {
  ArrowLeftIcon,
  BackspaceIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';
import {
  districtLoading,
  createNewDistrict,
  getDistrictInfo,
  editDistrictInfo,
} from '../../../features/district/districtSlice';
import { KeyValue } from '../../../common/config/interfaces';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { getCityListFilter } from '../../../features/city/citySlice';

interface CityItem {
  id: number;
  name: string;
}

const DetailDistrict: NextPage = () => {
  const [inputsInitialState, setInputsInitialState] = useState({
    name: '',
    slug: '',
    city: {
      id: '',
      name: '',
    },
  });
  const initialCityList: Array<CityItem> = [];
  const [inputs, setInputs] = useState(inputsInitialState);
  const [inputsError, setInputErrors] = useState({ name: '', city: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [cityList, setCityList] = useState(initialCityList);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loadingStatus = useAppSelector(districtLoading);

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
        const sendData = {
          ...inputs,
          city: {
            id: parseInt(inputs.city.id),
          },
        };
        const res = dispatch(
          isEdit ? editDistrictInfo(sendData) : createNewDistrict(sendData),
        ).unwrap();
        res.then(async (data: KeyValue) => {
          if (data.isSuccess) {
            toast(`District ${isEdit ? 'edited' : 'added'} successfully`, {
              hideProgressBar: true,
              autoClose: 2000,
              type: 'success',
            });
            await router.push('/admin/district');
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
        name: 'District name can not be empty',
      }));
    } else {
      setInputErrors((values) => ({ ...values, name: '' }));
    }
    if (!inputs.city) {
      isValid = false;
      setInputErrors((values) => ({
        ...values,
        city: 'Please select city',
      }));
    } else {
      setInputErrors((values) => ({ ...values, city: '' }));
    }
    return isValid;
  }

  function resetInput() {
    setInputs(inputsInitialState);
  }

  useEffect(() => {
    const districtId = router.query.id;
    if (districtId && districtId !== 'add') {
      const districtIdNum = parseInt(districtId as string);
      if (!isNaN(districtIdNum)) {
        setIsEdit(true);
        const response = dispatch(
          getDistrictInfo({ id: districtIdNum }),
        ).unwrap();
        response.then((resData) => {
          if (resData.isSuccess) {
            setInputs(resData.data.district);
            setInputsInitialState(resData.data.district);
          }
        });
      }
    }
    const getCity = dispatch(getCityListFilter({ query: '' })).unwrap();
    getCity.then((listCityData) => {
      setCityList(listCityData.data.list);
    });
  }, [router.query]);

  async function goToList() {
    await router.push(`/admin/district`);
  }

  const handleChangeCity = (val: string | undefined) => {
    if (typeof val === 'string') {
      const city = cityList.find((x: { id: number }) => x.id === parseInt(val));
      return setInputs((old) => {
        return {
          ...old,
          city: {
            id: val,
            name: city ? city.name : '',
          },
        };
      });
    }
  };

  return (
    <>
      <Head>
        <title>District management</title>
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
                  {isEdit ? `Edit District` : `Add District`}
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  {isEdit
                    ? `Edit a district information`
                    : `Add a new District`}
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
                  label="District name"
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
            <div className={'flex-row flex gap-8 mt-8'}>
              <div className={'basis-1/2'}>
                <Select
                  value={inputs.city.id}
                  onChange={(e) => handleChangeCity(e)}
                  name="city"
                  selected={(e) => inputs.city.name}
                  variant="static"
                  error={inputsError.city !== ''}
                  label="Select City"
                >
                  {cityList.map((city: { id: number; name: string }) => (
                    <Option key={city.id} value={city.id.toString()}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
                <p className={'text-xs mt-1 text-red-300'}>
                  {inputsError.city}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default DetailDistrict;
