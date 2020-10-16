import { NextPage } from 'next'
import Head from 'next/head'
import { HistorySearch } from '@/components/HistorySearch/HistorySearch';
import { TagList } from '@/components/TagList';
import { FilterList } from '@/components/FilterList';
import { FlashMessage } from '@/components/FlashMessage';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';

const IndexPage: NextPage = () => {
  const query = new URLSearchParams(typeof location === 'undefined' ? '' : location.search);
  const tagId = query.get('tag_id');
  const filterId = query.get('filter_id');

  return (
    <div>
      <Head>
        <title>dw-manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1><Link href="/">dw-manager</Link></h1>
      <Grid container>
        <Grid item xs={2}>
          <TagList />
          <FilterList />
        </Grid>
        <Grid item xs={10}>
          <HistorySearch
            tagId={tagId ? tagId : undefined}
            filterId={filterId ? filterId : undefined}
          />
        </Grid>
      </Grid>
      <FlashMessage />
    </div>
  );
};

export default IndexPage;
