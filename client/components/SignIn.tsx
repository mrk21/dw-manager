import { FC, useCallback, useRef } from 'react';
import { signIn } from '@/modules/session';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Container from '@material-ui/core/Container';
import { useAppDispatch } from '@/store/hooks';
import { flashErrorSet, flashSuccessSet } from '@/modules/flash';

export const SignIn: FC = () => {
  const dispatch = useAppDispatch();
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  const OnSubmit = useCallback(async (_: any) => {
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const { errors } = await dispatch(signIn({ email, password }));
    if (errors) dispatch(flashErrorSet('sign-in failed'));
    else dispatch(flashSuccessSet('sign-in succeeded'));
  }, []);

  return (
    <Container maxWidth="sm">
      <FormControl fullWidth={true}>
        <InputLabel>email</InputLabel>
        <Input
          required
          inputRef={emailRef}
          fullWidth={true}
        />
      </FormControl>
      <FormControl fullWidth={true}>
        <InputLabel>password</InputLabel>
        <Input
          required
          inputRef={passwordRef}
          type="password"
          fullWidth={true}
        />
      </FormControl>
      <Button variant="contained" onClick={OnSubmit} >sign-in</Button>
    </Container>
  );
};
