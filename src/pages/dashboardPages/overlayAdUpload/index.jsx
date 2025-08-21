import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { 
  Box, Typography, Card, CardContent, Button,
  TextField, Divider, useTheme, IconButton
} from '@mui/material';
import { Upload as UploadIcon, Image, Close, CheckCircle } from '@mui/icons-material';
import { tokens } from '../../../theme';

const OverlayAdUpload = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    linkUrl: '',
    displayDuration: 5,
    position: 'bottom-right'
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API upload logic here
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Upload Overlay Ad
      </Typography>

      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: colors.blackNeutral[600],
            borderRadius: '8px',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Image/Media File
              </Typography>
              
              <Box
                sx={{
                  border: `2px dashed ${colors.graySoft[500]}`,
                  borderRadius: '8px',
                  p: 4,
                  textAlign: 'center',
                  mb: 2,
                  minHeight: 300
                }}
              >
                {file ? (
                  <Box>
                    <Image sx={{ fontSize: 48, color: colors.orange[500] }} />
                    <Typography mt={1}>{file.name}</Typography>
                    <Typography variant="body2" color={colors.graySoft[400]} mt={1}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                    <Box
                      component="img"
                      src={URL.createObjectURL(file)}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        mt: 2,
                        borderRadius: '4px'
                      }}
                    />
                    <Button 
                      variant="outlined" 
                      startIcon={<Close />}
                      onClick={() => setFile(null)}
                      sx={{ mt: 2 }}
                    >
                      Remove
                    </Button>
                  </Box>
                ) : (
                  <>
                    <UploadIcon sx={{ fontSize: 48, color: colors.graySoft[400] }} />
                    <Typography mt={1}>Drag & drop image file</Typography>
                    <Typography variant="body2" color={colors.graySoft[400]}>
                      or click to browse (PNG, JPG, GIF)
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ 
                        mt: 2,
                        backgroundColor: colors.orange[500],
                        '&:hover': { backgroundColor: colors.orange[600] }
                      }}
                    >
                      Select File
                      <input 
                        type="file" 
                        hidden 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </>
                )}
              </Box>

              <Typography variant="body2" color={colors.graySoft[400]}>
                Max file size: 10MB | Recommended dimensions: 300x250px
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Form Section */}
        <Grid xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.blackNeutral[600], borderRadius: '8px' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Ad Details
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  margin="normal"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: colors.graySoft[500] },
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Link URL"
                  variant="outlined"
                  margin="normal"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                  placeholder="https://example.com"
                />

                <Grid container spacing={2} mt={1}>
                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Display Duration (seconds)"
                      type="number"
                      variant="outlined"
                      value={formData.displayDuration}
                      onChange={(e) => setFormData({...formData, displayDuration: e.target.value})}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Position"
                      variant="outlined"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      {['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: colors.blackNeutral[500] }} />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={!file}
                  startIcon={<CheckCircle />}
                  sx={{ 
                    py: 1.5,
                    backgroundColor: colors.orange[500],
                    '&:hover': { backgroundColor: colors.orange[600] },
                    '&:disabled': { backgroundColor: colors.graySoft[700] }
                  }}
                >
                  Upload Overlay Ad
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverlayAdUpload;