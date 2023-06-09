import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import TableList from '../../../common/components/default/tableList';
import {
  Button,
  Card,
  CardHeader,
  IconButton,
  Typography,
} from '@material-tailwind/react';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import {
  KeyValue,
  TableListRefObject,
} from '../../../common/config/interfaces';
import { useRouter } from 'next/router';
import {
  deleteDistrictThunk,
  getDistrictListFilter,
  districtLoading,
} from '../../../features/district/districtSlice';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import DialogConfirm from '../../../common/components/default/dialogConfirm';
import { toast } from 'react-toastify';
import { getCityListFilter } from '../../../features/city/citySlice';

const DistrictList: NextPage = () => {
  const [tableConfig, setTableConfig] = useState({
    url: '/district',
    header: [
      {
        label: 'Name',
        key: 'name',
        isSort: true,
      },
      {
        label: 'Search name',
        key: 'slug',
      },
      {
        label: 'City',
        key: 'city',
        isSort: true,
      },
      {
        label: '',
        key: '',
      },
    ],
    filters: [
      {
        key: 'city',
        label: 'City',
        data: [],
      },
    ],
  });
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [currentDistrictDelete, setCurrentDistrictDelete] = useState({
    id: -1,
    name: '',
  });
  const districtLoadingStatus = useAppSelector(districtLoading);
  const tableListElement = useRef<TableListRefObject>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function goToAdd() {
    await router.push('/admin/district/add');
  }

  async function goToEdit(id: number) {
    await router.push(`/admin/district/${id}`);
  }

  async function getData(query = '') {
    const res = await dispatch(getDistrictListFilter({ query })).unwrap();
    if (res.isSuccess) {
      return res.data;
    } else {
      return [];
    }
  }

  function confirmDeleteDistrict(id: number, name: string) {
    setCurrentDistrictDelete({
      id,
      name,
    });
    setIsShowDeleteDialog(true);
  }

  function deleteDistrict() {
    const res = dispatch(
      deleteDistrictThunk({ id: currentDistrictDelete.id }),
    ).unwrap();
    res.then((successData) => {
      if (successData.isSuccess) {
        toast(`Deleted successfully`, {
          hideProgressBar: true,
          autoClose: 2000,
          type: 'success',
        });
        if (tableListElement.current) {
          tableListElement.current.handleSearch();
        }
        refusedDeleteDistrict();
      }
    });
  }

  function refusedDeleteDistrict() {
    setIsShowDeleteDialog(false);
    setCurrentDistrictDelete({
      id: -1,
      name: '',
    });
  }

  useEffect(() => {
    const getCity = dispatch(getCityListFilter({ query: '' })).unwrap();
    getCity.then((listCityData) => {
      setTableConfig((old) => {
        const indexCity = old.filters.findIndex((x) => x.key === 'city');
        const newValue = old;
        newValue.filters[indexCity].data = listCityData.data.list;
        return newValue;
      });
    });
  }, []);

  function rowList(data: Array<KeyValue>) {
    const tdClasses = 'p-4 border-b border-blue-gray-50';
    return (
      <>
        {data.map((row, index: number) => (
          <tr key={index}>
            <td className={tdClasses}>{row.name}</td>
            <td className={tdClasses}>{row.slug}</td>
            <td className={tdClasses}>{row.cityName}</td>
            <td className={tdClasses}>
              <IconButton
                onClick={() => goToEdit(row.id)}
                color="green"
                className={'mr-4'}
              >
                <i className="fa-solid fa-pencil" />
              </IconButton>
              <IconButton
                onClick={() => confirmDeleteDistrict(row.id, row.name)}
                color="red"
              >
                <i className="fa-solid fa-trash"></i>
              </IconButton>
            </td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>District management</title>
      </Head>
      <div>
        <Card className="py-10 lg:w-[calc(96%)] mx-auto my-5">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  District list
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all district
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button
                  className="flex items-center gap-3"
                  color="blue"
                  onClick={goToAdd}
                  size="sm"
                >
                  <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add
                  district
                </Button>
              </div>
            </div>
          </CardHeader>
          <TableList
            ref={tableListElement}
            tableConfig={tableConfig}
            rowList={rowList}
            getData={getData}
            loadingStatus={districtLoadingStatus}
          />
        </Card>
      </div>

      <DialogConfirm
        isShow={isShowDeleteDialog}
        title={() => 'Delete district'}
        body={() => 'Do you want to delete this District?'}
        refusedCallback={refusedDeleteDistrict}
        acceptedCallback={deleteDistrict}
      ></DialogConfirm>
    </>
  );
};

export default DistrictList;
