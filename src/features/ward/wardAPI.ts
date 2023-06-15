import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const addNewWard = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: 'wards',
      method: 'POST',
      data,
    },
    true,
  );
  return response;
};

export const getWardById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `wards/${data.id}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const editWardById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `wards/${data.id}`,
      method: 'PUT',
      data,
    },
    true,
  );
  return response;
};

export const getAllWardsFilter = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `wards${data.query}`,
      method: 'GET',
    },
    true,
  );
  return response;
};

export const deleteWardById = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `wards/${data.id}`,
      method: 'DELETE',
    },
    true,
  );
  return response;
};
