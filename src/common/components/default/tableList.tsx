import { NextPage } from 'next';
import {
  Button,
  CardHeader,
  Typography,
  Input,
  CardBody,
} from '@material-tailwind/react';
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import { KeyValue, TableListRefObject } from '../../config/interfaces';
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Props {
  tableConfig: {
    header: Array<{ label: string; key: string; isSort?: boolean }>;
    url: string;
    filters: Array<{ key: string; label: string; data: Array<KeyValue> }>;
  };
  rowList: Function;
  getData: Function;
}

interface sortItem {
  key: string;
  value: number;
}

const TableList = forwardRef(
  ({ tableConfig, rowList, getData }: Props, ref: Ref<TableListRefObject>) => {
    const [tableData, setTableData] = useState([]);
    const [sortData, setSortData] = useState(() => {
      const defaultData: Array<sortItem> = [];
      return defaultData;
    });
    const [keyword, setKeyword] = useState('');
    useImperativeHandle(ref, () => ({ handleSearch }));

    useEffect(() => {
      const getTableData = async () => {
        await handleSearch();
      };
      getTableData();
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
      console.log('ducdm2', sortData);
    }, []);

    async function handleSort(key: string) {
      const index = sortData.findIndex((x) => x.key === key);
      await setSortData((values) => {
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
        console.log('values', values);
        return values;
      });
      await handleSearch();
      console.log('ducdm', sortData);
    }

    async function handleSearch() {
      let query = '?';
      if (keyword) {
        query += `keyword=${keyword}`;
      }
      console.log('sortData', JSON.stringify(sortData));
      sortData.forEach((sortItem) => {
        if (sortItem.value !== 0) {
          query += `&sort[${sortItem.key}]=${
            sortItem.value === 1 ? 'asc' : 'desc'
          }`;
        }
      });
      const res = await getData(query);
      setTableData(res);
    }

    function checkUpDownIcon(key: string) {
      const sortIdx = sortData.findIndex((x) => x.key === key);
      if (sortIdx > -1) {
        return sortData[sortIdx].value;
      }
      return 0;
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
            <Button onClick={handleSearch} variant="outlined">
              Submit
            </Button>
            <Button variant="filled">Reset</Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
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
                          <ChevronUpIcon strokeWidth={2} className="h-4 w-6" />
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
            <tbody>{rowList(tableData)}</tbody>
          </table>
        </CardBody>
      </>
    );
  },
);

export default TableList;
