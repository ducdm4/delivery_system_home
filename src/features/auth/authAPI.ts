import { APIResponse, LoginData } from '../../common/config/interfaces';
import { useAPI } from '../../common/hooks/useAPI';

export async function login(userInfo: LoginData): Promise<APIResponse> {
  const response = await useAPI(
    {
      url: `auth/login`,
      data: userInfo,
      method: 'POST',
    },
    false,
  );
  return response;
}

export async function verifyUser(): Promise<APIResponse> {
  const response = await useAPI(
    {
      url: `auth/verify`,
      method: 'POST',
    },
    true,
  );
  return response;
}
