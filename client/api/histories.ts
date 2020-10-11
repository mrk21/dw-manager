import * as t from 'io-ts';
import { decodeJsonAPIArrayResponse } from '@/entities/JsonAPIArrayResponse';
import { History } from '@/entities/History';
import { OffsetPagination } from '@/entities/OffsetPagination';

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
  const response = await fetch(`http://localhost:4000/histories?condition=${condition}&tag_id=${tagId}&filter_id=${filterId}&page=${page}&per=${per}`);
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: History, meta: ListMeta });
};
