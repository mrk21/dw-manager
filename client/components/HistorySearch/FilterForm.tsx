import { FC, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { ValidationFailedJsonAPIError, extractValidationFailed } from '@/api/JsonAPIError';
import { ValidationError } from '@/components/ValidationError';
import { flashSuccessSet, flashErrorSet } from '@/modules/flash';
import { cloneDeep } from '@/libs';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Indicator } from '../Indicator';
import { useFilter } from '../../modules/filter/useFilter';
import { useCreateFilter } from '../../modules/filter/useCreateFilter';
import { useUpdateFilter } from '../../modules/filter/useUpdateFilter';

type Props = {
  filterId?: string;
  condition: string;
  isOpen: boolean;
  onClose: (_: any) => void;
  onChangeCondition: (value: string) => void;
};

export const FilterForm: FC<Props> = ({
  filterId,
  condition,
  isOpen,
  onClose,
  onChangeCondition
}) => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<ValidationFailedJsonAPIError | undefined>();

  const filter = useFilter(filterId)[2];
  const createFilterMutation = useCreateFilter({
    onSuccess: (data) => {
      dispatch(flashSuccessSet('Filter creation succeeded'));
      onClose(data);
    },
    onError: (errors) => {
      dispatch(flashErrorSet('Filter creation failed'));
      setErrors(extractValidationFailed(errors));
    }
  });

  const updateFilterMutation = useUpdateFilter({
    onSuccess: (data) => {
      dispatch(flashSuccessSet('Filter updating succeeded'));
      onClose(data);
    },
    onError: (errors) => {
      dispatch(flashErrorSet('Filter updating failed'));
      setErrors(extractValidationFailed(errors));
    }
  });

  const loading = createFilterMutation.isLoading || updateFilterMutation.isLoading;

  const [name, setName] = useState(filter ? filter.attributes.name : '');
  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.target.value), []);
  const onChangeCondition_ = useCallback((e: ChangeEvent<HTMLInputElement>) => onChangeCondition(e.target.value), []);

  useEffect(() => {
    return () => {
      if (!isOpen) {
        setName(filter ? filter.attributes.name : '');
        setErrors(undefined);
      }
    }
  }, [filter, isOpen]);

  useEffect(() => {
    if (filter) setName(filter.attributes.name);
  }, [filter]);

  const onCreate = useCallback(() => {
    createFilterMutation.mutate({ name, condition });
  }, [name, condition]);

  const onUpdate = useCallback(() => {
    if (!filter) return;
    const updated = cloneDeep(filter);
    updated.attributes.name = name;
    updated.attributes.condition = condition;
    updateFilterMutation.mutate(updated);
  }, [name, condition]);

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle>{filterId ? 'Edit Filter' : 'New Filter'}</DialogTitle>
      <DialogContent style={{width: '500px'}}>
        <TextField
          autoFocus
          disabled={loading}
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={onChangeName}
        />
        <ValidationError errors={errors} attribute="name" />

        <TextField
          disabled={loading}
          margin="dense"
          label="Condition"
          type="text"
          fullWidth
          defaultValue={condition}
          onChange={onChangeCondition_}
        />
        <ValidationError errors={errors} attribute="condition" />
      </DialogContent>
      <DialogActions>
        {loading ? <Indicator /> : <></>}
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button disabled={loading} onClick={filterId ? onUpdate : onCreate} color="primary">{filterId ? 'Update' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
};
