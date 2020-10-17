import * as t from 'io-ts';
import { decodeJsonAPIArrayResponse } from '@/api/JsonAPIArrayResponse';
import { History } from '@/api/histories/History';
import { OffsetPagination } from '@/api/OffsetPagination';

const ListMeta = t.type({
  page: OffsetPagination,
});

export async function getHistoryList({
  condition = '',
  tagId = '',
  filterId = '',
  page = 1,
  per = 20
}: {
  condition?: string;
  tagId?: string;
  filterId?: string;
  page?: number;
  per?: number;
}) {
  const response = await fetch(`http://localhost:4000/histories?condition=${condition}&tag_id=${tagId}&filter_id=${filterId}&page=${page}&per=${per}`, {
    mode: 'cors',
    credentials: 'include',
  });
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: History, meta: ListMeta });
};
