
import { useMutation } from "@apollo/client";
import Paper from "@mui/material/Paper";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useForm } from "react-hook-form";
import { ADD_LYRICS } from "../../../utils/mutation.js";
import Swal from "sweetalert2";
import { brand, brandPrimaryButtonSx } from "../../../brand";








export default function Lyrics ({ artistId, songId, setActiveStep, initialLyrics = "", onComplete }) {
const { register, handleSubmit, formState: { errors } } = useForm({
  defaultValues: {
    lyrics: initialLyrics || "",
  },
});
  const [UpdateSong] = useMutation(ADD_LYRICS);


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
  artistId: artistId,
  lyrics: data.lyrics || '',
};
await UpdateSong({ variables });
onComplete?.();
setActiveStep(2);
  }
  catch(error){
    console.error("🔥 Error during add lyrics:", error);

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
        width: '100%' ,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: brand.colors.textPrimary, fontWeight: 800 }}>
        Song Lyrics
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ color: brand.colors.textSecondary }}>
        Add your lyrics (optional)
      </Typography>

          <form onSubmit={handleSubmit((onSubmit))}>

      <Box sx={{ mt: 2, flexGrow: 1, width: '100%' }}>
        <TextareaAutosize
          {...register("lyrics")}
          minRows={10}
          maxRows={25}
          style={{
            width: '100%' ,
            
            padding: "16px",
            border: errors.lyrics ? `1px solid ${brand.colors.error}` : `1px solid ${brand.colors.borderStrong}`,
            borderRadius: brand.radius.md,
            fontFamily: brand.typography.fontFamily,
            fontSize: "0.875rem",
            lineHeight: 1.5,
            resize: "vertical",
            backgroundColor: brand.colors.cardSurface,
            color: brand.colors.textPrimary,
            outlineColor: brand.colors.accent,
          }}
          placeholder="Enter your lyrics here...\n\n[Verse 1]\n...\n\n[Chorus]\n..."
        />
        {errors.lyrics && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
            {errors.lyrics.message}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" sx={{ color: brand.colors.textMuted }}>
          Tip: Use empty lines to separate sections (e.g., Verse, Chorus)
        </Typography>
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
  >
    Next
  </Button>
      </Box>
</form>

    </Paper>
  
  );
}
