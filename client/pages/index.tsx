import { NextPage } from 'next'
import Head from 'next/head'
import { HistorySearch } from '@/components/HistorySearch/HistorySearch';
import { TagList } from '@/components/TagList';
import { FilterList } from '@/components/FilterList';
import { HistoryReport } from '@/components/HistoryReport';
import Grid from '@material-ui/core/Grid';
import { LoggedInLayout } from '@/components/layout/LoggedInLayout';

const IndexPage: NextPage = () => {
  const query = new URLSearchParams(typeof location === 'undefined' ? '' : location.search);
  const tagId = query.get('tag_id');
  const filterId = query.get('filter_id');

  return (
    <LoggedInLayout>
      <Head>
        <title>dw-manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Grid container>
        <Grid item xs={2}>
          <TagList />
          <FilterList />
        </Grid>
        <Grid item xs={7}>
          <HistorySearch
            tagId={tagId ? tagId : undefined}
            filterId={filterId ? filterId : undefined}
          />
        </Grid>
        <Grid item xs={3}>
          <HistoryReport />
        </Grid>
      </Grid>
    </LoggedInLayout>
  );
};

export default IndexPage;
