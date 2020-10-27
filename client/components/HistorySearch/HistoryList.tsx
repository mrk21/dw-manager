import { FC, Fragment } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { HistoryTagList } from '@/components/HistoryTagList'
import { History } from '@/api/histories/History';

export type HistoryListProps = {
  histories: History[];
};

export const HistoryList: FC<HistoryListProps> = ({ histories }) => {
  return (
    <List>
      {histories.map((history) => (
        <Fragment key={history.id}>
          <ListItem>
            <ListItemText>
              <b>{history.attributes.date}:</b>&nbsp;
              <span>{history.attributes.institution}</span>&nbsp;
              <span>{history.attributes.title}{history.attributes.isTransfer ? ' (振替)' : ''}</span>&nbsp;
              <b>{history.attributes.amount}</b>&nbsp;
              <HistoryTagList history={history} />
            </ListItemText>
          </ListItem>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};
