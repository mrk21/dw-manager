import * as t from 'io-ts';
import { Tag } from '@/entities/Tag';
import { decodeJsonAPIArrayResponse } from '@/entities/JsonAPIArrayResponse';
import { decodeJsonAPIBatchedResponse } from '@/entities/JsonAPIBatchedResponse';
import { OffsetPagination } from '@/entities/OffsetPagination';

const ListMeta = t.type({
  page: OffsetPagination,
});

export async function getTagList({ page = 1, per = 20 }: { page?: number, per?: number }) {
  const response = await fetch(`http://localhost:4000/tags?page=${page}&per=${per}`);
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: Tag, meta: ListMeta });
};

export async function getTagBatched(ids: string[]) {
  const response = await fetch(`http://localhost:4000/tags/batched/${ids.join(',')}`);
  const json = await response.json();
  return decodeJsonAPIBatchedResponse(json, { data: Tag });
};
