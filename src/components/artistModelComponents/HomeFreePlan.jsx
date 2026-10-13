import Bio from './homeFreePlanComponents/Bio.jsx';
import Language from './homeFreePlanComponents/Language.jsx';
import Country from './homeFreePlanComponents/Country.jsx';
import Region from './homeFreePlanComponents/Region.jsx';
import Genre from './homeFreePlanComponents/Genre.jsx';


import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { brand } from "../../brand";
import { Button } from '@mui/material';
import { ARTIST_PROFILE } from "../../utils/query.js";







export default function HomeFreePlan({ artistId, onArtistUpdated }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    loading,
    error,
    data,
    refetch,
  } = useQuery(ARTIST_PROFILE, {
    variables: { artistId },
    skip: !artistId,
  });

  const artistProfile = data?.artistProfile;
  const artistAka = artistProfile?.artistAka || artistProfile?.fullName || "artist";

  useEffect(() => {
    if (artistProfile) {
      onArtistUpdated?.(artistProfile);
    }
  }, [artistProfile, onArtistUpdated]);

  const refetchArtistProfile = async () => {
    const result = await refetch?.();
    const nextArtistProfile = result?.data?.artistProfile;
    onArtistUpdated?.(nextArtistProfile);
    return result;
  };
  const profileProps = {
    artistId,
    artistProfile,
    loading,
    error,
    refetch: refetchArtistProfile,
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: 1180,
      mx: 'auto',
      px: isMobile ? 1 : 3,
      py: { xs: 2, md: 3 },
    }}>


 <Typography 
        component="h1" 
        sx={{ 
          mb: 0.75, 
          mt: isMobile ? 2 : 5,
          fontWeight: 900,
          fontSize: { xs: "1.8rem", md: "2.35rem" },
          color: brand.colors.textPrimary,
          letterSpacing: 0,
        }}
      >
        Creator Profile
      </Typography>
      <Typography
        sx={{
          color: brand.colors.textSecondary,
          mb: 3,
          maxWidth: 680,
          lineHeight: 1.55,
        }}
      >
        Keep your public creator details current so listeners know where you are from, what you make, and how to discover your work.
      </Typography>




      {/* Bio */}
      <Grid container spacing={2.5} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12}} >
          <Bio {...profileProps} />
        </Grid>
      </Grid>

      {/* Details Section */}
      <Grid
        container
        spacing={2.5}
        sx={{
          p: { xs: 0, md: 0.5 },
          borderRadius: brand.radius.md,
          background: brand.colors.cardSurface,
          border: `1px solid ${brand.colors.cardBorder}`,
        }}
      >
        <Grid size={{ xs: 12, md: 6 }} >
          <Country {...profileProps} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} >
          <Region {...profileProps} />
        </Grid> 

        <Grid size={{ xs: 12, md: 6 }}>
          <Language {...profileProps} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Genre {...profileProps} />
        </Grid>
      </Grid>
    </Box>
  );
}
