import { FC } from 'react';
import Link from 'next/link';
import { useMe } from '@/modules/session/useMe';
import { Indicator } from '../Indicator';
import { SignIn } from '../SignIn';
import { FlashMessage } from '@/components/FlashMessage';
import { SignOut } from '../SignOut';

export const LoggedInLayout: FC = ({ children }) => {
  const [ loading, errors, me ] = useMe();

  return (
    <div>
      <header>
        <h1><Link href="/">dw-manager</Link></h1>
        {(() => {
          if (me) return (
            <div>
              <p>{me.attributes.name}</p>
              <p><SignOut /></p>
            </div>
          );
          return <></>;
        })()}
      </header>
      <div>
        {(() => {
          if (loading) return <Indicator />;
          if (errors) return <SignIn />;
          return children;
        })()}
      </div>
      <FlashMessage />
    </div>
  );
};
