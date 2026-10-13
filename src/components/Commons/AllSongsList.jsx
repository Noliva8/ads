import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Link,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  brand,
  brandCardContentSx,
  brandOutlinedButtonSx,
  brandPanelSx,
} from "../../brand";
import MetadataEdit from "../editSongComponents/MetadataEdit";
import TogglePlay from "../editSongComponents/songContentPart/inputsForSong/TogglePlay";
import { ADMIN_SONGS } from "../../utils/query";
import { GET_PRESIGNED_URL_DOWNLOAD } from "../../utils/mutation";

const PAGE_SIZE = 25;
const SONG_STREAM_BUCKET = "afrofeel-songs-streaming";
const SONG_STREAM_REGION = "us-west-2";
const SONG_ARTWORK_BUCKET = "afrofeel-cover-images-for-songs";
const SONG_ARTWORK_REGION = "us-east-2";
const ALBUM_COVER_BUCKET = "afrofeel-album-covers";
const ALBUM_COVER_REGION = "us-west-2";
const ARTIST_PROFILE_BUCKET = "afrofeel-profile-picture";
const ARTIST_PROFILE_REGION = "us-west-2";

const getSongId = (song) => song?._id || song?.id;

const getSongLabel = (song) => {
  const songId = getSongId(song);
  const title = song?.title?.trim();

  if (title && songId) return `"${title}" (${songId})`;
  if (title) return `"${title}"`;
  if (songId) return `Song ${songId}`;

  return "This song";
};

const parseS3Url = (value) => {
  if (!value || typeof value !== "string") return null;

  try {
    const parsed = new URL(value);
    const hostParts = parsed.hostname.split(".");
    const region = hostParts.includes("s3")
      ? hostParts[hostParts.indexOf("s3") + 1]
      : SONG_STREAM_REGION;

    if (hostParts[1] === "s3") {
      return {
        bucket: hostParts[0],
        key: decodeURIComponent(parsed.pathname.replace(/^\/+/, "")),
        region,
      };
    }

    if (hostParts[0] === "s3") {
      const [bucket, ...keyParts] = parsed.pathname.replace(/^\/+/, "").split("/");
      return {
        bucket,
        key: decodeURIComponent(keyParts.join("/")),
        region,
      };
    }
  } catch {
    return null;
  }

  return null;
};

const decodeS3Path = (value) => {
  if (!value || typeof value !== "string") return "";

  try {
    const parsed = new URL(value);
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  } catch {
    return decodeURIComponent(value.replace(/^\/+/, "").split("?")[0]);
  }
};

const getSongAudioSource = (song) => {
  const candidates = [
    {
      value: song?.streamAudioFileUrl,
      bucket: SONG_STREAM_BUCKET,
      region: SONG_STREAM_REGION,
    },
    {
      value: song?.premiumStreamAudioFileUrl,
      bucket: SONG_STREAM_BUCKET,
      region: SONG_STREAM_REGION,
    },
  ];

  for (const candidate of candidates) {
    if (!candidate.value) continue;

    const parsedS3Url = parseS3Url(candidate.value);

    if (parsedS3Url?.bucket && parsedS3Url?.key) {
      return parsedS3Url;
    }

    const key = decodeS3Path(candidate.value);

    if (key) {
      return {
        bucket: candidate.bucket,
        key,
        region: candidate.region,
      };
    }
  }

  return null;
};


const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const formatList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || "-";
  return value || "-";
};

const isSingleSong = (song) => {
  const possibleSingleValue = song?.album?.title || song?.title || "";
  return ["single", "singles"].includes(String(possibleSingleValue).trim().toLowerCase());
};

const renderStatusChip = (value, tone = "default") => {
  const color =
    tone === "warning"
      ? brand.colors.warning
      : tone === "success"
        ? brand.colors.success
        : brand.colors.textPrimary;

  return (
    <Chip
      label={value || "-"}
      size="small"
      variant="outlined"
      sx={{
        borderColor: tone === "default" ? brand.colors.borderStrong : color,
        color,
        fontWeight: 700,
        textTransform: "capitalize",
      }}
    />
  );
};

