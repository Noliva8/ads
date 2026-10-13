
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { brand } from "../../../../brand";

// const MAIN_GENRES = [
//   "Afrobeats",
//   "Amapiano",
//   "Afro Pop",
//   "Afro-Fusion",
//   "Afro-House",
//   "Afro-R&B",
//   "Hip Hop",
//   "Gospel (African)",
//   "R&B / Soul",
//   "Pop",
//   "Bongo Flava",
//   "Ghanaian Drill (Asakaa)",
//   "Naija Pop",
//   "Coupe-Decale",
//   "Gengetone",
//   "Gqom",
//   "Kwaito",
//   "Azonto",
//   "Reggaeton",
//   "Dancehall",
//   "Reggae",
//   "Latin Pop",
//   "Trap",
//   "Drill (UK/US)",
//   "Electronic",
//   "K-Pop",
//   "Highlife",
//   "Soukous",
//   "Rumba",
//   "Zouk",
//   "Kizomba",
//   "Ragga",
//   "Soca",
//   "Jazz",
//   "Blues",
//   "Rock",
//   "Alternative",
//   "Traditional",
//   "Fuji",
//   "Juju",
//   "Apala",
//   "Mbalax",
//   "Zouglou",
//   "Rai",
//   "Gnawa",
//   "Taarab",
//   "Maskandi",
//   "Palmwine",
//   "Folk",
//   "Spoken Word",
// ];



const MAIN_GENRES = [
  "Afrobeats",
  "Amapiano",
  "Hip Hop",
  "R&B",
  "Pop",
  "Reggae",
  "Dancehall",
  "Reggaeton",
  "Electronic",
  "country",
  "Highlife",
  "Soukous",
  "Rumba",
  "Zouk",
  "Kizomba",
  "Soca",
  "Jazz",
  "Blues",
  "Rock",
  "Alternative",
  "Traditional",
  "Folk",
  "Spoken Word",
];



export default function Genre({ control,Controller, errors }) {
  return (
    <Box
      mb={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
      }}
    >
      <Typography
        htmlFor="genre"
        sx={{
          color: brand.colors.textPrimary,
          fontFamily: brand.typography.fontFamily,
          fontWeight: 500,
          fontSize: "16px",
          letterSpacing: 0,
          mb: 1
        }}
      >
        Genre
      </Typography>

      <Controller
        name="genre"
        control={control}
        defaultValue=""
        rules={{ required: "Please select a genre" }}
        render={({ field }) => (
          <Select
            {...field}
            fullWidth
            displayEmpty
            error={!!errors.genre}
            MenuProps={{
              sx: { zIndex: 1700 },
              PaperProps: {
                sx: {
                  backgroundColor: brand.colors.cardSolidSurface,
                  backgroundImage: "none",
                  color: brand.colors.textPrimary,
                  border: `1px solid ${brand.colors.cardBorder}`,
                  boxShadow: brand.shadow.lg,
                  "& .MuiMenuItem-root": {
                    color: brand.colors.textPrimary,
                    "&.Mui-selected, &.Mui-selected:hover": {
                      backgroundColor: brand.colors.accentSoft,
                    },
                    "&:hover": {
                      backgroundColor: brand.colors.cardSurface,
                    },
                  },
                },
              },
            }}
            sx={{
              minWidth: 220,
              backgroundColor: brand.colors.cardSurface,
              color: brand.colors.textPrimary,
              borderRadius: brand.radius.md,
              fontSize: "16px",
              "& .MuiSelect-icon": {
                color: brand.colors.accent,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: brand.colors.borderStrong
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: brand.colors.accent
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: brand.colors.accent
              }
            }}
          >
            <MenuItem value="" disabled>
              <Typography component="span" sx={{ color: brand.colors.textMuted }}>
                Select a genre
              </Typography>
            </MenuItem>
            {MAIN_GENRES.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      {errors.genre && (
        <Typography variant="subtitle2" color="error" sx={{ mt: 1 }}>
          {errors.genre.message}
        </Typography>
      )}
    </Box>
  );
}
