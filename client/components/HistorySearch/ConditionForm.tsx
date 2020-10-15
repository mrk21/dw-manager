import { FC, useState, useCallback, ChangeEvent } from 'react';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import { FilterCreationForm } from './FilterCreationForm';

export type ConditionFormProps = {
  condition: string;
  onChange: (value: string) => any;
};

export const ConditionForm: FC<ConditionFormProps> = ({ condition, onChange }) => {
  const onChange_ = useCallback((e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value), []);
  const onChangeForCreation_ = useCallback((value: string) => onChange(value), []);
  const onOpen = useCallback((_: any) => setIsOpend(true), []);
  const onClose = useCallback((_: any) => setIsOpend(false), []);
  const onFocus = useCallback((_: any) => setIsFocused(true), []);
  const onBlur = useCallback((_: any) => setIsFocused(false), []);
  const [isOpend, setIsOpend] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const valueProps = isFocused ? {} : { value: condition };

  return (
    <>
      <FormControl fullWidth={true}>
        <InputLabel>Search</InputLabel>
        <Input
          {...valueProps}
          fullWidth={true}
          onFocus={onFocus}
          onBlur={onBlur}
          defaultValue={condition}
          onInput={onChange_}
          onChange={onChange_}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <Button size="small" startIcon={<SaveIcon />} onClick={onOpen}>Save Filter</Button>
            </InputAdornment>
          }
        />
      </FormControl>
      <FilterCreationForm
        condition={condition}
        isOpen={isOpend}
        onClose={onClose}
        onChangeCondition={onChangeForCreation_}
      />
    </>
  );
};
