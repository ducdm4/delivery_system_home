import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const getCityById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `cities/${data.id}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const getAllCitiesFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `cities${data.query}`,
      method: 'GET',
    },
    false,
  );
  return response;
};