const renderVisibilityChip = (value) => {
  const normalized = String(value || "").toLowerCase();
  const isPublic = normalized === "public" || normalized === "published";
  const Icon = isPublic ? VisibilityIcon : VisibilityOffIcon;
  const color = isPublic ? brand.colors.success : brand.colors.textMuted;

  return (
    <Chip
      icon={<Icon sx={{ color: `${color} !important` }} />}
      label={value || "Private"}
      size="small"
      variant="outlined"
      sx={{
        borderColor: isPublic ? brand.colors.success : brand.colors.borderStrong,
        color,
        fontWeight: 700,
        textTransform: "capitalize",
        "& .MuiChip-label": {
          color,
        },
      }}
    />
  );
};

const DetailItem = ({ label, value, href }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      variant="caption"
      sx={{ color: brand.colors.label, fontWeight: 800, textTransform: "uppercase" }}
    >
      {label}
    </Typography>
    {href && value && value !== "-" ? (
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        sx={{ display: "block", color: brand.colors.accent, overflowWrap: "anywhere" }}
      >
        {value}
      </Link>
    ) : (
      <Typography sx={{ color: brand.colors.textPrimary, overflowWrap: "anywhere" }}>
        {value || "-"}
      </Typography>
    )}
  </Box>
);

const DetailSection = ({ title, children }) => (
  <Box sx={{ ...brandPanelSx, p: 2 }}>
    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
      {title}
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
        gap: 2,
      }}
    >
      {children}
    </Box>
  </Box>
);

const SongsListControls = ({
  canGoNext,
  canGoPrevious,
  from,
  loading,
  onRowsPerPageChange,
  onNextPage,
  onPreviousPage,
  rowsPerPage,
  to,
  totalRows,
}) => {
  const releaseMenuFocus = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="flex-end"
      sx={{
        px: 2,
        py: 1.5,
        borderTop: `1px solid ${brand.colors.cardBorder}`,
        backgroundColor: brand.colors.cardSolidSurface,
        color: brand.colors.textSecondary,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" sx={{ color: brand.colors.textSecondary }}>
          Rows per page:
        </Typography>
        <Select
          size="small"
          value={rowsPerPage}
          onChange={(event) => {
            releaseMenuFocus();
            onRowsPerPageChange(Number(event.target.value));
          }}
          disabled={loading}
          sx={{
            minWidth: 76,
            color: brand.colors.textPrimary,
            backgroundColor: brand.colors.cardSurface,
            borderRadius: brand.radius.md,
            "& .MuiSelect-icon": { color: brand.colors.accent },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: brand.colors.borderStrong },
          }}
          MenuProps={{
            onClose: releaseMenuFocus,
            PaperProps: {
              sx: {
                backgroundColor: brand.colors.cardSolidSurface,
                color: brand.colors.textPrimary,
                border: `1px solid ${brand.colors.cardBorder}`,
                "& .MuiMenuItem-root": {
                  color: brand.colors.textPrimary,
                },
              },
            },
          }}
        >
          {[10, 25, 50].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Typography
        variant="body2"
        sx={{
          color: brand.colors.textSecondary,
          minWidth: 112,
          textAlign: { xs: "left", sm: "right" },
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {from}-{to} of {totalRows}
      </Typography>

      <Stack direction="row" spacing={0.75} alignItems="center">
        <Tooltip title="Previous songs">
          <span>
            <IconButton
              size="small"
              aria-label="Previous songs"
              disabled={!canGoPrevious || loading}
              onClick={onPreviousPage}
              sx={{
                color: canGoPrevious ? brand.colors.textPrimary : brand.colors.textMuted,
                border: `1px solid ${canGoPrevious ? brand.colors.borderStrong : brand.colors.border}`,
                "&:hover": {
                  backgroundColor: brand.colors.accentSoft,
                  borderColor: brand.colors.accent,
                  color: brand.colors.accent,
                },
              }}
            >
              <KeyboardArrowLeftIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Next songs">
          <span>
            <IconButton
              size="small"
              aria-label="Next songs"
              disabled={!canGoNext || loading}
              onClick={onNextPage}
              sx={{
                color: canGoNext ? brand.colors.textPrimary : brand.colors.textMuted,
                border: `1px solid ${canGoNext ? brand.colors.borderStrong : brand.colors.border}`,
                "&:hover": {
                  backgroundColor: brand.colors.accentSoft,
                  borderColor: brand.colors.accent,
                  color: brand.colors.accent,
                },
              }}
            >
              <KeyboardArrowRightIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

const getColumns = ({
  audioLoadingSongId,
  audioUrls,
  onEditSong,
  onPlaySong,
  onPreviewSong,
  playingSongId,
  setPlayingSongId,
}) => [
  {
    field: "rowNumber",
    headerName: "#",
    width: 72,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          color: brand.colors.accent,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: "title",
    headerName: "Title",
    minWidth: 220,
    flex: 1.5,
    renderCell: (params) => (
      <Button
        className="song-title-button"
        onClick={() => onPreviewSong(params.row)}
        sx={{
          minWidth: 0,
          p: 0,
          color: `${brand.colors.textPrimary} !important`,
          fontWeight: 800,
          justifyContent: "flex-start",
          textTransform: "none",
          "&:hover": {
            color: `${brand.colors.textPrimary} !important`,
            background: "transparent",
          },
        }}
      >
        <Box
          component="span"
          sx={{
            color: `${brand.colors.textPrimary} !important`,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value || "Untitled song"}
        </Box>
      </Button>
    ),
  },

  
  {
    field: "artist",
    headerName: "Artist",
    minWidth: 180,
    flex: 1,
    valueGetter: (value) => value?.artistAka || value?.fullName || "-",
  },


 
  {
    field: "visibility",
    headerName: "Visibility",
    minWidth: 130,
    renderCell: (params) => renderVisibilityChip(params.value),
  },

 

  {
    field: "genre",
    headerName: "Genre",
    minWidth: 170,
    flex: 1,
    valueGetter: (value) => formatList(value),
  },


 


  {
    field: "createdAt",
    headerName: "Created",
    minWidth: 140,
    valueFormatter: (value) => formatDate(value),
  },
  {
    field: "actions",
    headerName: "",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    width: 112,
    align: "center",
    renderCell: (params) => {
      const songId = getSongId(params.row);
     
      const audioUrl = audioUrls?.[songId];



   

      return (
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
        {audioUrl ? (
          <TogglePlay
            song={{ ...params.row, _id: songId }}
            audioUrl={audioUrl}
            playingSongId={playingSongId}
            setPlayingSongId={setPlayingSongId}
          />
        ) : (
          <Tooltip title="Play song">
            <IconButton
              aria-label={`Play ${params.row.title || "song"}`}
              size="small"
              onClick={() => onPlaySong(params.row)}
              disabled={audioLoadingSongId === songId}
              sx={{
                color: brand.colors.textPrimary,
                border: `1px solid ${brand.colors.textPrimary}`,
                "&:hover": {
                  background: brand.colors.cardSurface,
                  borderColor: brand.colors.accent,
                  color: brand.colors.accent,
                },
              }}
            >
              {audioLoadingSongId === getSongId(params.row) ? (
                <CircularProgress size={18} sx={{ color: brand.colors.accent }} />
              ) : (
                <PlayArrowIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Edit song">
          <IconButton
            aria-label={`Edit ${params.row.title || "song"}`}
            size="small"
            onClick={() => onEditSong(params.row)}
            sx={{
              color: brand.colors.textPrimary,
              border: `1px solid ${brand.colors.textPrimary}`,
              "&:hover": {
                background: brand.colors.accentSoft,
                borderColor: brand.colors.accent,
                color: brand.colors.accent,
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      );
    },
  },
];

export default function AllSongsListPage() {
  const [getPresignedUrlDownload] = useMutation(GET_PRESIGNED_URL_DOWNLOAD);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
  const [page, setPage] = useState(0);
  const [selectedSong, setSelectedSong] = useState(null);
  const [dialogMode, setDialogMode] = useState("preview");
  const [audioLoadingSongId, setAudioLoadingSongId] = useState(null);
  const [audioUrls, setAudioUrls] = useState({});
  const [audioError, setAudioError] = useState("");
  const [playingSongId, setPlayingSongId] = useState(null);
  const [artworkPreviewUrl, setArtworkPreviewUrl] = useState("");
  const [isArtworkPreviewLoading, setIsArtworkPreviewLoading] = useState(false);
  const [albumCoverPreviewUrl, setAlbumCoverPreviewUrl] = useState("");
  const [isAlbumCoverPreviewLoading, setIsAlbumCoverPreviewLoading] = useState(false);
  const [artistProfilePreviewUrl, setArtistProfilePreviewUrl] = useState("");
  const [isArtistProfilePreviewLoading, setIsArtistProfilePreviewLoading] = useState(false);

  const offset = page * rowsPerPage;
  const { data, loading, error, refetch } = useQuery(ADMIN_SONGS, {
    variables: {
      limit: rowsPerPage,
      offset,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const adminSongs = data?.adminSongs;
  const rows = useMemo(() => adminSongs?.songs ?? [], [adminSongs?.songs]);
  const numberedRows = useMemo(
    () =>
      rows.map((song, index) => ({
        ...song,
        rowNumber: offset + index + 1,
      })),
    [offset, rows]
  );
  const totalSongs = Number(adminSongs?.totalCount) || 0;
  const visibleRowsCount = numberedRows.length;
  const rangeFrom = visibleRowsCount ? offset + 1 : 0;
  const rangeTo = offset + visibleRowsCount;
  const canGoPrevious = page > 0;
  const canGoNext = totalSongs ? rangeTo < totalSongs : Boolean(adminSongs?.hasNextPage);

  useEffect(() => {
    let isActive = true;

    const loadArtworkPreview = async () => {
      const artworkKey = decodeS3Path(selectedSong?.artwork);

      if (!selectedSong || dialogMode === "edit" || !artworkKey) {
        setArtworkPreviewUrl("");
        setIsArtworkPreviewLoading(false);
        return;
      }

      setIsArtworkPreviewLoading(true);

      try {
        const { data: presignData } = await getPresignedUrlDownload({
          variables: {
            bucket: SONG_ARTWORK_BUCKET,
            key: artworkKey,
            region: SONG_ARTWORK_REGION,
          },
        });

        if (isActive) {
          setArtworkPreviewUrl(presignData?.getPresignedUrlDownload?.url || "");
        }
      } catch (artworkError) {
        console.error("Failed to presign song artwork:", artworkError);

        if (isActive) {
          setArtworkPreviewUrl("");
        }
      } finally {
        if (isActive) {
          setIsArtworkPreviewLoading(false);
        }
      }
    };

    loadArtworkPreview();

    return () => {
      isActive = false;
    };
  }, [dialogMode, getPresignedUrlDownload, selectedSong]);

  useEffect(() => {
    let isActive = true;

    const loadAlbumCoverPreview = async () => {
      const albumCoverKey = decodeS3Path(selectedSong?.album?.albumCoverImage);

      if (!selectedSong || dialogMode === "edit" || isSingleSong(selectedSong) || !albumCoverKey) {
        setAlbumCoverPreviewUrl("");
        setIsAlbumCoverPreviewLoading(false);
        return;
      }

      setIsAlbumCoverPreviewLoading(true);

      try {
        const { data: presignData } = await getPresignedUrlDownload({
          variables: {
            bucket: ALBUM_COVER_BUCKET,
            key: albumCoverKey,
            region: ALBUM_COVER_REGION,
          },
        });

        if (isActive) {
          setAlbumCoverPreviewUrl(presignData?.getPresignedUrlDownload?.url || "");
        }
      } catch (albumCoverError) {
        console.error("Failed to presign album cover:", albumCoverError);

        if (isActive) {
          setAlbumCoverPreviewUrl("");
        }
      } finally {
        if (isActive) {
          setIsAlbumCoverPreviewLoading(false);
        }
      }
    };

    loadAlbumCoverPreview();

    return () => {
      isActive = false;
    };
  }, [dialogMode, getPresignedUrlDownload, selectedSong]);

  useEffect(() => {
    let isActive = true;

    const loadArtistProfilePreview = async () => {
      const artistProfileKey = decodeS3Path(selectedSong?.artist?.profileImage);

      if (!selectedSong || dialogMode === "edit" || !artistProfileKey) {
        setArtistProfilePreviewUrl("");
        setIsArtistProfilePreviewLoading(false);
        return;
      }

      setIsArtistProfilePreviewLoading(true);

      try {
        const { data: presignData } = await getPresignedUrlDownload({
          variables: {
            bucket: ARTIST_PROFILE_BUCKET,
            key: artistProfileKey,
            region: ARTIST_PROFILE_REGION,
          },
        });

        if (isActive) {
          setArtistProfilePreviewUrl(presignData?.getPresignedUrlDownload?.url || "");
        }
      } catch (artistProfileError) {
        console.error("Failed to presign artist profile image:", artistProfileError);

        if (isActive) {
          setArtistProfilePreviewUrl("");
        }
      } finally {
        if (isActive) {
          setIsArtistProfilePreviewLoading(false);
        }
      }
    };

    loadArtistProfilePreview();

    return () => {
      isActive = false;
    };
  }, [dialogMode, getPresignedUrlDownload, selectedSong]);

  const handleRowsPerPageChange = (nextRowsPerPage) => {
    setRowsPerPage(nextRowsPerPage);
    setPage(0);
  };

  const handleNextPage = () => {
    if (!canGoNext) return;
    setPage((currentPage) => currentPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((currentPage) => Math.max(0, currentPage - 1));
  };
  const handlePreviewSong = (song) => {
    setDialogMode("preview");
    setSelectedSong(song);


  };

  const handleEditSong = (song) => {
    setDialogMode("edit");
    setSelectedSong(song);
  };

  const handlePlaySong = async (song) => {
    const songId = getSongId(song);
    const audioSource = getSongAudioSource(song);

    if (!songId || !audioSource?.key) {
      console.warn("Song playback is missing an audio source.", {
        songId,
        title: song?.title,
        audioFileUrl: song?.audioFileUrl,
        streamAudioFileUrl: song?.streamAudioFileUrl,
        premiumStreamAudioFileUrl: song?.premiumStreamAudioFileUrl,
      });
      setAudioError(
        `${getSongLabel(song)} does not have an audio file ready for playback yet.`
      );
      return;
    }

    setAudioError("");
    setAudioLoadingSongId(songId);

    try {
      const { data: presignData } = await getPresignedUrlDownload({
        variables: {
          bucket: audioSource.bucket,
          key: audioSource.key,
          region: audioSource.region,
        },
      });

      const audioUrl = presignData?.getPresignedUrlDownload?.url;

      if (!audioUrl) {
        throw new Error("Could not create an audio playback URL.");
      }

      setAudioUrls((currentUrls) => ({
        ...currentUrls,
        [songId]: audioUrl,
      }));
      setPlayingSongId(songId);
    } catch (playError) {
      console.error("Failed to presign song audio:", playError);
      setAudioError(playError.message || "Unable to prepare this song for playback.");
    } finally {
      setAudioLoadingSongId(null);
    }
  };

  const columns = useMemo(
    () =>
      getColumns({
        audioLoadingSongId,
        audioUrls,
        onPreviewSong: handlePreviewSong,
        onPlaySong: handlePlaySong,
        onEditSong: handleEditSong,
        playingSongId,
        setPlayingSongId,
      }),
    [audioLoadingSongId, audioUrls, playingSongId]
  );
  const isDetailOpen = Boolean(selectedSong);
  const isEditMode = dialogMode === "edit";

  return (
    <Box
      sx={{
        flex: "1 0 auto",
        alignSelf: "stretch",
        width: "100%",
        minHeight: "100dvh",
        p: 3,
        backgroundColor: brand.colors.dark,
        backgroundImage: brand.gradients.dashboard,
        color: brand.colors.textPrimary,
        fontFamily: brand.typography.fontFamily,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mt: 2,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ color: brand.colors.accent, fontWeight: 800, letterSpacing: 0 }}
          >
            {brand.productName}
          </Typography>
          <Typography variant="h5" fontWeight={800}>
            All Songs
          </Typography>
        </Box>

        <Box sx={{ ...brandPanelSx, px: 2, py: 1, minWidth: 132 }}>
          <Typography variant="caption" sx={{ color: brand.colors.textMuted }}>
            Total Songs
          </Typography>
          <Typography variant="h6" fontWeight={800} sx={{ color: brand.colors.accent }}>
            {totalSongs.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          Failed to load songs: {error.message}
        </Alert>
      ) : null}

      {audioError ? (
        <Alert severity="warning" sx={{ mt: 3 }} onClose={() => setAudioError("")}>
          {audioError}
        </Alert>
      ) : null}

      <Card
        sx={{
          mt: 3,
          background: brand.colors.cardSurface,
          border: `1px solid ${brand.colors.cardBorder}`,
          borderRadius: brand.radius.md,
          boxShadow: brand.shadow.md,
          backdropFilter: "blur(10px)",
        }}
      >
        <CardContent sx={{ ...brandCardContentSx, p: { xs: 1.5, sm: 2 } }}>
          <DataGrid
            autoHeight
            rows={numberedRows}
            columns={columns}
            loading={loading}
            getRowId={getSongId}
            disableRowSelectionOnClick
            hideFooter
            slots={{
              toolbar: GridToolbar,
              loadingOverlay: LinearProgress,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 400 },
              },
              basePopper: {
                sx: {
                  "& .MuiPaper-root": {
                    backgroundColor: brand.colors.cardSolidSurface,
                    backgroundImage: "none",
                    color: brand.colors.textPrimary,
                    border: `1px solid ${brand.colors.cardBorder}`,
                  },
                  "& .MuiMenuItem-root, & .MuiTypography-root": {
                    color: brand.colors.textPrimary,
                  },
                },
              },
            }}
            sx={{
              border: "none",
              backgroundColor: brand.colors.cardSolidSurface,
              color: brand.colors.textPrimary,
              fontFamily: brand.typography.fontFamily,
              "& .MuiDataGrid-main, & .MuiDataGrid-virtualScroller, & .MuiDataGrid-virtualScrollerContent, & .MuiDataGrid-virtualScrollerRenderZone": {
                backgroundColor: brand.colors.cardSolidSurface,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: brand.colors.surfaceRaised,
                color: brand.colors.textPrimary,
                borderBottom: `1px solid ${brand.colors.cardBorder}`,
              },
              "& .MuiDataGrid-topContainer, & .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderTitleContainer": {
                backgroundColor: `${brand.colors.surfaceRaised} !important`,
                color: `${brand.colors.textPrimary} !important`,
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: brand.colors.textPrimary,
                fontWeight: 800,
              },
              "& .MuiDataGrid-cell": {
                color: brand.colors.textPrimary,
                backgroundColor: brand.colors.cardSolidSurface,
                borderBottom: `1px solid ${brand.colors.cardBorder}`,
              },
              "& .MuiDataGrid-row": {
                backgroundColor: brand.colors.cardSolidSurface,
              },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: brand.colors.cardSolidSurface,
                color: brand.colors.textSecondary,
                borderTop: `1px solid ${brand.colors.cardBorder}`,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: brand.colors.accentSoft,
              },
              "& .MuiDataGrid-toolbarContainer": {
                px: 1,
                py: 1.25,
                backgroundColor: brand.colors.cardSolidSurface,
                borderBottom: `1px solid ${brand.colors.cardBorder}`,
              },
              "& .MuiButtonBase-root": {
                color: brand.colors.accent,
                textTransform: "none",
                fontWeight: 700,
              },
              "& .song-title-button, & .song-title-button:hover, & .song-title-button span": {
                color: `${brand.colors.textPrimary} !important`,
              },
              "& .MuiInputBase-root": {
                color: brand.colors.textPrimary,
                backgroundColor: brand.colors.cardSurface,
                borderRadius: brand.radius.md,
                px: 1,
              },
              "& .MuiInputBase-input": {
                color: brand.colors.textPrimary,
              },
              "& .MuiInputBase-input::placeholder": {
                color: brand.colors.textMuted,
                opacity: 1,
              },
              "& .MuiSvgIcon-root": {
                color: brand.colors.accent,
              },
              "& .MuiTablePagination-select, & .MuiTablePagination-actions": {
                color: brand.colors.textPrimary,
              },
              "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: brand.colors.textSecondary,
              },
              "& .MuiDataGrid-overlay": {
                color: brand.colors.textSecondary,
                background: brand.colors.cardSolidSurface,
              },
              "& .MuiLinearProgress-root": {
                backgroundColor: brand.colors.accentSoft,
              },
              "& .MuiLinearProgress-bar": {
                background: brand.gradients.accent,
              },
            }}
          />
          <SongsListControls
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            from={rangeFrom}
            loading={loading}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPage={rowsPerPage}
            to={rangeTo}
            totalRows={totalSongs}
          />
        </CardContent>
      </Card>

      <Dialog
        open={isDetailOpen}
        onClose={() => setSelectedSong(null)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            background: brand.colors.surface,
            color: brand.colors.textPrimary,
            border: `1px solid ${brand.colors.cardBorder}`,
            borderRadius: brand.radius.md,
            maxHeight: "92vh",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            fontWeight: 800,
            backgroundColor: brand.colors.surface,
            color: brand.colors.textPrimary,
            borderBottom: `1px solid ${brand.colors.cardBorder}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <MusicNoteIcon sx={{ color: brand.colors.accent, flexShrink: 0 }} />
            <Typography
              component="span"
              sx={{
                color: brand.colors.textPrimary,
                fontWeight: 800,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {isEditMode ? "Edit Song" : selectedSong?.title || "Song Details"}
            </Typography>
          </Box>
          {!isEditMode && selectedSong ? (
            <Button
              startIcon={<EditIcon />}
              onClick={() => setDialogMode("edit")}
              sx={{ ...brandOutlinedButtonSx, flexShrink: 0 }}
            >
              Edit song
            </Button>
          ) : null}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            backgroundColor: brand.colors.surface,
            color: brand.colors.textPrimary,
            borderColor: brand.colors.cardBorder,
            minHeight: { xs: 480, sm: 620 },
            "&::-webkit-scrollbar-track": {
              background: brand.colors.dark,
            },
            "&::-webkit-scrollbar-thumb": {
              background: brand.colors.borderStrong,
            },
          }}
        >
          {selectedSong && isEditMode ? (
            <MetadataEdit
              song={selectedSong}
              songId={getSongId(selectedSong)}
              artistId={selectedSong.artist?._id}
              onClose={() => setSelectedSong(null)}
              refetch={refetch}
            />
          ) : selectedSong ? (
            <Stack spacing={2}>

              {/* Song details */}
              <DetailSection title="Song Details">
                <Box
                  sx={{
                    gridColumn: { xs: "1", sm: "1 / -1" },
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 112,
                      height: 112,
                      flex: "0 0 112px",
                      borderRadius: brand.radius.md,
                      border: `1px solid ${brand.colors.cardBorder}`,
                      backgroundColor: brand.colors.cardSurface,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {isArtworkPreviewLoading ? (
                      <CircularProgress size={28} sx={{ color: brand.colors.accent }} />
                    ) : artworkPreviewUrl ? (
                      <Box
                        component="img"
                        src={artworkPreviewUrl}
                        alt={`${selectedSong.title || "Song"} thumbnail`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <MusicNoteIcon sx={{ color: brand.colors.textMuted, fontSize: 40 }} />
                    )}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: brand.colors.label,
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      Title
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: brand.colors.textPrimary, fontWeight: 800 }}
                    >
                      {selectedSong.title || "Untitled song"}
                    </Typography>
                  </Box>
                </Box>
              <Divider sx={{ gridColumn: { xs: "1", sm: "1 / -1" }, borderColor: brand.colors.cardBorder }} />

              
                <DetailItem label="Visibility" value={selectedSong.visibility} />
                <DetailItem label="Genre" value={formatList(selectedSong.genre)} />
                <DetailItem label="Mood" value={formatList(selectedSong.mood)} />
                <DetailItem label="Sub Moods" value={formatList(selectedSong.subMoods)} />
                <DetailItem label="Label" value={selectedSong.label} />
                <DetailItem label="Track Number" value={selectedSong.trackNumber} />
                <DetailItem label="Release Date" value={formatDate(selectedSong.releaseDate)} />
                <DetailItem label="Created" value={formatDate(selectedSong.createdAt)} />
              </DetailSection>

              {/* Album details */}
              <DetailSection title="Album">
                {isSingleSong(selectedSong) ? (
                  <Typography
                    sx={{
                      gridColumn: "1 / -1",
                      color: brand.colors.textSecondary,
                      fontWeight: 700,
                    }}
                  >
                    This Song is Single, it does not have an Album it belongs too.
                  </Typography>
                ) : (
                  <>
                    <Box
                      sx={{
                        gridColumn: { xs: "1", sm: "1 / -1" },
                        display: "flex",
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 112,
                          height: 112,
                          flex: "0 0 112px",
                          borderRadius: brand.radius.md,
                          border: `1px solid ${brand.colors.cardBorder}`,
                          backgroundColor: brand.colors.cardSurface,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {isAlbumCoverPreviewLoading ? (
                          <CircularProgress size={28} sx={{ color: brand.colors.accent }} />
                        ) : albumCoverPreviewUrl ? (
                          <Box
                            component="img"
                            src={albumCoverPreviewUrl}
                            alt={`${selectedSong.album?.title || "Album"} cover`}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <MusicNoteIcon sx={{ color: brand.colors.textMuted, fontSize: 40 }} />
                        )}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: brand.colors.label,
                            fontWeight: 800,
                            textTransform: "uppercase",
                          }}
                        >
                          Album Cover
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: brand.colors.textPrimary, fontWeight: 800 }}
                        >
                          {selectedSong.album?.title || "-"}
                        </Typography>
                      </Box>
                    </Box>
                    <DetailItem label="Title" value={selectedSong.album?.title} />
                    <DetailItem
                      label="Release Date"
                      value={formatDate(selectedSong.album?.releaseDate)}
                    />
                  </>
                )}
              </DetailSection>

              {/* Files details */}
              <DetailSection title="Files">
                <DetailItem label="Artwork" value={selectedSong.artwork} href={selectedSong.artwork} />
                <DetailItem
                  label="Audio File"
                  value={selectedSong.audioFileUrl}
                  href={selectedSong.audioFileUrl}
                />
                <DetailItem
                  label="Stream Audio"
                  value={selectedSong.streamAudioFileUrl}
                  href={selectedSong.streamAudioFileUrl}
                />
                <DetailItem
                  label="Premium Stream Audio"
                  value={selectedSong.premiumStreamAudioFileUrl}
                  href={selectedSong.premiumStreamAudioFileUrl}
                />
              </DetailSection>

              {/* Credits details */}
              <DetailSection title="Credits">
                <DetailItem label="Producer Name" value={selectedSong.producer?.name} />
                <DetailItem label="Producer Role" value={selectedSong.producer?.role} />
                <DetailItem label="Composer Name" value={selectedSong.composer?.name} />
                <DetailItem
                  label="Composer Contribution"
                  value={selectedSong.composer?.contribution}
                />
              </DetailSection>




              <Box sx={{ ...brandPanelSx, p: 2 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                  Lyrics
                </Typography>

                <Divider sx={{ borderColor: brand.colors.cardBorder, mb: 1.5 }} />
                <Typography
                  sx={{
                    color: brand.colors.textSecondary,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {selectedSong.lyrics || "No lyrics provided."}
                </Typography>
              </Box>

              {/* Artist details */}
              <DetailSection title="Artist">
                <Box
                  sx={{
                    gridColumn: { xs: "1", sm: "1 / -1" },
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 112,
                      height: 112,
                      flex: "0 0 112px",
                      borderRadius: "50%",
                      border: `1px solid ${brand.colors.cardBorder}`,
                      backgroundColor: brand.colors.cardSurface,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {isArtistProfilePreviewLoading ? (
                      <CircularProgress size={28} sx={{ color: brand.colors.accent }} />
                    ) : artistProfilePreviewUrl ? (
                      <Box
                        component="img"
                        src={artistProfilePreviewUrl}
                        alt={`${selectedSong.artist?.artistAka || "Artist"} profile`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <MusicNoteIcon sx={{ color: brand.colors.textMuted, fontSize: 40 }} />
                    )}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: brand.colors.label,
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      Artist Image
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: brand.colors.textPrimary, fontWeight: 800 }}
                    >
                      {selectedSong.artist?.artistAka || selectedSong.artist?.fullName || "-"}
                    </Typography>
                  </Box>
                </Box>
                <DetailItem label="Stage Name" value={selectedSong.artist?.artistAka} />
                <DetailItem label="Full Name" value={selectedSong.artist?.fullName} />
                <DetailItem label="Email" value={selectedSong.artist?.email} />
                <DetailItem label="Country" value={selectedSong.artist?.country} />
              </DetailSection>



            </Stack>


          ) : null}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            backgroundColor: brand.colors.surface,
            borderTop: `1px solid ${brand.colors.cardBorder}`,
          }}
        >
          <Button onClick={() => setSelectedSong(null)} sx={brandOutlinedButtonSx}>
            Close
          </Button>
        </DialogActions>


      </Dialog>
    </Box>
  );
}
