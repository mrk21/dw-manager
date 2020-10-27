import { FC, useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { flashUnset } from '@/modules/flash';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { AlertProps } from '@material-ui/lab/Alert/Alert';

export const FlashMessage: FC = () => {
  const [ isOpened, setIsOpened ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ severity, setSeverity ] = useState<AlertProps['severity']>(undefined);

  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.flash.count);
  const error = useAppSelector(state => state.flash.error);
  const success = useAppSelector(state => state.flash.success);

  const onClose = useCallback(() => {
    setIsOpened(false);
    dispatch(flashUnset());
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
