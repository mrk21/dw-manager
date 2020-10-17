import { FC, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createFilter, updateFilter } from '@/modules/filter';
import { ValidationFailedJsonAPIError, extractValidationFailed } from '@/api/JsonAPIError';
import { ValidationError } from '@/components/ValidationError';
import { flashMessageSuccessSet, flashMessageErrorSet } from '@/modules/flash_message';
import { filterSelector } from '@/modules/filter';
import { cloneDeep } from '@/libs';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { create } from 'lodash';
import { Indicator } from '../Indicator';

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
  const filter = useAppSelector(state => filterSelector.selectById(state, filterId || ''))

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationFailedJsonAPIError | undefined>();
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

  const onCreate = useCallback(async (_: any) => {
    setLoading(true);
    const result = await dispatch(createFilter({ name, condition }));
    setLoading(false);

    if (result.errors) {
      dispatch(flashMessageErrorSet('Filter creation failed'));
      setErrors(extractValidationFailed(result.errors));
    }
    else {
      dispatch(flashMessageSuccessSet('Filter creation succeeded'));
      onClose(_);
    }
  }, [name, condition]);

  const onUpdate = useCallback(async (_: any) => {
    if (!filter) return;
    const filter_ = cloneDeep(filter);
    filter_.attributes.name = name;
    filter_.attributes.condition = condition;

    setLoading(true);
    const result = await dispatch(updateFilter(filter_));
    setLoading(false);

    if (result.errors) {
      dispatch(flashMessageErrorSet('Filter updating failed'));
      setErrors(extractValidationFailed(result.errors));
    }
    else {
      dispatch(flashMessageSuccessSet('Filter updating succeeded'));
      onClose(_);
    }
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
