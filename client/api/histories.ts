import * as t from 'io-ts';
import { decodeJsonAPIArrayResponse } from '@/entities/JsonAPIArrayResponse';
import { History } from '@/entities/History';
import { JsonAPIError } from '@/entities/JsonAPIError';
import { OffsetPagination } from '@/entities/OffsetPagination';

const ListMeta = t.type({
  page: OffsetPagination,
});

export async function getHistoryList({ page = 1, per = 20 }: { page?: number, per?: number }) {
  const response = await fetch(`http://localhost:4000/histories?page=${page}&per=${per}`);
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: History, error: JsonAPIError, meta: ListMeta });
};
