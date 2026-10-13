import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { brand } from "../../brand";
import Lyrics from "./songContentPart/Lirycs";
import Metadata from "./songContentPart/Metadata";
import SongCover from "./songContentPart/SongCover";

import {
  GET_PRESIGNED_URL,
  GET_PRESIGNED_URL_DOWNLOAD,
  UPDATE_SONG,
} from "../../utils/mutation.js";
import { GET_ALBUM } from "../../utils/query";

const STEPS = ["Metadata", "Lyrics", "Cover"];
const SONG_ARTWORK_BUCKET = "afrofeel-cover-images-for-songs";
const SONG_ARTWORK_REGION = "us-east-2";

const normalizeCreditList = (value, fallbackItem) => {
  if (Array.isArray(value) && value.length) return value;
  if (value && typeof value === "object") return [value];
  return [fallbackItem];
};

const getS3ObjectKey = (url) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  } catch {
    return url.replace(/^https?:\/\/[^/]+\//, "").split("?")[0];
  }
};

export default function MetadataEdit({ song, songId: songIdProp, artistId, onClose, refetch }) {
  const [updateSong] = useMutation(UPDATE_SONG);
  const [getPresignedUrl] = useMutation(GET_PRESIGNED_URL);
  const [getPresignedUrlDownload] = useMutation(GET_PRESIGNED_URL_DOWNLOAD);
  const [activeStep, setActiveStep] = useState(0);
  const [albumToSelect, setAlbumToSelect] = useState("");
  const [albums, setAlbums] = useState([]);
  const [currentArtworkUrl, setCurrentArtworkUrl] = useState(song?.artwork || "");
  const [displayArtworkUrl, setDisplayArtworkUrl] = useState("");
  const [hasUploadedArtwork, setHasUploadedArtwork] = useState(false);
  const [isUploadingArtwork, setIsUploadingArtwork] = useState(false);
  const [isArtworkPreviewLoading, setIsArtworkPreviewLoading] = useState(false);

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      featuringArtist: [],
      producer: [],
      composer: [],
      trackNumber: 1,
      genre: "",
      songCategory: "",
      speed: "",
      mood: [],
      subMoods: [],
      label: "",
      releaseDate: "",
      album: null,
    },
  });

  const {
    loading: albumLoading,
    error: albumError,
    data: albumData,
    refetch: refetchAlbums,
  } = useQuery(GET_ALBUM, {
    variables: { artistId },
    skip: !artistId,
  });

  useEffect(() => {
    if (albumData && !albumError) {
      setAlbums(albumData.albumOfArtist || []);
    }
  }, [albumData, albumError]);

  const availableAlbums = useMemo(() => {
    if (!song?.album?._id) return albums;

    const hasCurrentAlbum = albums.some((album) => album._id === song.album._id);
    return hasCurrentAlbum ? albums : [song.album, ...albums];
  }, [albums, song]);

  useEffect(() => {
    if (song?.album && availableAlbums.length) {
      const existing = availableAlbums.find((album) => album._id === song.album._id);

      if (existing) {
        setAlbumToSelect(existing);
        setValue("album", existing._id);
      } else {
        console.warn("Album not in list:", song.album._id);
      }
    }
  }, [availableAlbums, setValue, song]);

  useEffect(() => {
    if (!song) return;

    setCurrentArtworkUrl(song.artwork || "");
    setDisplayArtworkUrl("");
    setHasUploadedArtwork(false);
    reset({
      title: song.title || "",
      featuringArtist: song.featuringArtist || [""],
      producer: normalizeCreditList(song.producer, { name: "", role: "" }).map((producer) => ({
        name: producer.name || "",
        role: producer.role || "",
      })),
      composer: normalizeCreditList(song.composer, { name: "", contribution: "" }).map(
        (composer) => ({
          name: composer.name || "",
          contribution: composer.contribution || "",
        })
      ),
      trackNumber: song.trackNumber || 1,
      genre: song.genre || "",
      songCategory: song.songCategory || "",
      speed: song.speed || "",
      label: song.label || "",
      releaseDate: song.releaseDate ? song.releaseDate.split("T")[0] : "",
      album: song.album?._id || null,
      mood: song.mood || [],
      subMoods: song.subMoods || [],
    });

    setAlbumToSelect(song.album || null);
  }, [reset, song]);

  useEffect(() => {
    const loadArtworkPreview = async () => {
      const key = getS3ObjectKey(currentArtworkUrl);

      if (!key) {
        setIsArtworkPreviewLoading(false);
        setDisplayArtworkUrl("");
        return;
      }

      setIsArtworkPreviewLoading(true);

      try {
        const { data } = await getPresignedUrlDownload({
          variables: {
            bucket: SONG_ARTWORK_BUCKET,
            key,
            region: SONG_ARTWORK_REGION,
          },
        });

        setDisplayArtworkUrl(data.getPresignedUrlDownload.url);
      } catch (error) {
        console.error("Failed to load artwork preview:", error);
        setDisplayArtworkUrl("");
      } finally {
        setIsArtworkPreviewLoading(false);
      }
    };

    loadArtworkPreview();
  }, [currentArtworkUrl, getPresignedUrlDownload]);

  const handleAlbumChange = (event) => {
    const selectedId = event.target.value;
    const existing = availableAlbums.find((album) => album._id === selectedId);

    if (existing) {
      setAlbumToSelect(existing);
      setValue("album", existing._id);
    }
  };

  const onSubmit = async (formData) => {
    const currentSongId = songIdProp || song?._id || song?.id;

    if (!currentSongId) {
      console.error("Cannot update song: songId is missing.");
      return;
    }

    const selectedAlbumId = formData.album || albumToSelect?._id || song?.album?._id;

    try {
      await updateSong({
        variables: {
          songId: currentSongId,
          title: formData.title,
          album: selectedAlbumId,
          releaseDate: formData.releaseDate || new Date().toISOString().split("T")[0],
          featuringArtist: Array.isArray(formData.featuringArtist)
            ? formData.featuringArtist.map((artist) => artist.trim())
            : typeof formData.featuringArtist === "string"
              ? formData.featuringArtist.split(",").map((artist) => artist.trim())
              : [],
          trackNumber: Number.isInteger(parseInt(formData.trackNumber))
            ? parseInt(formData.trackNumber)
            : 1,
          genre: formData.genre,
          songCategory: formData.songCategory
            ? String(formData.songCategory).toUpperCase()
            : undefined,
          speed: formData.speed ? String(formData.speed).toUpperCase() : undefined,
          mood: formData.mood || [],
          subMoods: Object.values(formData.subMoods || {}).flat(),
          producer: Array.isArray(formData.producer) ? formData.producer : [],
          composer: Array.isArray(formData.composer) ? formData.composer : [],
          label: formData.label || "",
        },
      });

      await refetch?.();
      setActiveStep(1);
    } catch (error) {
      console.error("Song update failed:", error);
    }
  };

  const handleArtworkUpload = async (file) => {
    if (!file) return;

    setIsUploadingArtwork(true);

    try {
      const objectKey = `cover-images/${songIdProp || song?._id || song?.id}-${Date.now()}-${file.name}`;
      const { data } = await getPresignedUrl({
          variables: {
            bucket: SONG_ARTWORK_BUCKET,
            key: objectKey,
            region: SONG_ARTWORK_REGION,
          },
        });
      const uploadUrl = data.getPresignedUrl.url;

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.onload = () => {
          if (xhr.status === 200) resolve();
          else reject(new Error("Failed to upload artwork."));
        };
        xhr.onerror = () => reject(new Error("Failed to upload artwork."));
        xhr.send(file);
      });

      const artworkUrl = `https://${SONG_ARTWORK_BUCKET}.s3.${SONG_ARTWORK_REGION}.amazonaws.com/${objectKey}`;
      setCurrentArtworkUrl(artworkUrl);
      setDisplayArtworkUrl("");
      setHasUploadedArtwork(true);
      return artworkUrl;
    } finally {
      setIsUploadingArtwork(false);
    }
  };

  const handleArtworkDelete = () => {
    setCurrentArtworkUrl("");
    setDisplayArtworkUrl("");
    setHasUploadedArtwork(false);
  };

  const handleFinish = async () => {
    await refetch?.();
    onClose?.();
  };

  if (albumLoading || !song) {
    return (
      <Box
        sx={{
          minHeight: { xs: 420, sm: 520 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          color: brand.colors.textPrimary,
          backgroundColor: brand.colors.cardSurface,
          border: `1px solid ${brand.colors.cardBorder}`,
          borderRadius: brand.radius.md,
        }}
      >
        <CircularProgress size={44} sx={{ color: brand.colors.accent }} />
        <Typography sx={{ color: brand.colors.textSecondary, fontWeight: 700 }}>
          Loading song details...
        </Typography>
      </Box>
    );
  }

  if (albumError) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: brand.colors.error,
          backgroundColor: brand.colors.cardSurface,
          border: `1px solid ${brand.colors.cardBorder}`,
          borderRadius: brand.radius.md,
          p: 3,
        }}
      >
        <Typography fontWeight={800}>Error! {albumError.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ color: brand.colors.textPrimary }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: brand.colors.accent, fontWeight: 800 }}>
          Editing
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {song?.title || "Song details"}
        </Typography>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mt: 2,
            "& .MuiStepLabel-label": {
              color: `${brand.colors.textSecondary} !important`,
              fontWeight: 700,
            },
            "& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed": {
              color: `${brand.colors.accent} !important`,
            },
            "& .MuiStepIcon-root": {
              color: `${brand.colors.borderStrong} !important`,
            },
            "& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed": {
              color: `${brand.colors.accent} !important`,
            },
          }}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {activeStep === 0 ? (
        <Metadata
          Controller={Controller}
          artistId={artistId}
          setValue={setValue}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          watch={watch}
          control={control}
          register={register}
          refetchAlbums={refetchAlbums}
          errors={errors}
          albumToSelect={albumToSelect}
          albums={availableAlbums}
          handleAlbumChange={handleAlbumChange}
          submitLabel="Save Metadata"
        />
      ) : null}

      {activeStep === 1 ? (
        <Lyrics
          artistId={artistId}
          songId={songIdProp || song?._id || song?.id}
          setActiveStep={setActiveStep}
          initialLyrics={song?.lyrics}
          onComplete={refetch}
        />
      ) : null}

      {activeStep === 2 ? (
        <SongCover
          songId={songIdProp || song?._id || song?.id}
          setActiveStep={setActiveStep}
          currentImageUrl={currentArtworkUrl}
          displayImageUrl={displayArtworkUrl}
          isPreviewLoading={isArtworkPreviewLoading}
          isUploaded={hasUploadedArtwork}
          onUpload={handleArtworkUpload}
          onDelete={handleArtworkDelete}
          isLoading={isUploadingArtwork}
          onFinish={handleFinish}
        />
      ) : null}
    </Box>
  );
}
