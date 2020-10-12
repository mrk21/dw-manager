import { FC, useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchHistoryList, historySelector } from '@/modules/history';
import { JsonAPIError } from '@/entities/JsonAPIError';
import { HistoryTagList } from '@/components/HistoryTagList'
import { throttle } from '@/libs';
import { FilterCreationForm } from '@/components/FilterCreationForm';
import { filterSelector } from '@/modules/filter';

import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

type Props = {
  tagId?: string;
  filterId?: string;
};

export const HistoryList: FC<Props> = ({ tagId, filterId }) => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [condition, setCondition] = useState('');
  const [isOpendDialog, setIsOpendDialog] = useState(false);

  const dispatch = useAppDispatch();
  const histories = useAppSelector(historySelector.selectAll);
  const filter = useAppSelector((state) => filterSelector.selectById(state, filterId || ''));

  const searchBar = useRef<HTMLInputElement>(null);
  const setConditionThrottled = useCallback(throttle((value: string) => setCondition(value), 1000), []);
  const onChangePage = useCallback((_, page: number) => setPage(page), []);
  const onChangeCondition = useCallback((e: ChangeEvent<HTMLInputElement>) => setConditionThrottled(e.target.value), []);
  const onChangeConditionForFilterForm = useCallback((value: string) => {
    setConditionThrottled(value);
    if (searchBar.current) searchBar.current.value = value;
  }, []);

  const onOpenDialog = useCallback((_: any) => setIsOpendDialog(true), []);
  const onCloseDialog = useCallback((_: any) => setIsOpendDialog(false), []);

  useEffect(() => {
    onChangeConditionForFilterForm(filter ? filter.attributes.condition : '');
  }, [filter]);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors, meta } = await dispatch(fetchHistoryList({ condition, page, tagId, filterId }));
      if (cleanuped) return;
      setLoading(false);
      setErrors(errors);
      if (meta) setTotalPage(meta.page.data.total);
    };
    fetchData();

    return () => { cleanuped = true; };
  }, [page, condition, tagId, filterId]);

  const Content = (() => {
    if (loading) {
      return (
        <p>loading...</p>
      );
    }
    if (errors) {
      return (
        <div>
          {errors.map((e, i) => (
            <p key={i}>{e.title}</p>
          ))}
        </div>
      );
    }
    return (
      <List>
        {histories.map((history) => (
          <>
            <ListItem key={history.id}>
              <ListItemText>
                <b>{history.attributes.date}:</b>&nbsp;
                <span>{history.attributes.title}</span>&nbsp;
                <span>{history.attributes.amount}</span>
                <HistoryTagList history={history} />
              </ListItemText>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    );
  })();

  return (
    <div>
      <FormControl fullWidth={true}>
        <InputLabel>Search</InputLabel>
        <Input
          inputRef={searchBar}
          fullWidth={true}
          defaultValue={condition}
          onInput={onChangeCondition}
          onChange={onChangeCondition}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <Button size="small" startIcon={<SaveIcon />} onClick={onOpenDialog}>Create Filter</Button>
            </InputAdornment>
          }
        />
      </FormControl>
      <FilterCreationForm
        condition={condition}
        isOpen={isOpendDialog}
        onClose={onCloseDialog}
        onChangeCondition={onChangeConditionForFilterForm}
      />
      <Pagination count={totalPage} page={page} onChange={onChangePage} />
      {Content}
    </div>
  );
};
