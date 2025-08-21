import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Card,
  IconButton,
  Box,
  Divider,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Apple, Google, CreditCard } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { FaPaypal } from "react-icons/fa";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { tokens } from "../../../../theme";
import Checkout from "./AdCheckout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ==============================
// Parent: AdPayment
// ==============================
export default function AdPayment({ clientSecret, success, onPaymentSuccess, onCancel, steps, setSteps }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Auto-open checkout as soon as we have a clientSecret
  useEffect(() => {
    if (clientSecret) setShowCheckout(true);
  }, [clientSecret]);

  const handlePayment = (method) => {
    setSelectedMethod(method);
    setLoading(true);
    setShowCheckout(method === "card"); // Only open checkout for card for now
    setTimeout(() => setLoading(false), 300);
  };

  const paymentMethods = [
    { id: "card", name: "Credit Card", icon: <CreditCard fontSize="large" />, color: "#ffffff", textColor: "#64748B", variant: "outlined" },
    { id: "apple", name: "Apple Pay", icon: <Apple fontSize="large" />, color: "#000000", textColor: "#ffffff", variant: "contained" },
    { id: "google", name: "Google Pay", icon: <Google fontSize="large" />, color: "#4285F4", textColor: "#ffffff", variant: "contained" },
    
    { id: "paypal", name: "PayPal", icon: <FaPaypal fontSize="large" />, color: "#009CDE", textColor: "#ffffff", variant: "contained" }
  ];

  const CARD_SLUG = {
  visa: 'visa',
  mastercard: 'mastercard',
  amex: 'americanexpress',
  discover: 'discover',
};

  if (!clientSecret) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color={colors.graySoft[200]}>Preparing checkout…</Typography>
      </Box>
    );
  }

  return (
    <Box minWidth="100%">
      <Elements
        stripe={stripePromise}
        options={{ clientSecret, appearance: { theme: "night" } }}
      >
        <Grid
          container
          columnSpacing={3}
          rowSpacing={2}
          sx={{
            borderRadius: "16px",
           
            boxShadow: theme.shadows[10],
            backgroundColor: colors.blackNeutral[600],
          }}
        >
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: theme.shadows[10],
                backgroundColor: colors.blackNeutral[600],
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={colors.graySoft[100]}
                  mb={3}
                >
                  Secure Payment
                </Typography>

                <Divider
                  sx={{
                    my: 2,
                    borderColor: colors.blackNeutral[500],
                    borderBottomWidth: 2,
                  }}
                />

                <Box mt={3}>
                  <Grid container spacing={3}>
                    {paymentMethods.map((method) => (
                      <Grid size={{ xs: 12, sm: 3 }} key={method.id}>
                        <Button
                          fullWidth
                          variant={method.variant}
                          onClick={() => handlePayment(method.id)}
                          disabled={loading}
                          sx={{
                            borderRadius: "12px",
                            height: "64px",
                            backgroundColor: method.color,
                            color: method.textColor,
                            border:
                              method.variant === "outlined"
                                ? `1px solid ${colors.blackNeutral[400]}`
                                : "none",
                            "&:hover": {
                              backgroundColor:
                                method.variant === "contained"
                                  ? `${method.color}${theme.palette.mode === "dark" ? "DD" : "CC"}`
                                  : colors.blackNeutral[500],
                              boxShadow: theme.shadows[4],
                            },
                            transition: "all 0.3s ease",
                            textTransform: "none",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            {loading && selectedMethod === method.id ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <>
                                {method.icon}
                                <Typography variant="body1" fontWeight="600">
                                  {method.name}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box mt={4} textAlign="center">
                  <Typography variant="body2" color={colors.graySoft[300]}>
                    Your payment is securely processed. We don't store your
                    payment details.
                  </Typography>

  <Box mt={1} display="flex" justifyContent="center" gap={1.5} flexWrap="wrap">
  {['visa', 'mastercard', 'amex', 'discover'].map((card) => (
    <Box
      key={card}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 1.25,
        py: 0.75,
        minWidth: 64,
        borderRadius: 1.5,                 // 12px if default spacing = 8
        bgcolor: 'rgba(255,255,255,0.06)', // subtle pill
        border: '1px solid',
        borderColor: 'divider',            // or a custom color token
      }}
    >
      <Box
        component="img"
        src={`https://cdn.simpleicons.org/${CARD_SLUG[card]}/fff`}
        alt={card}
        sx={{ height: 28, display: 'block', opacity: 0.95 }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </Box>
  ))}
</Box>


                </Box>
              </CardContent>
            </Card>

            {showCheckout && (
              <Checkout
                steps={steps}
                setSteps={setSteps}
                clientSecret={clientSecret}
                showCheckout={showCheckout}
                success={success} // optional toast
                onPaymentSuccess={(paymentIntent) => {
                  setShowCheckout(false);
                  onPaymentSuccess && onPaymentSuccess(paymentIntent);
                }}
                onCancel={() => setShowCheckout(false)}
              />
            )}
          </Grid>

         


        </Grid>
      </Elements>
    </Box>
  );
}

