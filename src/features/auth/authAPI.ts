import { LoginData } from '../../common/config/interfaces';
import { useAPI } from '../../common/hooks/useAPI';

export async function login(userInfo: LoginData) {
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

export async function verifyUser() {
  const response = await useAPI(
    {
      url: `auth/verify`,
      method: 'POST',
    },
    true,
  );
  return response;
}

export async function getSelfProfile() {
  const response = await useAPI(
    {
      url: `users/self`,
      method: 'GET',
    },
    true,
  );
  return response;
}
