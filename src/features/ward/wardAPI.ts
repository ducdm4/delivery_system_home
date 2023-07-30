import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const getWardById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `wards/${data.id}`,
      method: 'GET',
    },
    false,
  );
  return response;
};

export const getAllWardsFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `wards${data.query}`,
      method: 'GET',
    },
    false,
  );
  return response;
};
