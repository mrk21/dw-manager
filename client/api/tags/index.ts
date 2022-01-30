import * as t from 'io-ts';
import { Tag } from '@/api/tags/Tag';
import { decodeJsonAPIArrayResponse } from '@/api/JsonAPIArrayResponse';
import { decodeJsonAPIBatchedResponse } from '@/api/JsonAPIBatchedResponse';
import { OffsetPagination } from '@/api/OffsetPagination';
import { fetchAPI } from '../fetch';

const ListMeta = t.type({
  page: OffsetPagination,
});

export async function getTagList({ page = 1, per = 20 }: { page?: number, per?: number }) {
  const response = await fetchAPI(`/tags?page=${page}&per=${per}`);
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: Tag, meta: ListMeta });
};

export async function batchGetTag(ids: string[]) {
  const response = await fetchAPI(`/tags/batched/${ids.join(',')}`);
  const json = await response.json();
  return decodeJsonAPIBatchedResponse(json, { data: Tag });
};
