import { useState } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResendEmail = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
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
        Verify Your Email
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        We’ve sent a verification link to your email address. Please check your inbox and follow the link to verify your email.
      </Typography>

      <Button 
        variant="contained" 
        onClick={handleResendEmail} 
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Resend Email'}
      </Button>

      {sent && (
        <Alert severity="success" sx={{ mt: 1 }}>
          Verification email has been sent.
        </Alert>
      )}
    </Box>
  );
}
