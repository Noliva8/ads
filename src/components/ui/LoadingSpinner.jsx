import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ fullPage = false }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: fullPage ? '100vh' : '100%',
      width: fullPage ? '100vw' : '100%',
      position: fullPage ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      zIndex: fullPage ? 9999 : 'auto',
      backgroundColor: fullPage ? 'rgba(0,0,0,0.5)' : 'transparent'
    }}
  >
    <CircularProgress color="secondary" size={fullPage ? 60 : 40} />
  </Box>
);

export default LoadingSpinner;