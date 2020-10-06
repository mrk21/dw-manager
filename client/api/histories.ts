import { decodeJsonAPIArrayResponse } from '@/entities/JsonAPIArrayResponse';
import { History } from '@/entities/History';
import { JsonAPIError } from '@/entities/JsonAPIError';

export async function getHistoryList() {
  const response = await fetch('http://localhost:4000/histories');
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: History, error: JsonAPIError });
};
