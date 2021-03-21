import * as t from 'io-ts';
import { decodeJsonAPIArrayResponse } from '@/api/JsonAPIArrayResponse';
import { History } from '@/api/histories/History';
import { HistoryReport } from '@/api/histories/HistoryReport';
import { OffsetPagination } from '@/api/OffsetPagination';

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
  const response = await fetch(`http://localhost:4000/histories?condition=${condition}&page=${page}&per=${per}`, {
    mode: 'cors',
    credentials: 'include',
  });
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: History, meta: ListMeta });
};

export async function getHistoryReport({
  condition = '',
}: {
  condition?: string;
}) {
  const response = await fetch(`http://localhost:4000/histories/report?condition=${condition}`, {
    mode: 'cors',
    credentials: 'include',
  });
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: HistoryReport, meta: t.undefined });
};
