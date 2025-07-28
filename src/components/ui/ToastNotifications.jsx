import { Snackbar, Alert } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { toastVar } from "../../utils/toast.js"

const ToastNotifications = () => {
  const toast = useReactiveVar(toastVar);

  const handleClose = () => {
    toastVar(null);
  };

  if (!toast) return null;

  return (
    <Snackbar
      open={!!toast}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={toast.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotifications;