import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import FeaturingArtist from "./inputsForSong/FeaturingArtist";


import Producer from "./Producer";
import Composer from "./inputsForSong/Composer";
import AlbumSong from "./inputsForSong/AlbumInSong";
import SongCategorySpeed from "./inputsForSong/SongCategorySpeed";
import TruckNumber from "./inputsForSong/TruckNumber";
import SongLabel from "./inputsForSong/SongLabel";
import Genre from './inputsForSong/Genre';
import Mood from "./Mood";
import ReleaseDate from './inputsForSong/ReleaseDate';
import {
  MusicNote as MusicNoteIcon,
} from "@mui/icons-material";
import TextField from "@mui/material/TextField";

import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import { brand, brandPrimaryButtonSx } from "../../../brand";

const metadataFormSx = {
  display: "grid",
  gridTemplateColumns: "1fr",
  rowGap: 2.25,
  "& > *": {
    minWidth: 0,
  },
};

const metadataSectionGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
  columnGap: 2,
  rowGap: 0.75,
  "& > *": {
    minWidth: 0,
  },
};

function SectionIntro() {
  return (
    <>

      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 900,
          color: brand.colors.textPrimary,
          textAlign: "left",
          mb: 0.5,
        }}
      >
        Song Details
      </Typography>


      <Typography
        sx={{
          color: brand.colors.textSecondary,
          mb: 3,
          lineHeight: 1.55,
        }}
      >
        Add the information listeners will see when your track goes live.
      </Typography>


    </>
  );
}

function TitleField({ errors, register, normalizeTitle }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "start",
        gridColumn: { xs: "1", md: "1 / -1" },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: brand.colors.textPrimary,
          fontWeight: 500,
          mb: 0.5,
        }}
      >
        Title
      </Typography>

      <TextField
        fullWidth
        placeholder="Enter song title"
        {...register("title", {
          required: "Title is required",
          setValueAs: normalizeTitle,
        })}
        error={!!errors.title}
        helperText={errors.title?.message || ""}
        margin="normal"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MusicNoteIcon sx={{ color: brand.colors.accent }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: brand.colors.cardSurface,
            color: brand.colors.textPrimary,
            borderRadius: brand.radius.md,
            "& fieldset": {
              borderColor: brand.colors.borderStrong,
            },
            "&:hover fieldset": {
              borderColor: brand.colors.accent,
            },
            "&.Mui-focused fieldset": {
              borderColor: brand.colors.accent,
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.7)",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: brand.colors.accent,
          },
        }}
      />
    </Box>
  );
}

