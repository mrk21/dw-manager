import { useMutation, useQueryClient } from "react-query"
import { NewFilter, Filter } from '../../api/filters/Filter';
import { createFilter } from '../../api/filters/index';
import { JsonAPIError } from '../../api/JsonAPIError';

type Options = {
  onSuccess?: (filter: Filter) => void;
  onError?: (errors: JsonAPIError[]) => void;
};

export const useCreateFilter = (options: Options = {}) => {
  const queryClient = useQueryClient();

  return useMutation<Filter, JsonAPIError[], NewFilter['attributes']>(
    async (attributes) => {
      const { data, errors } = await createFilter({ type: 'filter', attributes });
      if (errors) throw errors;
      return data as NonNullable<typeof data>;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('filters');
        if (options.onSuccess) options.onSuccess(data);
      },
      onError: (error) => {
        if (options.onError) options.onError(error);
      }
    }
  );
}
