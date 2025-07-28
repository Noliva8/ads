import { makeVar } from '@apollo/client';

export const toastVar = makeVar(null);

export const showToast = (message, type = 'success') => {
  toastVar({ message, type });
  setTimeout(() => toastVar(null), 6000);
};