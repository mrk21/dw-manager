import { FC, useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { flashMessageUnset } from '@/modules/flash_message';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { AlertProps } from '@material-ui/lab/Alert/Alert';

export const FlashMessage: FC = () => {
  const [ isOpened, setIsOpened ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ severity, setSeverity ] = useState<AlertProps['severity']>(undefined);

  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.flashMessage.count);
  const error = useAppSelector(state => state.flashMessage.error);
  const success = useAppSelector(state => state.flashMessage.success);

  const onClose = useCallback(() => {
    setIsOpened(false);
    dispatch(flashMessageUnset());
  }, []);

  useEffect(() => {
    if (error || success) {
      setSeverity(
        error ? 'error'
      : success ? 'success'
      : undefined
      );
      setMessage(error || success || '');
      setIsOpened(true);
    }
  }, [count, error, success]);

  return (
    <Snackbar open={isOpened} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};
