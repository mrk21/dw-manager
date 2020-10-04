import { decodeArrayResponse } from '@/entities/ArrayResponse';
import { History } from '@/entities/History';
import { APIError } from '@/entities/APIError';

export async function getHistoryList() {
  const response = await fetch('http://localhost:4000/histories');
  const json = await response.json();
  return decodeArrayResponse(json, { data: History, error: APIError });
};
