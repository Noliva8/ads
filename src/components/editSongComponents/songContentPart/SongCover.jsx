import { startTransition } from 'react';
import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";

import {ADD_ARTWORK} from "../../../utils/mutation";


import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { brand, brandOutlinedButtonSx, brandPrimaryButtonSx } from "../../../brand";





const SongCover = ({ 
  setActiveStep,
  songId,
  currentImageUrl,
  displayImageUrl,
  isPreviewLoading,
  isUploaded,
  onUpload,
  onDelete,
  isLoading,
  onFinish,
}) => {
const navigate = useNavigate();

const {  handleSubmit, formState: { errors } } = useForm();
  const [addArtwork] = useMutation(ADD_ARTWORK);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    onUpload(file).catch((error) => {
      console.error("Artwork upload failed:", error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.message || 'Failed to upload artwork. Please try again.',
      });
    });
  };




  // update the server


  const onSubmit = async (data) => {

 if (!songId) {
    console.error("🚨 Cannot submit: songId is missing.");
    Swal.fire({
      icon: 'warning',
      title: 'Unexpected error',
      text: 'We are having trouble to add your song lyrics, please reflesh the page and try again',
    });
    return;
  }

  try{

 const variables = {
  songId: songId,
  artwork: currentImageUrl,

};

await addArtwork({ variables });

   if (onFinish) {
    await onFinish();
   } else {
    await Swal.fire({
      icon: 'success',
      title: 'Song Updated!',
      html: `
        <div style="text-align:center">
          <p> your song has been published</p>
          <small>Now available in your library</small>
        </div>
      `
    });
    startTransition(() => navigate('/artist/studio/dashboard'));
   }
  }
  catch(error){
    console.error("🔥 Error during adding artwork:", error);

   Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      html: `
        <div style="text-align:left">
          <p>${error.message}</p>
          ${error.networkError ? '<small>Please check your connection</small>' : ''}
        </div>
      `
    });

  }


}









  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: brand.radius.md,
        background: brand.colors.cardSolidSurface,
        color: brand.colors.textPrimary,
        border: `1px solid ${brand.colors.cardBorder}`,
        boxShadow: brand.shadow.md,
        fontFamily: brand.typography.fontFamily,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: brand.colors.textPrimary, fontWeight: 800 }}>
        Song artwork
      </Typography>
      
      <form onSubmit={handleSubmit((onSubmit))} >
      <Box sx={{ 
        border: '2px dashed', 
        borderColor: isUploaded ? brand.colors.success : brand.colors.borderStrong, 
        borderRadius: brand.radius.md,
        p: 4,
        textAlign: 'center',
        position: 'relative',
        minHeight: 300,
        background: brand.colors.cardSurface,
      }}>
        {isPreviewLoading ? (
          <>
            <CircularProgress size={48} sx={{ color: brand.colors.accent }} />
            <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 2 }}>
              Loading cover preview...
            </Typography>
          </>
        ) : displayImageUrl ? (
          <>
            <Box
              component="img"
              src={displayImageUrl}
              alt="Song cover preview"
              sx={{
                width: "min(100%, 260px)",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                borderRadius: brand.radius.md,
                border: `1px solid ${brand.colors.cardBorder}`,
                boxShadow: brand.shadow.md,
                display: "block",
                mx: "auto",
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ color: brand.colors.textPrimary, fontWeight: 800 }}>
              Cover ready
            </Typography>
            <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 0.5, mb: 2 }}>
              Use Finish to save this artwork to the song.
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ ...brandOutlinedButtonSx, mr: 1, fontWeight: 800 }}
              disabled={isLoading}
            >
              Replace Cover
              <input
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            <IconButton
              onClick={onDelete}
              disabled={isLoading}
              sx={{
                color: brand.colors.textPrimary,
                border: `1px solid ${brand.colors.borderStrong}`,
                '&:hover': { bgcolor: brand.colors.error, color: brand.colors.white }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        ) : isUploaded ? (
          <>
            <CheckCircleIcon
              sx={{
                fontSize: 64,
                color: brand.colors.success,
                mb: 1,
              }}
            />
            <Typography variant="h6" sx={{ color: brand.colors.textPrimary, fontWeight: 800 }}>
              Uploaded
            </Typography>
            <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 0.5, mb: 2 }}>
              Cover uploaded successfully. Use Finish to save it to the song.
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ ...brandOutlinedButtonSx, mr: 1, fontWeight: 800 }}
              disabled={isLoading}
            >
              Replace Cover
              <input
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            <IconButton
              onClick={onDelete}
              disabled={isLoading}
              sx={{
                color: brand.colors.textPrimary,
                border: `1px solid ${brand.colors.borderStrong}`,
                '&:hover': { bgcolor: brand.colors.error, color: brand.colors.white }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        ) : (
          <>
            {isLoading ? (
              <>
                <CircularProgress size={48} sx={{ color: brand.colors.accent }} />
                <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 2 }}>
                  Uploading cover...
                </Typography>
              </>
            ) : (
              <>
                <ImageIcon sx={{ fontSize: 48, color: brand.colors.accent }} />
                <Typography variant="h6" sx={{ color: brand.colors.textPrimary, fontWeight: 800, mt: 1 }}>
                  Upload cover
                </Typography>
                <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 0.5 }}>
                  Select a new image to update this song cover.
                </Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    ...brandPrimaryButtonSx,
                    mt: 2,
                    fontWeight: 800,
                  }}
                  disabled={isLoading}
                >
                  Upload Cover
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png" 
                    hidden 
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="caption" sx={{ color: brand.colors.textMuted, mt: 1, display: 'block' }}>
                  JPEG or PNG, max 10MB
                </Typography>
              </>
            )}
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          sx={{
            ...brandPrimaryButtonSx,
            fontFamily: brand.typography.fontFamily,
            px: 3,
            py: 1.1,
            fontWeight: 800,
          }}
          type="submit"
          disabled={isLoading || isPreviewLoading || !currentImageUrl}
        >
          {isLoading ? "Uploading..." : "Finish"}
        </Button>
      </Box>


      </form>
    </Paper>
  );
};

export default SongCover;
