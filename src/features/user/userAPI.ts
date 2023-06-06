import { useAPI } from '../../common/hooks/useAPI';
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
