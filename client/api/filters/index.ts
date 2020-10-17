import * as t from 'io-ts';
import { decodeJsonAPIArrayResponse } from '@/api/JsonAPIArrayResponse';
import { decodeJsonAPIResponse } from '@/api/JsonAPIResponse';
import { Filter, NewFilter } from '@/api/filters/Filter';
import { OffsetPagination } from '@/api/OffsetPagination';

const ListMeta = t.type({
  page: OffsetPagination,
});

export const getFilter = async (id: string) => {
  const response = await fetch(`http://localhost:4000/filters/${id}`, {
    mode: 'cors',
    credentials: 'include',
  });
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: Filter });
};

export const getFilterList = async ({ page = 1, per = 20 }: { page?: number, per?: number }) => {
  const response = await fetch(`http://localhost:4000/filters?page=${page}&per=${per}`, {
    mode: 'cors',
    credentials: 'include',
  });
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: Filter, meta: ListMeta });
};

export const createFilter = async (data: NewFilter) => {
  const response = await fetch(`http://localhost:4000/filters`, {
    method: 'POST',
    body: JSON.stringify({ data }),
    mode: 'cors',
    credentials: 'include',
  });
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: Filter });
}

export const updateFilter = async (data: Filter) => {
  const response = await fetch(`http://localhost:4000/filters/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
    mode: 'cors',
    credentials: 'include',
  });
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: Filter });
}
