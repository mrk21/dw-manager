import { FC, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createFilter, updateFilter } from '@/modules/filter';
import { ValidationFailedJsonAPIError } from '@/entities/JsonAPIError';
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

type Props = {
  filterId?: string;
  condition: string;
  isOpen: boolean;
  onClose: (_: any) => void;
  onChangeCondition: (value: string) => void;
};

export const FilterCreationForm: FC<Props> = ({ filterId, condition, isOpen, onClose, onChangeCondition }) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(state => filterSelector.selectById(state, filterId || ''))

  const [errors, setErrors] = useState<ValidationFailedJsonAPIError | undefined>();
  const [name, setName] = useState(filter ? filter.attributes.name : '');

  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.target.value), []);
  const onChangeCondition_ = useCallback((e: ChangeEvent<HTMLInputElement>) => onChangeCondition(e.target.value), []);

  const onCreate = useCallback(async (_: any) => {
    const result = await dispatch(createFilter({ name, condition }));

    if (result.errors) {
      const e = result.errors.filter((v): v is ValidationFailedJsonAPIError => v.code == 'validation_failed')[0];
      dispatch(flashMessageErrorSet('Filter creation failed'));
      setErrors(e);
    }
    else {
      dispatch(flashMessageSuccessSet('Filter creation succeed'));
      onClose(_);
    }
  }, [name, condition]);

  const onUpdate = useCallback(async (_: any) => {
    if (!filter) return;
    const filter_ = cloneDeep(filter);
    filter_.attributes.name = name;
    filter_.attributes.condition = condition;

    const result = await dispatch(updateFilter(filter_));

    if (result.errors) {
      const e = result.errors.filter((v): v is ValidationFailedJsonAPIError => v.code == 'validation_failed')[0];
      dispatch(flashMessageErrorSet('Filter updating failed'));
      setErrors(e);
    }
    else {
      dispatch(flashMessageSuccessSet('Filter updating succeed'));
      onClose(_);
    }
  }, [name, condition]);

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

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle>{filterId ? 'Edit Filter' : 'New Filter'}</DialogTitle>
      <DialogContent style={{width: '500px'}}>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={onChangeName}
        />
        <ValidationError errors={errors} attribute="name" />

        <TextField
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
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={filterId ? onUpdate : onCreate} color="primary">{filterId ? 'Update' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
};
