import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_REGION } from '../../../utils/mutation'


import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from "react-toastify";
import {
  artistProfileCardSx,
  artistProfileColors,
  artistProfileEditButtonSx,
  artistProfileFormLabelSx,
  artistProfileModalSx,
  artistProfilePrimaryButtonSx,
  artistProfileTextAreaStyle,
  artistProfileValueSx,
} from "./artistProfileBrand";



const REGIONS = [
  "West Africa",
  "East Africa",
  "Southern Africa",
  "North Africa",
  "Central Africa",
  "Diaspora",
];

const Region = ({artistId, artistProfile, loading, refetch}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fieldValue, setFieldValue] = useState("");
  const [addRegion, { loading: updating }] = useMutation(ADD_REGION);
  const [open, setOpen] = useState(false);
  const modalStyle = artistProfileModalSx({ isMobile });
  const cardStyle = artistProfileCardSx();
  const bioContainerStyle = artistProfileValueSx();

  const handleOpen = () => {
    setFieldValue(artistProfile?.region || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFieldValue("");
  };

  const handleUpdate = async () => {
    if (!fieldValue.trim()) {
      toast.error("Region cannot be empty.");
      return;
    }

    try {
      await addRegion({
        variables: {
          region: fieldValue,
          artistId,
        },
      });

      refetch?.();
      toast.success("Region updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating region:", error);
      toast.error("Error updating region. Please try again.");
    }
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ mt: { xs: 1, sm: 2.5 }, p: { xs: 0, sm: 1.25 }, width: "100%" }}
      >
        {loading ? (
          <Typography variant="h6" color="textSecondary">
            Loading...
          </Typography>
        ) : (
          <Card sx={cardStyle}>
            <CardContent sx={{ flexGrow: 1, p: { xs: 1.25, sm: 2 }, "&:last-child": { pb: { xs: 1.25, sm: 2 } } }}>
              <Typography
                variant="h4"
                component="div"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: artistProfileColors.textPrimary,
                  letterSpacing: 0,
                  marginBottom: "1rem",
                  fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2rem" },
                }}
              >
                Region
              </Typography>

              {artistProfile?.region ? (
                <Box sx={bioContainerStyle}>
                  <Typography
                    variant="body2"
                    sx={{ color: artistProfileColors.textPrimary, fontSize: { xs: "1rem", sm: "1.1rem" }, fontWeight: 700, overflowWrap: "anywhere" }}
                  >
                    {artistProfile.region}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    fontSize: "1rem",
                    lineHeight: "1.5em",
                    color: artistProfileColors.textSecondary,
                  }}
                >
                  This profile has not set a region yet.
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pt: 0 }}>
              <Button
                onClick={handleOpen}
                variant="contained"
                sx={{
                  ...artistProfileEditButtonSx,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  padding: "0.6rem 1.5rem",
                }}
                aria-label="Edit Region"
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        )}
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="update-region-modal"
        aria-describedby="modal-to-update-region"
      >
        <Box sx={modalStyle}>
          <Typography
            variant="h5"
            id="update-region-modal"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: "0.04em",
              marginBottom: "1rem",
            }}
          >
            Update Region
          </Typography>
          <FormControl fullWidth>
            <FormLabel
              htmlFor="region-select"
              sx={{
                ...artistProfileFormLabelSx,
              }}
            >
              Region
            </FormLabel>
            <TextField
              id="region-select"
              select
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              fullWidth
              sx={{
                marginTop: "10px",
                backgroundColor: artistProfileTextAreaStyle.backgroundColor,
                borderRadius: "5px",
                "& .MuiInputBase-input": { color: artistProfileColors.textPrimary },
                "& fieldset": { borderColor: artistProfileColors.border },
              }}
            >
              <MenuItem value="">Select region</MenuItem>
              {REGIONS.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </TextField>
            <Button
              onClick={handleUpdate}
              variant="contained"
              sx={{
                ...artistProfilePrimaryButtonSx,
                marginTop: "15px",
                fontWeight: "bold",
                fontSize: "1rem",
                padding: "0.6rem 1.5rem",
              }}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </Button>
          </FormControl>
        </Box>
      </Modal>

    </>
  );
};

export default Region;
