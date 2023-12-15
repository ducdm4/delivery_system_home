import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const getQuoteAPI = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `orders/calculate`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    },
    false,
  );
  return response;
};

export const createOrderApi = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: `orders`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    },
    false,
  );
  return response;
};

export const getOrderTrackingAPI = async (data: string) => {
  const response = await useAPI(
    {
      url: `orders/tracking/${data}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
    },
    false,
  );
  return response;
};
