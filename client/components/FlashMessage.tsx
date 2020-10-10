import { FC, useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { errorUnset, successUnset } from '@/modules/flash_message';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export const FlashMessage: FC = () => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ severity, setSeverity ] = useState<"success" | "info" | "warning" | "error" | undefined>(undefined);

  const dispatch = useAppDispatch();
  const error = useAppSelector(state => state.flashMessage.error);
  const success = useAppSelector(state => state.flashMessage.success);

  const onClose = useCallback(() => {
    setIsOpen(false);
    dispatch(errorUnset());
    dispatch(successUnset());
  }, []);

  useEffect(() => {
    if (error || success) {
      setSeverity(
        error ? 'error' :
        success ? 'success' : undefined
      );
      setMessage(error || success || '');
      setIsOpen(true);
    }
    return () => {
      setSeverity(undefined);
      setMessage('');
    };
  }, [error, success]);

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};
