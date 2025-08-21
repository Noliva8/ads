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
          p: 3,
          width: '100%',
          minHeight: 560, // gives presence; adjust as you like
          backgroundColor: colors.blackNeutral[600],
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
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
              border: `2px dashed ${isDragging ? colors.orangeAccent[400] : colors.orangeAccent[200]}`,
              borderRadius: '12px',
              p: 4,
              mb: 2,
              textAlign: 'center',
              backgroundColor: isDragging ? 'rgba(255,152,0,0.05)' : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': { borderColor: colors.orangeAccent[400] }
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
              sx={{ fontSize: 48, color: colors.orangeAccent[400], mb: 2 }}
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
              sx={{
                backgroundColor: colors.orangeAccent[500],
                '&:hover': { backgroundColor: colors.orangeAccent[600] }
              }}
            >
              Select File
            </Button>

          </Box>

          {/* File Info */}
          {file && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: colors.blackNeutral[500],
                borderRadius: '8px',
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
                <ImageIcon sx={{ color: colors.orangeAccent[400], mr: 2, fontSize: 40 }} />
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
                  backgroundColor: colors.blackNeutral[400],
                  '& .MuiLinearProgress-bar': { backgroundColor: colors.orangeAccent[400] }
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
              sx={{ color: colors.graySoft[300], borderColor: colors.graySoft[700] }}
            />
            <Chip
              label="Max size: 25MB"
              variant="outlined"
              sx={{ color: colors.graySoft[300], borderColor: colors.graySoft[700] }}
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
              borderTop: `1px solid ${colors.blackNeutral[400]}`
            }}
          >
            <Button
              startIcon={<HelpCenterIcon />}
              sx={{
                color: colors.graySoft[300],
                '&:hover': { color: colors.orangeAccent[400] }
              }}
            >
              Help Center
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={removeFile}
                sx={{
                  color: colors.graySoft[100],
                  borderColor: colors.graySoft[500],
                  '&:hover': { borderColor: colors.graySoft[400] }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={!file || uploadProgress < 100}
                sx={{
                  backgroundColor: colors.orangeAccent[500],
                  '&:hover': { backgroundColor: colors.orangeAccent[600] },
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
