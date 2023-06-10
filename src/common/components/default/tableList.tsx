import { KeyValue, TableListRefObject } from '../../config/interfaces';
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { PER_PAGE_ITEM } from '../../config/constant';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';

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
  value: {
    id: number;
    name: string;
  };
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
      let defaultData: Array<filterItem> = [];
      if (tableConfig.filters.length) {
        defaultData = tableConfig.filters.map((filterItem) => {
          return {
            key: filterItem.key,
            value: {
              id: 0,
              name: '',
            },
          };
        });
      }
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
      filterData.forEach((filterItem) => {
        if (filterItem.value && filterItem.value.id !== 0) {
          query += `&filter[${filterItem.key}]=${filterItem.value.id}`;
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

    function handleChangeFilter(
      value: { id: number; name: string },
      index: number,
    ) {
      setFilterData((old) => {
        const res = old;
        res[index].value = value;
        return JSON.parse(JSON.stringify(res));
      });
    }

    return (
      <>
        <div className="rounded-none px-4">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="">
              <span className="p-input-icon-left w-80">
                <i className="pi pi-search" />
                <InputText
                  className="w-80"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search"
                />
              </span>
            </div>
            <Button
              severity="success"
              size="small"
              disabled={loadingStatus === 'loading'}
              onClick={handleSubmitSearch}
            >
              {loadingStatus === 'loading' ? (
                <ProgressSpinner strokeWidth="8" animationDuration="2s" />
              ) : (
                'Submit'
              )}
            </Button>
            <Button
              disabled={loadingStatus === 'loading'}
              onClick={handleReset}
              size="small"
              severity="secondary"
            >
              {loadingStatus === 'loading' ? (
                <ProgressSpinner strokeWidth="8" animationDuration="2s" />
              ) : (
                'Reset'
              )}
            </Button>
          </div>
          <div className={'flex-row flex gap-8 mt-5'}>
            {tableConfig.filters.map((filterItem, index) => (
              <div key={`${filterItem.key}-div`} className={'basis-1/4'}>
                <Dropdown
                  value={filterData[index].value}
                  onChange={(e) => handleChangeFilter(e.value, index)}
                  options={filterItem.data}
                  optionLabel="name"
                  className={'w-full p-inputtext-sm'}
                  placeholder={filterItem.label}
                  name={filterItem.key}
                  key={`${filterItem.key}-sel`}
                  showClear
                />
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-scroll p-0 relative min-h-0">
          {loadingStatus === 'loading' && (
            <ProgressSpinner strokeWidth="8" animationDuration="2s" />
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
                      <p
                        color="blue-gray"
                        className="flex text-sm items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {headerItem.label}{' '}
                        {headerItem.isSort &&
                          checkUpDownIcon(headerItem.key) === 0 && (
                            <i className="pi pi-sort-alt"></i>
                          )}
                        {headerItem.isSort &&
                          checkUpDownIcon(headerItem.key) === 1 && (
                            <i className="pi pi-sort-alpha-down"></i>
                          )}
                        {headerItem.isSort &&
                          checkUpDownIcon(headerItem.key) === -1 && (
                            <i className="pi pi-sort-alpha-up"></i>
                          )}
                      </p>
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
        </div>
        {tableData.length > 0 && (
          <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <p className="text-sm">
              Page {pagingInfo.currentPage} of {pagingInfo.totalPage}
            </p>
            <div className="flex gap-2">
              <Button
                disabled={
                  pagingInfo.currentPage === 1 || loadingStatus === 'loading'
                }
                text
                raised
                severity="info"
                size="small"
                onClick={() => handleChangePage('desc')}
              >
                Previous
              </Button>
              <Button
                disabled={
                  pagingInfo.currentPage === pagingInfo.totalPage ||
                  loadingStatus === 'loading'
                }
                text
                raised
                severity="info"
                size="small"
                onClick={() => handleChangePage('asc')}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </>
    );
  },
);

export default TableList;
