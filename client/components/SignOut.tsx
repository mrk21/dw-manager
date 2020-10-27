import { FC, useCallback } from 'react';
import { signOut } from '@/modules/session';
import Button from '@material-ui/core/Button';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/dist/client/router';

export const SignOut: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const OnSubmit = useCallback(async (_: any) => {
    await dispatch(signOut());
    router.reload();
  }, []);

  return (
    <Button variant="contained" onClick={OnSubmit} >sign-out</Button>
  );
};
