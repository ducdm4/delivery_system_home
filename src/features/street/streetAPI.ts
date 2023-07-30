import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const getStreetById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `streets/${data.id}`,
      method: 'GET',
    },
    false,
  );
  return response;
};

export const getAllStreetsFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `streets${data.query}`,
      method: 'GET',
    },
    false,
  );
  return response;
};
