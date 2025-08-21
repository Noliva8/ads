import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";

function AdPymentSuccess() {
  const theme = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);

  if (!state) {
    navigate('/'); // Redirect if accessed directly without payment data
    return null;
  }

// after payment we need to navigate to step 2 for upload
// =====================================================

  const handleNavigateToUpload = () => {  
    navigate('/dashboard/CreateAudioAd');
  };

  const formatAmount = (cents, currency) =>
    `$${(Number(cents || 0) / 100).toFixed(2)} ${String(currency || "").toUpperCase()}`;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        p: 4,
        backgroundColor: colors.blackNeutral[700]
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 80, color: colors.greenAccent[500], mb: 3 }} />
      <Typography variant="h3" gutterBottom sx={{ color: colors.graySoft[100] }}>
        Payment Successful!
      </Typography>
      <Typography variant="h6" sx={{ color: colors.graySoft[200], mb: 2 }}>
        Your payment of {formatAmount(state.amount, state.currency)} was processed successfully.
      </Typography>
      <Typography variant="body1" sx={{ color: colors.graySoft[300], mb: 4 }}>
        Transaction ID: {state.paymentIntentId}
      </Typography>
      
      {state.receiptUrl && (
        <Button
          href={state.receiptUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          sx={{ mb: 3, backgroundColor: colors.orange[500], '&:hover': { backgroundColor: colors.orange[600] } }}
        >
          View Receipt
        </Button>
      )}
      
      <Button
        onClick={handleNavigateToUpload}
        variant="outlined"
        sx={{
          color: colors.graySoft[100],
          borderColor: colors.orange[500],
          '&:hover': { borderColor: colors.orange[600] }
        }}
      >
        Continue to Upload Advert
      </Button>
    </Box>
  );
}

export default AdPymentSuccess;