import { FC } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { HistoryTagList } from '@/components/HistoryTagList'
import { History } from '@/entities/History';

export type HistoryListProps = {
  histories: History[];
};

export const HistoryList: FC<HistoryListProps> = ({ histories }) => {
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
};
