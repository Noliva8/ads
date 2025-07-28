import { useState } from 'react';
import { Box, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material';

export default function VerifyPhone() {
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setSuccess(true);
    }, 1500); // simulate async
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        px: 3 
      }}
    >
      <Typography variant="h4" gutterBottom>
        Verify Your Phone
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        Enter the 6-digit code sent to your phone number.
      </Typography>

      <TextField 
        label="Verification Code" 
        variant="outlined" 
        value={code} 
        onChange={(e) => setCode(e.target.value)} 
        sx={{ mb: 2, width: '250px' }}
      />

      <Button 
        variant="contained" 
        onClick={handleVerify} 
        disabled={verifying || !code}
      >
        {verifying ? <CircularProgress size={24} /> : 'Verify'}
      </Button>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Phone number verified successfully.
        </Alert>
      )}
    </Box>
  );
}
