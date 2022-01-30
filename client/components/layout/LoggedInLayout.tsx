import { FC } from 'react';
import Link from 'next/link';
import { useMe } from '@/modules/session/useMe';
import { Indicator } from '../Indicator';
import { SignIn } from '../SignIn';
import { FlashMessage } from '@/components/FlashMessage';
import { SignOut } from '../SignOut';

export const LoggedInLayout: FC = ({ children }) => {
  const me = useMe();

  return (
    <div>
      <header>
        <h1><Link href="/">dw-manager</Link></h1>
        {(() => {
          if (me.data) return (
            <div>
              <p>{me.data.attributes.name}</p>
              <p><SignOut /></p>
            </div>
          );
          return <></>;
        })()}
      </header>
      <div>
        {(() => {
          if (me.isLoading) return <Indicator />;
          if (me.errors) return <SignIn />;
          return children;
        })()}
      </div>
      <FlashMessage />
    </div>
  );
};
