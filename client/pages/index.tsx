import { useState, useRef } from 'react';
import { NextPage } from 'next'
import Head from 'next/head'
import { HistoryList } from '@/components/HistoryList';
import { throttle } from '@/libs';

const IndexPage: NextPage = () => {
  const [displayed, setDisplayed] = useState(false);
  const toggleRef = useRef(throttle((currentDisplayed: boolean) => {
    setDisplayed(!currentDisplayed);
  }, 500));
  const toggle = () => toggleRef.current(displayed);

  return (
    <div>
      <Head>
        <title>dw-manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>dw-manager</h1>
      <button type="button" onClick={toggle}>toggle display</button>
      {displayed ? <HistoryList /> : <p>none</p> }
    </div>
  );
};

export default IndexPage;
