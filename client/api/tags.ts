import { APIError } from '@/entities/APIError';
import { decodeResponse, Response } from '@/entities/Response';
import { decodeArrayResponse } from '@/entities/ArrayResponse';
import { Tag } from '@/entities/Tag';

export async function getTagList() {
  const response = await fetch(`http://localhost:4000/tags`);
  const json = await response.json();
  return decodeArrayResponse(json, { data: Tag, error: APIError });
};

export async function getTagBatched(ids: string[]) {
  const response = await fetch(`http://localhost:4000/tags/batched/${ids.join(',')}`);
  const json: { [key:string]: unknown } = await response.json();
  const body = Object.entries(json).reduce((result, current, _) => {
    result[current[0]] = decodeResponse(current[1], { data: Tag, error: APIError });
    return result;
  }, <{ [key:string]: Response<Tag, APIError> }>{});
  return body;
};
