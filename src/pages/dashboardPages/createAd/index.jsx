import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { failed, success, info } from "../../../utils/notifications";
import { useLocation } from 'react-router-dom';

// MUI
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { Card, CardContent, useTheme, Divider, Button, CircularProgress } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Project bits
import BasicAdInfo from "./subPageCreatAd/BasicAdInfo";
import { tokens } from "../../../theme";
import { CREATE_AD } from "../../../utils/mutation";
import { CONFIRM_PRICE } from "../../../utils/mutation";
import advertizerAuth from "../../../utils/advertizerAuth";
import AdPayment from "./subPageCreatAd/AdPayment";
import QuoteCard from "./subPageCreatAd/QutoeCard";

import AdAudioUpload from "./subPageCreatAd/AdAudioUpload";
import AdBannerUpload from "./subPageCreatAd/AdBannerUpload";
import AdOverlayUpload from "./subPageCreatAd/AdOverlayUpload";
import AudioAdArtwork from "./subPageCreatAd/AudioAdArtwork";


export default function CreateAd() {
  const theme = useTheme();
const colors = tokens(theme.palette.mode);
const [quote, setQuote] = useState(null);
const [ad, setAd] = useState(null);
const [confirming, setConfirming] = useState(false); 
const [paymentIntentData, SetPaymentIntentData] = useState(null);
// steps
  const [steps, setSteps] = useState(0);
  const [adType, setAdType] = useState(null);






const methods = useForm({
  defaultValues: {
    adTitle: "",
    adType: "audio",
    targeting: {
      scope: "city",
      countries: [],
      wholeCountry: false,
      city: "",
      state: ''
    },
    schedule: {
      startDate: "",
      endDate: ""
    },
    description: ""
  }
});





const form = methods.watch();
const profile = advertizerAuth.getProfile();
const advertiserId = profile?.data?._id;


useEffect(() => {
  console.log('Advertizer profile:', profile);
  console.log('Advertizer ID:', advertiserId);
}, [profile, advertiserId]);


// create ad
const [createAdBasic, { loading }] = useMutation(CREATE_AD, {
  onError: (error) => {
    console.error('Mutation error:', error);
    if (error.message.includes('authenticate')) {
      alert('Authentication failed. Please login again.');
    } else {
      alert(`Error creating ad: ${error.message}`);
    }
  },
  onCompleted: (data) => {
    console.log('Ad created successfully:', data);
    setQuote(data.createAdBasic.quote);
    setAd(data.createAdBasic);
    success();
  }
});


const onSubmit = async (formData) => {
  if (!advertiserId) {
    loginAlert();
    return;
  }


  try {
    const validAdTypes = ['audio', 'banner', 'overlay'];
    if (!validAdTypes.includes(formData.adType)) {
      info('Invalid ad type selected.');
      return;
    }

    const input = {
      adTitle: formData.adTitle,
      adType: formData.adType,
      description: formData.description || "",
      targeting: {
        scope: formData.targeting.scope,
        countries: formData.targeting.countries || [],
        wholeCountry: !!formData.targeting.wholeCountry,
        city: formData.targeting.city || "",
        state: formData.targeting.state || ""
      },
      schedule: {
        startDate: formData.schedule.startDate,
        endDate: formData.schedule.endDate
      }
    };

    // Also capture the result here so ad/quote are set immediately
    const res = await createAdBasic({
      variables: { advertiserId, input }
    });

    const created = res?.data?.createAdBasic;
    if (created) {
      setQuote(created.quote);
      setAd(created);
    }
  } catch (error) {
    console.error('Submission error:', error);
    info('Error creating ad');
    failed();
  }
};

// -------



const [confirmPrice, { loading: confirmPriceLoading }] = useMutation(CONFIRM_PRICE, {
  onError: (error) => {
    console.log(error);
    console.error('Mutation error:', error);
    alert('An error occurred: ' + error.message);
  },
});


const handleConfirmPrice = async () => {
  console.log('see the structure of the data we need to pass:', quote);
  console.log('see the structure of the returned id:', ad);
console.log('check if adTpe is available:', ad.ad.adType);

  const dataToSend = {
    adId: ad?.ad?.id,
    isCostConfirmed: true,
    adTitle: ad?.ad?.adTitle,
    adType: ad?.ad?.adType,
    campaignId: ad?.ad?.campaignId,
    duration: ad?.quote?.days,
    amount: ad?.quote?.totalPrice,
    currency: ad?.quote?.currency,
    location: `${ad?.quote?.location?.name || ad?.quote?.location?.country}, ${ad?.quote?.location?.city || ad?.quote?.location?.state || ''}`,
  };

  console.log('Data to send to the server:', dataToSend);


  const res = await confirmPrice({ variables: dataToSend });
  const payload = res?.data?.confirmPrice; 


  if (!payload) {
    info('Could not prepare checkout. Please try again.');
    return null;
  }

  console.log('confirmPrice payload from server:', payload);
const clientSecret = payload?.clientSecret
 console.log('confirmPrice clientSecret:', clientSecret);

  SetPaymentIntentData(payload); 
setAdType(payload?.adType)


  return payload;                
};



const handleConfirm = async () => {
  try {
    if (confirming) return;
    setConfirming(true);

    // 1) Validate without submitting
    const ok = await methods.trigger();
    if (!ok) { setConfirming(false); return; }

    // 2) Ensure we have an ad (create once)
    if (!ad?.ad?.id) {
      await methods.handleSubmit(onSubmit)(); // creates draft ad
    }

    if (!ad?.ad?.id || !ad?.quote) {
      info('Saving your ad details. Please try confirming again in a moment.');
      setConfirming(false);
      return;
    }

    // 3) Confirm price and capture server response
    const paymentData = await handleConfirmPrice();
    if (!paymentData?.clientSecret) {
      // don't advance if we didn't get a client secret
      setConfirming(false);
      return;
    }

    // 4) Next step only after we have a client secret
    handleStep();
  } catch (error) {
    console.error("Confirmation failed:", error);
    failed();
  } finally {
    setConfirming(false);
  }
};









   // Handle step change: increment or decrement steps

  // Handle step increment on submit
  const handleStep = () => {
    setSteps((prev) => prev + 1);
  };

   const handleStepBack = () => {
    setSteps((prev) => (prev > 0 ? prev - 1 : prev)); 
  };








  return (
    <>
      <FormProvider {...methods}>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box
      component="form"
      onSubmit={methods.handleSubmit(onSubmit)}
      width="100%"
      mb={3}
      px={2}
    >

      {/* STEP 0 - Basic Ad Info */}

      {steps === 0 && (
        <Grid container columnSpacing={3} rowSpacing={2} alignItems="stretch">
          {/* Left Column - Form (8 units) */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <BasicAdInfo 
              handleStep={handleStep} 
              colors={colors} 
            />
          </Grid>

          {/* Right Column - Quote (4 units) */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <QuoteCard
              colors={colors}
              quote={quote}
              loading={loading}
              handleConfirm={handleConfirm}
              steps={steps}
            />
          </Grid>
        </Grid>
      )}






      {/* STEP 1 - Payment */}
      {steps === 1 && (
        <Grid container columnSpacing={3} rowSpacing={2} alignItems="stretch">
          {/* Left Column - Payment (8 units) */}
          <Grid size={{ xs: 12, lg: 8 }} sx={{ width: '100%', minWidth: 0 }}>

  <AdPayment
              clientSecret={paymentIntentData?.clientSecret}
              steps={steps}
              setSteps={setSteps}
            />


          </Grid>

          {/* Right Column - Quote (4 units) */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <QuoteCard
              colors={colors}
              quote={quote}
              loading={loading}
              handleConfirm={handleConfirm}
              steps={steps}
            />
          </Grid>
          
        </Grid>
      )}



      {/* STEP 2 - Uploads */}
  {steps === 2 && (
  <Grid
    container
    justifyContent="center"
    alignItems="center"
    sx={{ minHeight: '100vh', px: 2 }} // vertical centering area
  >
    <Grid xs={12} sm={10} md={8} lg={6}>
      <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
        {{
          audio:   <AdAudioUpload cardHeight="70vh" ad={ad} setSteps={setSteps} />,
          overlay: <AdOverlayUpload cardHeight="70vh" />,
          banner:  <AdBannerUpload cardHeight="70vh" />
        }[adType] || null}
      </Box>
    </Grid>
  </Grid>
)}


{
  steps === 3 && (
     <Grid
    container
    justifyContent="center"
    alignItems="center"
    sx={{ minHeight: '100vh', px: 2 }} // vertical centering area
  >
<AudioAdArtwork ad={ad} setSteps={setSteps}  />

  </Grid>
  )
}

    </Box>
  </LocalizationProvider>
</FormProvider>
    </>
  );
}





