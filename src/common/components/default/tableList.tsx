import {
  Button,
  CardHeader,
  Typography,
  Input,
  CardBody,
  CardFooter,
  Spinner,
  Select,
  Option,
} from '@material-tailwind/react';
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import { KeyValue, TableListRefObject } from '../../config/interfaces';
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { PER_PAGE_ITEM } from '../../config/constant';

interface Props {
  tableConfig: {
    header: Array<{ label: string; key: string; isSort?: boolean }>;
    url: string;
    filters: Array<{ key: string; label: string; data: Array<KeyValue> }>;
  };
  rowList: Function;
  getData: Function;
  loadingStatus: string;
}

interface sortItem {
  key: string;
  value: number;
}
interface filterItem {
  key: string;
  value: string;
}

const TableList = forwardRef(
  (
    { tableConfig, rowList, getData, loadingStatus }: Props,
    ref: Ref<TableListRefObject>,
  ) => {
    const [tableData, setTableData] = useState([]);
    const [sortData, setSortData] = useState(() => {
      const defaultData: Array<sortItem> = [];
      return defaultData;
    });
    const [filterData, setFilterData] = useState(() => {
      const defaultData: Array<filterItem> = [];
      return defaultData;
    });
    const [keyword, setKeyword] = useState('');
    const [triggerGetData, setTriggerGetData] = useState(0);
    const [pagingInfo, setPagingInfo] = useState({
      currentPage: 1,
      totalPage: 0,
    });

    useImperativeHandle(ref, () => ({ handleSearch }));

    useEffect(() => {
      const sorts: Array<sortItem> = [];
      tableConfig.header.forEach((item) => {
        if (item.isSort) {
          sorts.push({
            key: item.key,
            value: 0,
          });
        }
      });
      setSortData(sorts);
      if (tableConfig.filters.length) {
        setFilterData((old) => {
          return tableConfig.filters.map((filterItem) => {
            return {
              key: filterItem.key,
              value: '',
            };
          });
        });
      }
    }, []);

    useEffect(() => {
      handleSearch();
    }, [triggerGetData]);

    function handleSubmitSearch() {
      setPagingInfo((old) => {
        return {
          ...old,
          currentPage: 1,
        };
      });
      setTriggerGetData((old) => old + 1);
    }

    async function handleSort(key: string) {
      const index = sortData.findIndex((x) => x.key === key);
      setSortData((values) => {
        switch (values[index].value) {
          case 0:
            values[index].value = 1;
            break;
          case 1:
            values[index].value = -1;
            break;
          case -1:
            values[index].value = 0;
            break;
          default:
            values[index].value = 0;
            break;
        }
        return values;
      });
      setTriggerGetData((old) => old + 1);
    }

    async function handleReset() {
      setKeyword('');
      setSortData((values) => {
        return values.map((item) => {
          item.value = 0;
          return item;
        });
      });
      setTriggerGetData((old) => old + 1);
    }

    async function handleSearch() {
      let query = `?page=${pagingInfo.currentPage}&limit=${PER_PAGE_ITEM}`;
      if (keyword) {
        query += `&keyword=${keyword}`;
      }
      sortData.forEach((sortItem) => {
        if (sortItem.value !== 0) {
          query += `&sort[${sortItem.key}]=${
            sortItem.value === 1 ? 'asc' : 'desc'
          }`;
        }
      });
      const res = await getData(query);
      setTableData(res.list);
      setPagingInfo((oldState) => {
        return {
          currentPage: res.page,
          totalPage: Math.ceil(res.total / PER_PAGE_ITEM),
        };
      });
    }

    function checkUpDownIcon(key: string) {
      const sortIdx = sortData.findIndex((x) => x.key === key);
      if (sortIdx > -1) {
        return sortData[sortIdx].value;
      }
      return 0;
    }

    function handleChangePage(type: string) {
      setPagingInfo((old) => {
        return {
          ...old,
          currentPage:
            type === 'asc' ? old.currentPage + 1 : old.currentPage - 1,
        };
      });
      setTriggerGetData((old) => old + 1);
    }

    return (
      <>
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none overflow-visible"
        >
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="w-full md:w-80">
              <Input
                label="Search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            <Button
              disabled={loadingStatus === 'loading'}
              onClick={handleSubmitSearch}
              variant="outlined"
            >
              {loadingStatus === 'loading' ? (
                <Spinner color="blue" />
              ) : (
                'Submit'
              )}
            </Button>
            <Button
              disabled={loadingStatus === 'loading'}
              onClick={handleReset}
              variant="filled"
            >
              {loadingStatus === 'loading' ? <Spinner color="blue" /> : 'Reset'}
            </Button>
          </div>
          <div className={'flex-row flex gap-8 mt-5'}>
            {tableConfig.filters.map((filterItem, index) => (
              <div className={'basis-1/4'}>
                <Select
                  value={filterData[index].value}
                  label={filterItem.label}
                >
                  <Option value={''}>Please select</Option>
                  {filterItem.data.map((data) => (
                    <Option key={data.id}>{data.name}</Option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll p-0 relative min-h-0">
          {loadingStatus === 'loading' && (
            <Spinner color="blue" className={'mx-auto h-12 w-12 my-10'} />
          )}
          {loadingStatus !== 'loading' && (
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {tableConfig.header.map((headerItem, index: number) => (
                    <th
                      key={index}
                      onClick={() => {
                        return headerItem.isSort
                          ? handleSort(headerItem.key)
                          : false;
                      }}
                      style={!headerItem.label ? { width: '15%' } : {}}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {headerItem.label}{' '}
                        {headerItem.isSort &&
                          checkUpDownIcon(headerItem.key) === 0 && (
                            <ChevronUpDownIcon
                              strokeWidth={2}
                              className="h-6 w-6"
                            />
                          )}
                        {headerItem.isSort &&
                          checkUpDownIcon(headerItem.key) === 1 && (
                            <ChevronUpIcon
                              strokeWidth={2}
                              className="h-4 w-6"
                            />
                          )}
                        {headerItem.isSort &&
                          checkUpDownIcon(headerItem.key) === -1 && (
                            <ChevronDownIcon
                              strokeWidth={2}
                              className="h-4 w-6"
                            />
                          )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.length === 0 && (
                  <tr>
                    <td
                      className={'p-4 border-b border-blue-gray-50'}
                      colSpan={tableConfig.header.length}
                    >
                      No item found!
                    </td>
                  </tr>
                )}
                {rowList(tableData)}
              </tbody>
            </table>
          )}
        </CardBody>
        {tableData.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              Page {pagingInfo.currentPage} of {pagingInfo.totalPage}
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                disabled={
                  pagingInfo.currentPage === 1 || loadingStatus === 'loading'
                }
                color="blue-gray"
                size="sm"
                onClick={() => handleChangePage('desc')}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                disabled={
                  pagingInfo.currentPage === pagingInfo.totalPage ||
                  loadingStatus === 'loading'
                }
                color="blue-gray"
                size="sm"
                onClick={() => handleChangePage('asc')}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        )}
      </>
    );
  },
);

export default TableList;
