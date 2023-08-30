import { useAPI } from '../../common/hooks/useAPI';
import { KeyValue } from '../../common/config/interfaces';

export const getAllConfig = async () => {
  const response = await useAPI(
    {
      url: `configs`,
      method: 'GET',
    },
    false,
  );
  return response;
};
