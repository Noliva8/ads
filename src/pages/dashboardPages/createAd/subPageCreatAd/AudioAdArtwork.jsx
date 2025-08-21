import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router";
import {
  Box, Button, Card, CardContent, Chip, IconButton,
  Typography, LinearProgress, Alert,CircularProgress, Avatar, Stack
} from "@mui/material";
import Modal from '@mui/material/Modal';

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import FileUpload from "@mui/icons-material/FileUpload";
import { tokens } from "../../../../theme";
import { AD_ARTWORK_UPLOAD } from "../../../../utils/mutation";
import { useFormContext} from "react-hook-form";


const MAX_IMAGE_MB = 10; // 10 MB per your guidance
const VALID_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);



export default function AudioAdArtwork({ ad, onComplete, setSteps}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [useFallback, setUseFallback] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState(""); 
  const imageInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const Navigate = useNavigate();

    const { reset } = useFormContext();



  const [uploadArtwork, { loading: isUploading }] = useMutation( AD_ARTWORK_UPLOAD);
  const adId = ad?.id ?? ad?.ad?.id ?? null;

  // preview url cleanup
  useEffect(() => {
    if (!file) { setPreviewUrl(""); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const validateFile = (f) => {
    if (!f) return "No file selected.";
    if (!VALID_TYPES.has(f.type)) return "Only JPG, PNG, or WEBP are allowed.";
    if (f.size > MAX_IMAGE_MB * 1024 * 1024) return `Max size is ${MAX_IMAGE_MB}MB.`;
    return null;
  };

  const checkSquare = (blob) =>
    new Promise((resolve) => {
      const u = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        URL.revokeObjectURL(u);
        resolve(Math.abs(ratio - 1) < 0.03); // ~±3% tolerance
      };
      img.onerror = () => { URL.revokeObjectURL(u); resolve(true); };
      img.src = u;
    });

  const takeFile = async (f) => {
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setError("");
    setUseFallback(false);
    setProgress(0);

    // warn (non-block) if not square
    const isSquare = await checkSquare(f);
    setWarning(isSquare ? "" : "Your image isn’t square. We’ll auto-crop to 1:1; keep key content centered.");

    setFile(f);
  };

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (f) void takeFile(f);
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl("");
    setProgress(0);
    setError("");
    setWarning("");
    setIsLoading(true);
    imageInputRef.current && (imageInputRef.current.value = "");
  };

  const handleUseFallback = () => {
    setUseFallback(true);
    handleRemove();
  };

  const handleSubmit = async () => {
    if (!adId) { setError("Missing ad id."); return; }

    if (useFallback) {
      onComplete?.({ success: true, usedFallback: true });
      setSteps?.(4);
      return;
    }
    if (!file) { setError("Select an image or choose default artwork."); return; }

    setError("");
    setProgress(20);

    try {
      const { data } = await uploadArtwork({ variables: { adId, file } });
      setProgress(100);
      onComplete?.(data?.audioArtworkUpload);
       setIsSuccessModalOpen(true);
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
    if (f) void takeFile(f);
  };

   const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    Navigate('/dashboard')
    
  };

  const handleCreateNewAD = () => {
          setIsSuccessModalOpen(false);
          setSteps(0)
   reset();

  }

  return (
 <Box sx={{ width: "100%" }}>
  <Card
    sx={{
      p: 3, width: "100%", minHeight: 560,
      backgroundColor: colors.blackNeutral[600],
      borderRadius: "12px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    }}
  >
    {isLoading ? (
      // Loading State
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400 }}>
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ color: colors.orangeAccent[400], mb: 3 }}
          />
          <Typography 
            variant="h6" 
            sx={{ color: colors.graySoft[300], textAlign: 'center' }}
          >
            Processing your artwork...
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: colors.graySoft[500], textAlign: 'center', mt: 1 }}
          >
            This may take a few moments
          </Typography>
        </Box>
      </CardContent>
    ) : (
      // Normal State
      <CardContent>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ color: colors.graySoft[100], fontWeight: 600, mb: 2, textAlign: "center" }}
        >
          Upload Ad Artwork
        </Typography>

        {/* Your guidance block */}
        <Typography variant="body2" sx={{ 
          color: colors.graySoft[300], 
          textAlign: 'center', 
          mb: 3,
          px: 2 
        }}>
          <Box component="span" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
            Upload a <strong>square image (1200×1200px)</strong>
          </Box>
          • Non-square images will be <strong>automatically cropped</strong> to fit<br />
          • Keep important content <strong>centered</strong> to avoid clipping<br />
          • Max file size: <strong>1MB</strong> (JPG, PNG, or WEBP)
        </Typography>

        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && imageInputRef.current?.click()}
          sx={{
            border: `2px dashed ${isDragging ? colors.orangeAccent[400] : colors.orangeAccent[200]}`,
            borderRadius: "12px",
            p: 4,
            mb: 2,
            textAlign: "center",
            backgroundColor: isDragging ? "rgba(255,152,0,0.05)" : "transparent",
            transition: "all 0.3s ease",
            cursor: isUploading ? "not-allowed" : "pointer",
            opacity: isUploading ? 0.7 : 1,
            "&:hover": { borderColor: colors.orangeAccent[400] },
          }}
        >
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handleImageChange}
            disabled={isUploading}
          />

          {isUploading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress 
                size={48} 
                sx={{ color: colors.orangeAccent[400], mb: 2 }} 
              />
              <Typography variant="h6" sx={{ color: colors.graySoft[100], mb: 1 }}>
                Uploading...
              </Typography>
              <Typography variant="body1" sx={{ color: colors.graySoft[300] }}>
                Please wait while we process your image
              </Typography>
            </Box>
          ) : (
            <>
              <CloudUploadIcon sx={{ fontSize: 48, color: colors.orangeAccent[400], mb: 2 }} />
              <Typography variant="h6" sx={{ color: colors.graySoft[100], mb: 1 }}>
                Drag & drop your artwork here
              </Typography>
              <Typography variant="body1" sx={{ color: colors.graySoft[300], mb: 2 }}>
                or click to browse files
              </Typography>

              <Button
                variant="contained"
                disabled={isUploading}
                onClick={(e) => { e.stopPropagation(); imageInputRef.current?.click(); }}
                startIcon={<FileUpload />}
                sx={{ backgroundColor: colors.orangeAccent[500], "&:hover": { backgroundColor: colors.orangeAccent[600] } }}
              >
                Select Image
              </Button>
            </>
          )}
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mt: 2, background: colors.blackNeutral[500], color: colors.graySoft[100] }}>
            {error}
          </Alert>
        )}
        {warning && !error && (
          <Alert severity="info" sx={{ mt: 2, background: colors.blackNeutral[500], color: colors.graySoft[100] }}>
            {warning}
          </Alert>
        )}

        {(file || useFallback) && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: colors.blackNeutral[500], borderRadius: "8px", position: "relative" }}>
            {!useFallback && (
              <IconButton
                onClick={handleRemove}
                disabled={isUploading}
                sx={{ position: "absolute", right: 8, top: 8, color: colors.graySoft[400] }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}

            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                variant="rounded"
                src={useFallback ? undefined : previewUrl}
                sx={{ width: 80, height: 80 }}
              >
                <ImageIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ color: colors.graySoft[100] }}>
                  {useFallback ? "Using Default Artwork" : file?.name}
                </Typography>
                {!useFallback && file && (
                  <Typography variant="body2" sx={{ color: colors.graySoft[300] }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                )}
              </Box>
            </Stack>

            {!useFallback && isUploading && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(progress, 15)}
                  sx={{
                    height: 6, borderRadius: 3, mt: 2,
                    backgroundColor: colors.blackNeutral[400],
                    "& .MuiLinearProgress-bar": { backgroundColor: colors.orangeAccent[400] },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ display: "block", textAlign: "right", mt: 1, color: colors.graySoft[300] }}
                >
                  {Math.round(Math.max(progress, 15))}% uploaded
                </Typography>
              </>
            )}
          </Box>
        )}

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="text"
            onClick={handleUseFallback}
            disabled={useFallback || isUploading}
            sx={{ color: colors.orangeAccent[400], "&:disabled": { color: colors.graySoft[500] } }}
          >
            {useFallback ? "Using Default Artwork" : "Use Default Artwork Instead"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, pt: 2, borderTop: `1px solid ${colors.blackNeutral[400]}` }}>
          <Button
            startIcon={<HelpCenterIcon />}
            sx={{ color: colors.graySoft[300], "&:hover": { color: colors.orangeAccent[400] } }}
            onClick={() => window.open("/help/ads/artwork", "_blank")}
          >
            Help Center
          </Button>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleRemove}
              disabled={isUploading}
              sx={{ color: colors.graySoft[100], borderColor: colors.graySoft[500], "&:hover": { borderColor: colors.graySoft[400] } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isUploading || (!file && !useFallback)}
              startIcon={isUploading ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : null}
              sx={{
                backgroundColor: colors.orangeAccent[500],
                "&:hover": { backgroundColor: colors.orangeAccent[600] },
                "&:disabled": { backgroundColor: colors.graySoft[700], color: colors.graySoft[500] },
                minWidth: 140
              }}
            >
              {isUploading ? "Uploading…" : "Submit & Continue"}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
          <Chip label="JPG • PNG • WEBP" variant="outlined" sx={{ color: colors.graySoft[300], borderColor: colors.graySoft[700] }} />
          <Chip label={`Max ${MAX_IMAGE_MB}MB`} variant="outlined" sx={{ color: colors.graySoft[300], borderColor: colors.graySoft[700] }} />
          <Chip label="Square 1200×1200 (1:1)" variant="outlined" sx={{ color: colors.graySoft[300], borderColor: colors.graySoft[700] }} />
        </Box>
      </CardContent>
    )}
  </Card>


     <SuccessAdModal 
        open={isSuccessModalOpen} 
        onClose={handleCloseModal} 
        handleCreateNewAD={handleCreateNewAD}
        
      />
