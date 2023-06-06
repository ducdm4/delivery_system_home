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
  deleteCityThunk,
  getCityListFilter,
} from '../../../features/city/citySlice';
import { useAppDispatch } from '../../../common/hooks';
import DialogConfirm from '../../../common/components/default/dialogConfirm';
import { toast } from 'react-toastify';

const CityList: NextPage = () => {
  const [tableConfig, setTableConfig] = useState({
    url: '/city',
    header: [
      {
        label: 'Name',
        key: 'name',
        isSort: true,
      },
      {
        label: 'Search name',
        key: 'slug',
        isSort: true,
      },
      {
        label: '',
        key: '',
      },
    ],
    filters: [
      {
        key: 'slug',
        label: 'Slug',
        data: [
          {
            id: 1,
            value: 'xxx',
          },
        ],
      },
    ],
  });
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [currentCityDelete, setCurrentCityDelete] = useState({
    id: -1,
    name: '',
  });
  const tableListElement = useRef<TableListRefObject>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function goToAdd() {
    await router.push('/admin/city/add');
  }

  async function goToEdit(id: number) {
    await router.push(`/admin/city/${id}`);
  }

  async function getData(query = '') {
    const res = await dispatch(getCityListFilter({ query })).unwrap();
    if (res.isSuccess) {
      return res.data.cities;
    } else {
      return [];
    }
  }

  function confirmDeleteCity(id: number, name: string) {
    setCurrentCityDelete({
      id,
      name,
    });
    setIsShowDeleteDialog(true);
  }
  function deleteCity() {
    const res = dispatch(
      deleteCityThunk({ id: currentCityDelete.id }),
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
        refusedDeleteCity();
      }
    });
  }

  function refusedDeleteCity() {
    setIsShowDeleteDialog(false);
    setCurrentCityDelete({
      id: -1,
      name: '',
    });
  }

  function rowList(data: Array<KeyValue>) {
    const tdClasses = 'p-4 border-b border-blue-gray-50';
    return (
      <>
        {data.map((row, index: number) => (
          <tr key={index}>
            <td className={tdClasses}>{row.name}</td>
            <td className={tdClasses}>{row.slug}</td>
            <td className={tdClasses}>
              <IconButton
                onClick={() => goToEdit(row.id)}
                color="green"
                className={'mr-4'}
              >
                <i className="fa-solid fa-pencil" />
              </IconButton>
              <IconButton
                onClick={() => confirmDeleteCity(row.id, row.name)}
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
        <title>City management</title>
      </Head>
      <div>
        <Card className="py-10 lg:w-[calc(96%)] mx-auto my-5">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  City list
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all city
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button
                  className="flex items-center gap-3"
                  color="blue"
                  onClick={goToAdd}
                  size="sm"
                >
                  <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add city
                </Button>
              </div>
            </div>
          </CardHeader>
          <TableList
            ref={tableListElement}
            tableConfig={tableConfig}
            rowList={rowList}
            getData={getData}
          />
        </Card>
      </div>

      <DialogConfirm
        isShow={isShowDeleteDialog}
        title={() => 'Delete city'}
        body={() => 'Do you want to delete this City?'}
        refusedCallback={refusedDeleteCity}
        acceptedCallback={deleteCity}
      ></DialogConfirm>
    </>
  );
};

export default CityList;
