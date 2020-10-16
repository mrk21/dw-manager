import * as t from 'io-ts';
import { decodeJsonAPIArrayResponse } from '@/entities/JsonAPIArrayResponse';
import { decodeJsonAPIResponse } from '@/entities/JsonAPIResponse';
import { Filter, NewFilter } from '@/entities/Filter';
import { OffsetPagination } from '@/entities/OffsetPagination';

const ListMeta = t.type({
  page: OffsetPagination,
});

export const getFilter = async (id: string) => {
  const response = await fetch(`http://localhost:4000/filters/${id}`);
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: Filter });
};

export const getFilterList = async ({ page = 1, per = 20 }: { page?: number, per?: number }) => {
  const response = await fetch(`http://localhost:4000/filters?page=${page}&per=${per}`);
  const json = await response.json();
  return decodeJsonAPIArrayResponse(json, { data: Filter, meta: ListMeta });
};

export const createFilter = async (data: NewFilter) => {
  const response = await fetch(`http://localhost:4000/filters`, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: Filter });
}

export const updateFilter = async (data: Filter) => {
  const response = await fetch(`http://localhost:4000/filters/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  const json = await response.json();
  return decodeJsonAPIResponse(json, { data: Filter });
}