function MetadataSection({ children, description, title }) {
  return (
    <Box
      sx={{
        gridColumn: "1 / -1",
        borderTop: `1px solid ${brand.colors.cardBorder}`,
        borderBottom: `1px solid ${brand.colors.cardBorder}`,
        borderRadius: brand.radius.md,
        px: { xs: 2, sm: 2.5 },
        py: { xs: 2.25, sm: 2.75 },
        backgroundColor: brand.colors.cardSurface,
        boxShadow: "none",
      }}
    >
      <Box sx={{ mb: 2.25 }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: brand.colors.textPrimary,
            fontWeight: 800,
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            sx={{
              color: brand.colors.textSecondary,
              mt: 0.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      <Box sx={metadataSectionGridSx}>{children}</Box>
    </Box>
  );
}

function PrimaryMetadataFields({
  Controller,
  artistId,
  albumToSelect,
  albums,
  control,
  errors,
  handleAlbumChange,
  refetchAlbums,
  register,
  setValue,
  watch,
}) {
  return (
    <>
      <FeaturingArtist register={register} watch={watch} setValue={setValue} errors={errors} />
      <Producer register={register} watch={watch} setValue={setValue} errors={errors} />
      <Composer register={register} watch={watch} setValue={setValue} errors={errors} />

      <AlbumSong
        key="album"
        artistId={artistId}
        register={register}
        Controller={Controller}
        control={control}
        errors={errors}
        albumToSelect={albumToSelect}
        refetchAlbums={refetchAlbums}
        albums={albums}
        handleAlbumChange={handleAlbumChange}
      />

      <SongCategorySpeed Controller={Controller} control={control} errors={errors} />
      <TruckNumber key="track" register={register} errors={errors} />
      <Genre register={register} Controller={Controller} control={control} errors={errors} />
    </>
  );
}

function ReleaseMetadataFields({ control, errors, register, watch }) {
  return (
    <>
      <Mood control={control} watch={watch} />
      <SongLabel register={register} errors={errors} />
      <ReleaseDate register={register} errors={errors} />
    </>
  );
}

function MetadataDivider() {
  return (
    <Divider
      sx={{
        gridColumn: "1 / -1",
        my: 0.5,
        borderColor: brand.colors.cardBorder,
        boxShadow: "none",
      }}
    />
  );
}

function SubmitActions({ submitLabel = "Next" }) {
  return (
    <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", mt: 2 }}>
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
        {submitLabel}
      </Button>
    </Box>
  );
}



export default function Metadata({
  Controller,
  artistId,
  setValue,
  onSubmit,
  handleSubmit,
  watch,
  control,
  register,
  refetchAlbums,
  errors,
  albumToSelect,
  albums,
  handleAlbumChange,
  submitLabel,
}) {
  const normalizeTitle = (value) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return "";
    const lower = trimmed.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };



  return (
    <Fade in timeout={500}>
      <Paper
        elevation={3}
        sx={{
          
          backgroundColor: brand.colors.cardSolidSurface,
          backgroundImage: "none",
          width: "100%",
          p: 4,
          height: "auto",
          borderRadius: brand.radius.md,
          backdropFilter: "blur(10px)",
          border: `1px solid ${brand.colors.cardBorder}`,
          boxShadow: brand.shadow.md,
          color: brand.colors.textPrimary,
          fontFamily: brand.typography.fontFamily,
          "& .MuiTypography-root": {
            fontFamily: brand.typography.fontFamily,
          },
          "& .MuiInputBase-root, & .MuiOutlinedInput-root, & .MuiSelect-select": {
            color: `${brand.colors.textPrimary} !important`,
          },
          "& .MuiInputBase-input": {
            color: `${brand.colors.textPrimary} !important`,
          },
          "& .MuiInputBase-input::placeholder": {
            color: brand.colors.textMuted,
            opacity: 1,
          },
          "& .MuiSvgIcon-root": {
            color: brand.colors.accent,
          },
          "& .MuiFormHelperText-root, & .MuiTypography-caption": {
            color: brand.colors.textMuted,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: `${brand.colors.borderStrong} !important`,
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${brand.colors.accent} !important`,
          },
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${brand.colors.accent} !important`,
          },
        }}
      >
        <SectionIntro />
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={metadataFormSx}
        >
          <MetadataSection
            title="Basic information"
            description="Name the track clearly before adding the rest of the metadata."
          >
            <TitleField
              errors={errors}
              register={register}
              normalizeTitle={normalizeTitle}
            />
          </MetadataSection>

          <MetadataDivider />

          <MetadataSection
            title="Credits and catalog"
            description="Add the people, album, track number, category, speed, and genre."
          >
            <PrimaryMetadataFields
              Controller={Controller}
              artistId={artistId}
              albumToSelect={albumToSelect}
              albums={albums}
              control={control}
              errors={errors}
              handleAlbumChange={handleAlbumChange}
              refetchAlbums={refetchAlbums}
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </MetadataSection>

          <MetadataDivider />

          <MetadataSection
            title="Mood and release"
            description="Choose the feeling of the song and confirm label and release details."
          >
            <ReleaseMetadataFields
              control={control}
              errors={errors}
              register={register}
              watch={watch}
            />
          </MetadataSection>

          <SubmitActions submitLabel={submitLabel} />
        </Box>
      </Paper>
    </Fade>
  );
}
