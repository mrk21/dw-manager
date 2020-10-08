import { NextPage } from 'next'
import Head from 'next/head'
import { HistoryList } from '@/components/HistoryList';

const IndexPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>dw-manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>dw-manager</h1>
      <HistoryList />
    </div>
  );
};

export default IndexPage;
