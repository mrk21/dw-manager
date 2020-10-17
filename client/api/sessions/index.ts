import { User } from '@/api/sessions/User';
import { decodeJsonAPIResponse } from '@/api/JsonAPIResponse';

export async function signIn({ email, password }: { email: string, password: string }) {
  const formData = new FormData();
  formData.append('auth[email]', email);
  formData.append('auth[password]', password);
  const response = await fetch(`http://localhost:4000/session/password`, {
    method: "POST",
    body: formData,
    mode: 'cors',
    credentials: 'include',
  });
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: User });
};

export async function signOut() {
  await fetch(`http://localhost:4000/session`, {
    method: "DELETE",
    mode: 'cors',
    credentials: 'include',
  });
  return null;
};

export async function getMe() {
  const response = await fetch(`http://localhost:4000/session`, {
    mode: 'cors',
    credentials: 'include',
  });
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: User });
}
