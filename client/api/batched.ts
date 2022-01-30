import { JsonAPIBatchedResponse } from './JsonAPIBatchedResponse';
import { batchRequest } from '../libs/batchRequest';
import { JsonAPIError } from './JsonAPIError';

export const getByIDBatched = <Data>(
  batchGet: (ids: string[]) => Promise<JsonAPIBatchedResponse<Data>>,
  onBatchError: (errors: JsonAPIError[]) => void,
) => {
  return batchRequest(
    async (ids: string[]) => {
      const { data, errors } = await batchGet(ids);
      if (errors) onBatchError(errors)
      return data;
    },
    {
      key: (id) => id,
      wait: 20,
      max: 100,
    }
  );
}
