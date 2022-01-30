import { User } from '@/api/sessions/User';
import { decodeJsonAPIResponse } from '@/api/JsonAPIResponse';
import { fetchAPI } from '../fetch';

export async function signIn({ email, password }: { email: string, password: string }) {
  const formData = new FormData();
  formData.append('auth[email]', email);
  formData.append('auth[password]', password);
  const response = await fetchAPI(`/session/password`, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: User });
};

export async function signOut() {
  await fetchAPI(`/session`, {
    method: "DELETE",
  });
  return null;
};

export async function getMe() {
  const response = await fetchAPI(`/session`);
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: User });
}
