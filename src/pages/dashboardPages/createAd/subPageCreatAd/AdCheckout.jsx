import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Card,
  IconButton,
  Box,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { tokens } from "../../../../theme";

function Checkout({ clientSecret, onCancel, onPaymentSuccess, success, showCheckout, steps,  setSteps}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("US");
  const [postalCode, setPostalCode] = useState("");
  const isValidUSZip = (z) => /^\d{5}(-\d{4})?$/.test(z);

  // Payment state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (!stripe) return;
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!clientSecret) {
      setError("Payment session expired. Please refresh and try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPaymentStatus('processing');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            email,
            address: {
              country,
              ...(country === "US" ? { postal_code: postalCode } : {})
            }
          }
        },
        return_url: window.location.origin
      });

      if (stripeError) {
        setPaymentStatus('failed');
        setError(stripeError.message || "Payment failed");
        return;
      }

      switch (paymentIntent?.status) {
        case 'succeeded':
          setPaymentStatus('succeeded');
          const receiptUrl = paymentIntent?.charges?.data?.[0]?.receipt_url || "";
          
          // Navigate to success route with payment details
         setSteps(2)
          
          onPaymentSuccess?.(paymentIntent);
          break;
          
        case 'processing':
          setPaymentStatus('processing');
          setError("Payment is processing. We'll notify you when complete.");
          break;
          
        case 'requires_action':
          setPaymentStatus('requires_action');
          setError("Payment requires additional authentication.");
          break;
          
        default:
          setPaymentStatus('failed');
          setError("Payment could not be processed.");
      }
    } catch (err) {
      setPaymentStatus('failed');
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentStatus = () => {
    if (!paymentStatus) return null;
    
    const statusConfig = {
      processing: {
        color: colors.orange[500],
        text: "Processing payment...",
        icon: <CircularProgress size={20} />
      },
      succeeded: {
        color: colors.greenAccent[500],
        text: "Payment successful!",
        icon: <CheckCircleIcon />
      },
      failed: {
        color: colors.redAccent[500],
        text: "Payment failed",
        icon: <ErrorIcon />
      },
      requires_action: {
        color: colors.orange[500],
        text: "Additional action required",
        icon: <WarningIcon />
      }
    };
    
    const currentStatus = statusConfig[paymentStatus];
    
    return (
      <Box display="flex" alignItems="center" gap={1} mt={2}>
        {currentStatus.icon}
        <Typography color={currentStatus.color}>
          {currentStatus.text}
        </Typography>
      </Box>
    );
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: colors.graySoft[100],
        "::placeholder": { color: colors.graySoft[400] },
        backgroundColor: colors.blackNeutral[500]
      },
      invalid: { color: colors.redAccent[500] }
    },
    hidePostalCode: true
  };

  return (
    <Card
      sx={{
        backgroundColor: colors.blackNeutral[500],
        p: 3,
        position: "relative",
        border: `1px solid ${colors.blackNeutral[400]}`,
        mt: 3
      }}
    >
      <IconButton onClick={onCancel} sx={{ position: "absolute", right: 8, top: 8, color: colors.graySoft[300] }}>
        <CloseIcon />
      </IconButton>

      <Typography variant="h5" mb={3} color={colors.graySoft[100]}>
        Enter Card Details
      </Typography>

      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{
                "& .MuiInputLabel-root": { color: colors.graySoft[400] },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.blackNeutral[600],
                  "& fieldset": { borderColor: colors.blackNeutral[400] }
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                "& .MuiInputLabel-root": { color: colors.graySoft[400] },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.blackNeutral[600],
                  "& fieldset": { borderColor: colors.blackNeutral[400] }
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.blackNeutral[600],
                    "& fieldset": { borderColor: colors.blackNeutral[400] }
                  }
                }}
              >
                <MenuItem value="US">United States</MenuItem>
                <MenuItem value="RW">Rwanda</MenuItem>
                <MenuItem value="UG">Uganda</MenuItem>
                <MenuItem value="KE">Kenya</MenuItem>
                <MenuItem value="NG">Nigeria</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {country === "US" && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                inputProps={{ inputMode: "numeric" }}
                sx={{
                  "& .MuiInputLabel-root": { color: colors.graySoft[400] },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.blackNeutral[600],
                    "& fieldset": { borderColor: colors.blackNeutral[400] }
                  }
                }}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: colors.blackNeutral[600],
                border: `1px solid ${colors.blackNeutral[400]}`
              }}
            >
              <CardElement options={cardElementOptions} />
            </Box>
          </Grid>

          {error && (
            <Grid size={{ xs: 12 }}>
              <Typography color={colors.redAccent[500]}>{error}</Typography>
            </Grid>
          )}

          {renderPaymentStatus()}

          <Grid size={{ xs: 12 }} mt={2}>
            <Button
              fullWidth
              onClick={handleSubmit}
              variant="contained"
              disabled={isProcessing || !stripe}
              sx={{ height: "50px", backgroundColor: colors.orange[500], "&:hover": { backgroundColor: colors.orange[600] } }}
            >
              {isProcessing ? <CircularProgress size={24} color="inherit" /> : "Pay now"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

export default Checkout;