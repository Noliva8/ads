// NO Grid import here – parent owns the grid row/width

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Chip
} from "@mui/material";
import FileUpload from '@mui/icons-material/FileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../../theme";
import { useState, useCallback, useRef } from "react";
import { brand, brandCardSx, brandOutlinedButtonSx, brandPanelSx, brandPrimaryButtonSx } from "../../../../brand";

export default function AdBannerUpload() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      simulateUpload(selectedFile);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type === 'image/jpeg' || droppedFile.type === 'image/png')) {
      setFile(droppedFile);
      simulateUpload(droppedFile);
    }
  }, []);

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    if (inputRef.current) inputRef.current.value = null;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Card
        sx={{
          ...brandCardSx,
          width: '100%',
          minHeight: 560, // gives presence; adjust as you like
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              color: colors.graySoft[100],
              fontWeight: 600,
              mb: 4,
              textAlign: 'center'
            }}
          >
            Upload Advert Banner
          </Typography>

          {/* Upload Area (full area clickable) */}
          <Box
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              ...brandPanelSx,
              border: `2px dashed ${isDragging ? brand.colors.accent : brand.colors.cardBorder}`,
              p: 4,
              mb: 2,
              textAlign: 'center',
              backgroundColor: isDragging ? brand.colors.accentSoft : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': { borderColor: brand.colors.accent }
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png, image/jpeg"
              hidden
              onChange={handleFileChange}
            />
            <CloudUploadIcon
              sx={{ fontSize: 48, color: brand.colors.accent, mb: 2 }}
            />

            <Typography variant="h6" sx={{ color: colors.graySoft[100], mb: 1 }}>
              Drag and drop your banner here
            </Typography>


            <Typography variant="body1" sx={{ color: colors.graySoft[300], mb: 2 }}>
              or click to browse files
            </Typography>

            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              startIcon={<FileUpload />}
              sx={brandPrimaryButtonSx}
            >
              Select File
            </Button>

          </Box>

          {/* File Info */}
          {file && (
            <Box
              sx={{
                ...brandPanelSx,
                mt: 3,
                p: 2,
                position: 'relative'
              }}
            >
              <IconButton
                onClick={removeFile}
                sx={{ position: 'absolute', right: 8, top: 8, color: colors.graySoft[400] }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>



              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ImageIcon sx={{ color: brand.colors.accent, mr: 2, fontSize: 40 }} />
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
                value={uploadProgress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: brand.colors.cardBorder,
                  '& .MuiLinearProgress-bar': { backgroundColor: brand.colors.accent }
                }}
              />

              <Typography
                variant="caption"
                sx={{ display: 'block', textAlign: 'right', mt: 1, color: colors.graySoft[300] }}
              >
                {uploadProgress}% uploaded
              </Typography>
            </Box>
          )}

          {/* Info Chips */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mt: 3,
              mb: 4
            }}
          >
            <Chip
              label="Supported: JPEG, PNG"
              variant="outlined"
              sx={{ color: colors.graySoft[300], borderColor: brand.colors.cardBorder }}
            />
            <Chip
              label="Max size: 25MB"
              variant="outlined"
              sx={{ color: colors.graySoft[300], borderColor: brand.colors.cardBorder }}
            />
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 4,
              pt: 2,
              borderTop: `1px solid ${brand.colors.cardBorder}`
            }}
          >
            <Button
              startIcon={<HelpCenterIcon />}
              sx={{
                color: colors.graySoft[300],
                '&:hover': { color: brand.colors.accent }
              }}
            >
              Help Center
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={removeFile}
                sx={{
                  ...brandOutlinedButtonSx,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={!file || uploadProgress < 100}
                sx={{
                  ...brandPrimaryButtonSx,
                  '&:disabled': {
                    backgroundColor: colors.graySoft[700],
                    color: colors.graySoft[500]
                  }
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>

          
        </CardContent>
      </Card>
    </Box>
  );
}
