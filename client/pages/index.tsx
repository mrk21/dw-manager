import { NextPage } from 'next'
import Head from 'next/head'
import { HistoryList } from '@/components/HistoryList';
import { TagList } from '@/components/TagList';
import { FilterList } from '@/components/FilterList';
import { FlashMessage } from '@/components/FlashMessage';
import Grid from '@material-ui/core/Grid';
import { useRouter } from 'next/router'

const IndexPage: NextPage = () => {
  const router = useRouter();
  const tagId = router.query.tag_id as (string | undefined);
  const filterId = router.query.filter_id as (string | undefined);

  return (
    <div>
      <Head>
        <title>dw-manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>dw-manager</h1>
      <Grid container>
        <Grid item xs={2}>
          <TagList />
          <FilterList />
        </Grid>
        <Grid item xs={10}><HistoryList tagId={tagId} filterId={filterId} /></Grid>
      </Grid>
      <FlashMessage />
    </div>
  );
};

export default IndexPage;
