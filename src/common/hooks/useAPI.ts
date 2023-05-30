import {
  APIInfo,
  FailedResponse,
  KeyStringValue,
  SuccessResponse,
} from '../config/interfaces';
import { toast } from 'react-toastify';
import Dict = NodeJS.Dict;

export async function useAPI(
  apiInfo: APIInfo,
  isAuthorized = true,
): Promise<KeyStringValue> {
  const baseHeader: KeyStringValue = {
    'Content-Type': 'application/json',
  };
  if (isAuthorized)
    baseHeader['Authorization'] = `Bearer ${localStorage.getItem(
      process.env.NEXT_PUBLIC_API_KEY as string,
    )}`;
  const returnData: KeyStringValue = {
    statusCode: 200,
    data: {} as KeyStringValue,
    message: '',
    isSuccess: true,
  };
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/${apiInfo.url}`,
      {
        method: apiInfo.method,
        headers: {
          ...baseHeader,
          ...apiInfo.header,
        },
        body: JSON.stringify(apiInfo.data || {}),
      },
    );
    const result = await response.json();
    console.log('ducdm5 result', result);
    console.log('ducdm5 response', response);

    if (!response.ok) {
      const res = result as FailedResponse;
      handleError(res);
      returnData.isSuccess = false;
      returnData.statusCode = res.statusCode;
      returnData.message = res.message;
    } else {
      const res = result as SuccessResponse;
      returnData.data = res.data;
    }
  } catch (e) {
    console.log('ducdm5', e);
    returnData.isSuccess = false;
    returnData.message = 'Unknown Error';
  }
  return returnData;
}

function handleError(res: FailedResponse) {
  console.log('ducdm7', res);
  if (res.statusCode === 401) {
    // TODO: Refresh token
  } else {
    toast(res.message, {
      hideProgressBar: true,
      autoClose: 2000,
      type: 'error',
    });
  }
}
