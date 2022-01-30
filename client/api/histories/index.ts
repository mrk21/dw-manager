import * as t from 'io-ts';
import { decodeJsonAPIArrayResponse } from '@/api/JsonAPIArrayResponse';
import { History } from '@/api/histories/History';
import { HistoryReport } from '@/api/histories/HistoryReport';
import { OffsetPagination } from '@/api/OffsetPagination';
import { fetchAPI } from '../fetch';

const ListMeta = t.type({
  page: OffsetPagination,
});

export async function getHistoryList({
  condition = '',
  page = 1,
  per = 20
}: {
  condition?: string;
  page?: number;
  per?: number;
}) {
  const response = await fetchAPI(`/histories?condition=${condition}&page=${page}&per=${per}`);
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: History, meta: ListMeta });
};

export async function getHistoryReport({ condition = '' }: { condition?: string; }) {
  const response = await fetchAPI(`/histories/report?condition=${condition}`);
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: HistoryReport, meta: t.undefined });
};
