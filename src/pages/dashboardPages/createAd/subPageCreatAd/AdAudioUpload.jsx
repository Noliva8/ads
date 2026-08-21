import React, { useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useMutation, gql } from "@apollo/client";
import {
  Box, Button, Card, CardContent, Chip, IconButton,
  Typography, LinearProgress, Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import FileUpload from "@mui/icons-material/FileUpload";
import { tokens } from "../../../../theme";
import { AUDIO_AD_UPLOAD } from "../../../../utils/mutation"; // uses mutation below
import { brand, brandCardSx, brandOutlinedButtonSx, brandPanelSx, brandPrimaryButtonSx } from "../../../../brand";

const MAX_AUDIO_MB = 10;
const VALID_TYPES = new Set([
  "audio/mpeg","audio/wav","audio/aac","audio/mp4",
  "audio/x-m4a","audio/flac","audio/ogg","audio/opus","audio/webm",
]);

export default function AdAudioUpload({ ad, onComplete, setSteps}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0); // visual only
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const audioInputRef = useRef(null);

  const [audioAdUpload, { loading: isUploading }] = useMutation(AUDIO_AD_UPLOAD);

  const adId = ad?.id ?? ad?.ad?.id ?? null;

  const validateFile = (f) => {
    if (!f) return "No file selected.";
    if (!(VALID_TYPES.has(f.type))) {
      return "Please upload a valid audio file (MP3, WAV, AAC/M4A, FLAC, OGG, OPUS, WEBM).";
    }
    if (f.size > MAX_AUDIO_MB * 1024 * 1024) {
      return `File size exceeds ${MAX_AUDIO_MB}MB limit.`;
    }
    return null;
  };

  const handleAudioChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setError("");
    setFile(f);
    setProgress(0);
  };

  const handleRemove = () => {
    setFile(null);
    setProgress(0);
    setError("");
    if (audioInputRef.current) audioInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!adId) { setError("Missing ad id."); return; }
    if (!file) { setError("Please select an audio file first."); return; }

    setError("");
    setProgress(20); // start visual progress

    try {
      // Kick off mutation (apollo-upload-client will send multipart/form-data)
      const { data } = await audioAdUpload({
        variables: { adId, file },
      });

      // Finish progress & notify parent
      setProgress(100);
      onComplete?.(data?.audioAdUpload);
     setSteps(3)
    } catch (e) {
      console.error(e);
      setProgress(0);
      setError(e?.message || "Upload failed. Please try again.");
    }
  };

  // DnD
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setError("");
    setFile(f);
    setProgress(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Card
        sx={{
          ...brandCardSx,
          width: "100%",
          minHeight: 560,
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ color: colors.graySoft[100], fontWeight: 600, mb: 3, textAlign: "center" }}
          >
            Upload Audio Advert
          </Typography>

          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && audioInputRef.current?.click()}
            sx={{
              ...brandPanelSx,
              border: `2px dashed ${isDragging ? brand.colors.accent : brand.colors.cardBorder}`,
              p: 4,
              mb: 2,
              textAlign: "center",
              backgroundColor: isDragging ? brand.colors.accentSoft : "transparent",
              transition: "all 0.3s ease",
              cursor: isUploading ? "not-allowed" : "pointer",
              opacity: isUploading ? 0.7 : 1,
              "&:hover": { borderColor: brand.colors.accent },
            }}
          >
            <input
              ref={audioInputRef}
              type="file"
              accept=".mp3,.wav,.aac,.m4a,.flac,.ogg,.opus,.webm,audio/*"
              hidden
              onChange={handleAudioChange}
              disabled={isUploading}
            />

            <CloudUploadIcon sx={{ fontSize: 48, color: brand.colors.accent, mb: 2 }} />
            <Typography variant="h6" sx={{ color: colors.graySoft[100], mb: 1 }}>
              Drag and drop your audio here
            </Typography>
            <Typography variant="body1" sx={{ color: colors.graySoft[300], mb: 2 }}>
              or click to browse files
            </Typography>

            <Button
              variant="contained"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                audioInputRef.current?.click();
              }}
              startIcon={<FileUpload />}
              sx={brandPrimaryButtonSx}
            >
              Select File
            </Button>
          </Box>

          {error && (
            <Alert severity="warning" sx={{ mt: 2, background: brand.colors.cardSurface, color: colors.graySoft[100] }}>
              {error}
            </Alert>
          )}

          {file && (
            <Box sx={{ ...brandPanelSx, mt: 3, p: 2, position: "relative" }}>
              <IconButton
                onClick={handleRemove}
                disabled={isUploading}
                sx={{ position: "absolute", right: 8, top: 8, color: colors.graySoft[400] }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AudiotrackIcon sx={{ color: brand.colors.accent, mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ color: colors.graySoft[100] }}>
                    {file.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.graySoft[300] }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={isUploading ? Math.max(progress, 15) : progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: brand.colors.cardBorder,
                  "& .MuiLinearProgress-bar": { backgroundColor: brand.colors.accent },
                }}
              />
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "right", mt: 1, color: colors.graySoft[300] }}
              >
                {Math.round(isUploading ? Math.max(progress, 15) : progress)}% uploaded
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, pt: 2, borderTop: `1px solid ${brand.colors.cardBorder}` }}>
            <Button
              startIcon={<HelpCenterIcon />}
              sx={{ color: colors.graySoft[300], "&:hover": { color: brand.colors.accent } }}
              onClick={() => window.open("/help/ads/audio", "_blank")}
            >
              Help Center
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleRemove}
                disabled={isUploading}
                sx={brandOutlinedButtonSx}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!file || isUploading}   
                sx={{
                  ...brandPrimaryButtonSx,
                  "&:disabled": { backgroundColor: colors.graySoft[700], color: colors.graySoft[500] },
                }}
              >
                {isUploading ? "Uploading…" : "Submit & Continue"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
