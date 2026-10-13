import { useState } from "react";
import { useMutation } from "@apollo/client";
import {ADD_BIO} from '../../../utils/mutation'

import Grid from '@mui/material/Grid2';
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import ArtistAccountProfile from "./ArtistAccountProfile";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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

import { toast } from "react-toastify"; 

const Bio = ({ artistId, artistProfile, loading, error, refetch }) => {
  const [fieldValue, setFieldValue] = useState("");
  const [addBio, { loading: updating }] = useMutation(ADD_BIO);
  const [open, setOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const modalStyle = artistProfileModalSx({ isMobile, isTablet, maxWidth: "600px" });

  const cardStyle = artistProfileCardSx({ isMobile, wide: true });

  const bioContainerStyle = {
    ...artistProfileValueSx({ isMobile, textAlign: "justify" }),
    width: '100%',
    maxHeight: "auto",
    fontSize: isMobile ? "1rem" : "1.3rem",
    wordSpacing: "0.1em",
  };

  const handleOpen = () => {
    setFieldValue(artistProfile?.bio || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFieldValue("");
  };

  const handleUpdate = async () => {
    if (!fieldValue.trim()) {
      toast.error("Bio cannot be empty.");
      return;
    }

    if (fieldValue.length > 500) {
      toast.error("Bio cannot exceed 500 characters.");
      return;
    }

    try {
      await addBio({
        variables: {
          bio: fieldValue,
          artistId,
        },
      });

      refetch?.();
      toast.success("Bio updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating bio:", error);
      toast.error("Error updating bio. Please try again.");
    }
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ 
          marginTop: isMobile ? "10px" : "20px", 
          padding: isMobile ? "5px" : "10px" 
        }}
      >
        {loading ? (
          <Typography variant="h6" color="textSecondary">
            Loading...
          </Typography>
        ) : (
          <Card sx={cardStyle}>
            <CardContent>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="div"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: artistProfileColors.textPrimary,
                  letterSpacing: 0,
                  marginBottom: "1rem",
                }}
              >
                Biography
              </Typography>

              <Box sx={{ mb: 2 }}>
                <ArtistAccountProfile
                  artistId={artistId}
                  artistProfile={artistProfile}
                  loading={loading}
                  error={error}
                  refetch={refetch}
                />
              </Box>
              
              {artistProfile?.bio ? (
                <Box sx={bioContainerStyle}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: artistProfileColors.textPrimary, 
                      lineHeight: "1.6em",
                      fontSize: isMobile ? '1rem' : '1.3rem',
                      wordSpacing: "0.1em",
                      fontFamily: 'roboto', 
                      padding: isMobile ? '5px' : '10px'
                    }}
                  >
                    {artistProfile.bio}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    lineHeight: "1.5em",
                    color: artistProfileColors.textSecondary,
                  }}
                >
                  This profile has not set the bio yet.
                </Typography>
              )}
            </CardContent>
            <CardActions style={{ justifyContent: "center" }}>
              <Button
                onClick={handleOpen}
                variant="contained"
                sx={{
                  ...artistProfileEditButtonSx,
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  padding: isMobile ? "0.4rem 1.2rem" : "0.6rem 1.5rem",
                }}
                aria-label="Edit Bio"
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
        aria-labelledby="update-bio-modal"
        aria-describedby="modal-to-update-bio"
      >
        <Box sx={modalStyle}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            id="update-bio-modal"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: "0.04em",
              marginBottom: "1rem",
            }}
          >
            Update Bio
          </Typography>
          <FormControl fullWidth>
            <FormLabel
              htmlFor="bio-textarea"
              sx={{
                ...artistProfileFormLabelSx,
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}
            >
              Biography
            </FormLabel>
            <TextareaAutosize
              id="bio-textarea"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              minRows={isMobile ? 3 : 4}
              style={{
                ...artistProfileTextAreaStyle,
                padding: isMobile ? "0.6rem" : "0.8rem",
                fontSize: isMobile ? "0.95rem" : "1rem",
              }}
              maxLength={500}
              aria-describedby="bio-helper-text"
            />
            <Typography
              variant="caption"
              id="bio-helper-text"
              sx={{ color: artistProfileColors.textSecondary, marginTop: "5px" }}
            >
              {fieldValue.length}/500 characters
            </Typography>
            <Button
              onClick={handleUpdate}
              variant="contained"
              sx={{
                marginTop: "15px",
                ...artistProfilePrimaryButtonSx,
                fontWeight: "bold",
                fontSize: isMobile ? "0.9rem" : "1rem",
                padding: isMobile ? "0.5rem 1.3rem" : "0.6rem 1.5rem",
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

export default Bio;
