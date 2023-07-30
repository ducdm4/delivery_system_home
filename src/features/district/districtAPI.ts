import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const getDistrictById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `districts/${data.id}`,
      method: 'GET',
    },
    false,
  );
  return response;
};

export const getAllDistrictsFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `districts${data.query}`,
      method: 'GET',
    },
    false,
  );
  return response;
};
