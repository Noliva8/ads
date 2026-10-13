import { useState } from "react";

import { useMutation } from "@apollo/client";


import { ADD_LANGUAGES } from "../../../utils/mutation"



import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from "react-toastify";  // Import react-toastify
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

const Language = ({artistId, artistProfile, loading, refetch}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fieldValue, setFieldValue] = useState("");

  const [addBio, { loading: updating }] = useMutation(ADD_LANGUAGES);

  const [open, setOpen] = useState(false);
  const modalStyle = artistProfileModalSx({ isMobile });
  const cardStyle = artistProfileCardSx();
  const bioContainerStyle = artistProfileValueSx();

  const handleOpen = () => {
    setFieldValue(artistProfile?.languages?.join(", ") || ""); // Display languages as a comma-separated list
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFieldValue("");
  };

  const handleUpdate = async () => {
    if (!fieldValue.trim()) {
      toast.error("Languages cannot be empty."); // Show error toast
      return;
    }

    const languagesArray = fieldValue.split(",").map((lang) => lang.trim());

    try {
      await addBio({
        variables: {
          languages: languagesArray,
          artistId,
        },
      });

      refetch?.();
      toast.success("Languages updated successfully!"); // Show success toast
      handleClose();
    } catch (error) {
      console.error("Error updating languages:", error);
      toast.error("Error updating languages. Please try again."); // Show error toast
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
                Languages
              </Typography>
              
              {artistProfile?.languages && artistProfile.languages.length > 0 ? (
                <Box component="ul" sx={{ ...bioContainerStyle, pl: { xs: 3, sm: 4 }, m: 0 }}>
                  {artistProfile.languages.map((language, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        mb: 1,
                        fontSize: { xs: "1rem", sm: "1.15rem" },
                        fontFamily: "roboto",
                        color: artistProfileColors.textPrimary,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {language}
                    </Box>
                  ))}
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
                  This profile has not set the languages yet.
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
                aria-label="Edit Languages"
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
        aria-labelledby="update-languages-modal"
        aria-describedby="modal-to-update-languages"
      >
        <Box sx={modalStyle}>
          <Typography
            variant="h5"
            id="update-languages-modal"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: "0.04em",
              marginBottom: "1rem",
            }}
          >
            Update Languages
          </Typography>
          <FormControl fullWidth>
            <FormLabel
              htmlFor="languages-textarea"
              sx={{
                ...artistProfileFormLabelSx,
              }}
            >
              Languages
            </FormLabel>
            <TextareaAutosize
              id="languages-textarea"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              minRows={4}
              style={{
                ...artistProfileTextAreaStyle,
              }}
              maxLength={500}
              aria-describedby="languages-helper-text"
            />
            <Typography
              variant="caption"
              id="languages-helper-text"
              sx={{ color: artistProfileColors.textSecondary, marginTop: "5px" }}
            >
              {fieldValue.length}/500 characters
            </Typography>
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

export default Language;
