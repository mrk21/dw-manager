import * as t from 'io-ts';
import { decodeJsonAPIArrayResponse } from '@/api/JsonAPIArrayResponse';
import { decodeJsonAPIResponse } from '@/api/JsonAPIResponse';
import { Filter, NewFilter } from '@/api/filters/Filter';
import { OffsetPagination } from '@/api/OffsetPagination';
import { fetchAPI } from '../fetch';

const ListMeta = t.type({
  page: OffsetPagination,
});

export const getFilter = async (id: string) => {
  const response = await fetchAPI(`/filters/${id}`);
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: Filter });
};

export const getFilterList = async ({ page = 1, per = 20 }: { page?: number, per?: number }) => {
  const response = await fetchAPI(`/filters?page=${page}&per=${per}`);
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: Filter, meta: ListMeta });
};

export const createFilter = async (data: NewFilter) => {
  const response = await fetchAPI(`/filters`, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: Filter });
}

export const updateFilter = async (data: Filter) => {
  const response = await fetchAPI(`/filters/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: Filter });
}
