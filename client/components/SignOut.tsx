import { FC, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/dist/client/router';
import { useSignOut } from '../modules/session/useSignOut';
import { jsonAPIErrorsToFlash } from '../modules/flash/index';

export const SignOut: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const signOut = useSignOut({
    onSuccess: () => {
      router.reload();
    },
    onError: (errors) => {
      jsonAPIErrorsToFlash(dispatch)(errors);
    }
  });

  const OnSubmit = useCallback(() => { signOut.mutate(null) }, []);

  return (
    <Button variant="contained" onClick={OnSubmit} >sign-out</Button>
  );
};
