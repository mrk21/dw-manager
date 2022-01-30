import { useMutation, UseMutationResult, useQueryClient } from "react-query"
import { Filter } from '../../api/filters/Filter';
import { updateFilter } from '../../api/filters/index';
import { JsonAPIError } from '../../api/JsonAPIError';

type Options = {
  onSuccess?: (filter: Filter) => void;
  onError?: (errors: JsonAPIError[]) => void;
};

export const useUpdateFilter = (options: Options = {}) => {
  const queryClient = useQueryClient();

  return <UseMutationResult<Filter, JsonAPIError[]>>useMutation(
    async (filter: Filter) => {
      const { data, errors } = await updateFilter(filter);
      if (errors) throw errors;
      return data as NonNullable<typeof data>;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['filters']);
        queryClient.invalidateQueries(['filter', data.id]);
        if (options.onSuccess) options.onSuccess(data);
      },
      onError: (error) => {
        if (options.onError) options.onError(error);
      }
    }
  );
}
