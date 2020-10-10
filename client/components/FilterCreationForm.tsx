import { FC, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useAppDispatch } from '@/hooks';
import { createFilter } from '@/modules/filter';
import { ValidationFailedJsonAPIError } from '@/entities/JsonAPIError';
import { ValidationError } from '@/components/ValidationError';
import { successSet, successUnset, errorSet, errorUnset } from '@/modules/flash_message';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = {
  condition: string;
  isOpen: boolean;
  onClose: (_: any) => void;
  onChangeCondition: (value: string) => void;
};

export const FilterCreationForm: FC<Props> = ({ condition, isOpen, onClose, onChangeCondition }) => {
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<ValidationFailedJsonAPIError | undefined>();
  const [name, setName] = useState('');

  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.target.value), []);
  const onChangeCondition_ = useCallback((e: ChangeEvent<HTMLInputElement>) => onChangeCondition(e.target.value), []);
  const onCreate = useCallback(async (_: any) => {
    const result = await dispatch(createFilter({ name, condition }));
    if (result.errors) {
      const e = result.errors.filter((v): v is ValidationFailedJsonAPIError => v.code == 'validation_failed')[0];
      dispatch(errorUnset());
      dispatch(errorSet('Fail filter creation'));
      setErrors(e);
    }
    else {
      dispatch(successUnset());
      dispatch(successSet('Filter created'));
      onClose(_);
    }
  }, [name, condition]);

  useEffect(() => {
    return () => {
      if (!isOpen) {
        setName('');
        setErrors(undefined);
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle>New Filter</DialogTitle>
      <DialogContent style={{width: '500px'}}>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          defaultValue={name}
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
        <Button onClick={onCreate} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};
