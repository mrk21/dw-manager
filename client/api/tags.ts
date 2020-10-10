import * as t from 'io-ts';
import { Tag } from '@/entities/Tag';
import { decodeJsonAPIArrayResponse } from '@/entities/JsonAPIArrayResponse';
import { decodeJsonAPIBatchedResponse } from '@/entities/JsonAPIBatchedResponse';

export async function getTagList() {
  const response = await fetch('http://localhost:4000/tags');
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: Tag, meta: t.undefined });
};

export async function getTagBatched(ids: string[]) {
  const response = await fetch(`http://localhost:4000/tags/batched/${ids.join(',')}`);
  const json = await response.json();
  return decodeJsonAPIBatchedResponse(json, { data: Tag });
};