</Box>
  );
}





const SuccessAdModal = ({ open, onClose, handleCreateNewAD }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxWidth: '90vw',
    bgcolor: colors.blackNeutral[600],
    borderRadius: '12px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    p: 0,
    outline: 'none'
  };

 

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
      sx={{ backdropFilter: 'blur(4px)' }}
    >
      <Card sx={modalStyle}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          borderBottom: `1px solid ${colors.blackNeutral[400]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography 
            id="success-modal-title" 
            variant="h4" 
            component="h2"
            sx={{ 
              color: colors.graySoft[100], 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CheckCircleIcon sx={{ color: colors.greenAccent[500], fontSize: 32 }} />
            Ad Created Successfully!
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ color: colors.graySoft[400] }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography 
            id="success-modal-description" 
            sx={{ 
              mt: 2, 
              color: colors.graySoft[300],
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}
          >
            Thank you for choosing Afrofeel! Your advertisement has been successfully 
            created and is now in our review queue.
          </Typography>
          
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            backgroundColor: colors.blackNeutral[500],
            borderRadius: '8px',
            borderLeft: `4px solid ${colors.orangeAccent[500]}`
          }}>
            <Typography sx={{ color: colors.graySoft[200], fontWeight: 500 }}>
              📧 What's Next?
            </Typography>
            <Typography sx={{ color: colors.graySoft[300], mt: 1, fontSize: '0.95rem' }}>
              You'll receive an email notification once your ad is approved and 
              we'll notify you when it starts running.
            </Typography>
          </Box>

          <Box sx={{ 
            mt: 3, 
            display: 'flex', 
            gap: 1,
            flexDirection: 'column'
          }}>
            <Typography variant="body2" sx={{ color: colors.graySoft[400] }}>
              ⏰ Typical review time: 24-48 hours
            </Typography>
            <Typography variant="body2" sx={{ color: colors.graySoft[400] }}>
              📞 Need help? Contact support@afrofeel.com
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ 
          p: 3, 
          borderTop: `1px solid ${colors.blackNeutral[400]}`,
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 2
        }}>


          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: colors.graySoft[300],
              borderColor: colors.graySoft[600],
              '&:hover': {
                borderColor: colors.graySoft[400],
                backgroundColor: colors.blackNeutral[500]
              }
            }}
          >
            View My Ads
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateNewAD}
            sx={{
              backgroundColor: colors.orangeAccent[500],
              '&:hover': {
                backgroundColor: colors.orangeAccent[600]
              }
            }}
          >
            Create Another Ad
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};


