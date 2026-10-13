import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_GENRE } from "../../../utils/mutation";
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
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

const MAIN_GENRES = [
  "Afrobeats",
  "Amapiano",
  "Afro Pop",
  "Afro-Fusion",
  "Afro-House",
  "Afro-R&B",
  "Hip Hop",
  "Gospel (African)",
  "R&B / Soul",
  "Pop",
  "Bongo Flava",
  "Ghanaian Drill (Asakaa)",
  "Naija Pop",
  "Coupe-Decale",
  "Gengetone",
  "Gqom",
  "Kwaito",
  "Azonto",
  "Reggaeton",
  "Dancehall",
  "Reggae",
  "Latin Pop",
  "Trap",
  "Drill (UK/US)",
  "Electronic",
  "K-Pop",
  "Highlife",
  "Soukous",
  "Rumba",
  "Zouk",
  "Kizomba",
  "Ragga",
  "Soca",
  "Jazz",
  "Blues",
  "Rock",
  "Alternative",
  "Traditional",
  "Fuji",
  "Juju",
  "Apala",
  "Mbalax",
  "Zouglou",
  "Rai",
  "Gnawa",
  "Taarab",
  "Maskandi",
  "Palmwine",
  "Folk",
  "Spoken Word",
];

const Genre = ({artistId, artistProfile, loading, refetch}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fieldValue, setFieldValue] = useState([]);
  const [addGenre, { loading: updating }] = useMutation(ADD_GENRE);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const modalStyle = artistProfileModalSx({ isMobile });
  const cardStyle = artistProfileCardSx();
  const bioContainerStyle = artistProfileValueSx();

  const handleOpen = () => {
    setFieldValue(artistProfile?.genre || []);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFieldValue([]);
  };

  const handleUpdate = async () => {
    if (!fieldValue.length) {
      toast.error("Genres cannot be empty.");
      return;
    }

    try {
      const { data } = await addGenre({
        variables: {
          genre: fieldValue,
          artistId,
        },
      });

      if (data?.addGenre) {
        refetch?.();
        toast.success("Genres updated successfully!");
        handleClose();
      } else {
        toast.error("Error updating genres.");
      }
    } catch (error) {
      console.error("Error updating genres:", error);
      toast.error("Error updating genres. Please try again.");
    }
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="stretch" sx={{ mt: { xs: 1, sm: 2.5 }, p: { xs: 0, sm: 1.25 }, width: "100%" }}>
        {loading ? (
          <Typography variant="h6" color="textSecondary">Loading...</Typography>
        ) : (
          <Card sx={cardStyle}>
            <CardContent sx={{ flexGrow: 1, p: { xs: 1.25, sm: 2 }, "&:last-child": { pb: { xs: 1.25, sm: 2 } } }}>
              <Typography
                variant="h4"
                component="div"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  textAlign: "center",
                  color: artistProfileColors.textPrimary,
                  letterSpacing: 0,
                  marginBottom: "1rem",
                  fontSize: { xs: "1.35rem", sm: "1.75rem", md: "1.8rem" },
                }}
              >
                Genres
              </Typography>
              {artistProfile?.genre && artistProfile.genre.length > 0 ? (
                <Box component="ul" sx={{ ...bioContainerStyle, pl: { xs: 3, sm: 4 }, m: 0 }}>
                  {artistProfile.genre.map((genre, index) => (
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
                      {genre}
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
                    marginTop: "1rem",
                  }}
                >
                  This profile has not set any genres yet.
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
                aria-label="Edit genres"
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        )}
      </Grid>

      {/* Modal for updating genres */}
      <Modal open={open} onClose={handleClose} aria-labelledby="update-genre-modal" aria-describedby="modal-to-update-genre">
        <Box sx={modalStyle}>
          <Typography
            variant="h5"
            id="update-genre-modal"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: "0.04em",
              marginBottom: "1rem",
              fontSize: "1.6rem", // Adjust font size for modal header
            }}
          >
            Update Genres
          </Typography>
          <FormControl fullWidth>
            <FormLabel
              htmlFor="genre-select"
              sx={{
                ...artistProfileFormLabelSx,
                fontSize: "1rem", // Slightly smaller label text
              }}
            >
              Genres
            </FormLabel>
            <Select
              id="genre-select"
              multiple
              value={fieldValue}
              open={menuOpen}
              onOpen={() => setMenuOpen(true)}
              onClose={() => setMenuOpen(false)}
              onChange={(e) => {
                setFieldValue(e.target.value);
                setMenuOpen(false);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      sx={{
                        backgroundColor: artistProfileColors.accentSoft,
                        color: artistProfileColors.textPrimary,
                      }}
                      onDelete={() =>
                        setFieldValue((prev) => prev.filter((genre) => genre !== value))
                      }
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  ))}
                </Box>
              )}
              sx={{
                mt: 1,
                backgroundColor: artistProfileTextAreaStyle.backgroundColor,
                color: artistProfileColors.textPrimary,
                borderRadius: "5px",
                "& .MuiSelect-select": { color: artistProfileColors.textPrimary },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: artistProfileColors.border,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 320,
                    backgroundColor: artistProfileColors.surface,
                    color: artistProfileColors.textPrimary,
                  },
                },
              }}
            >
              {MAIN_GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
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

export default Genre;
