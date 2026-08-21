import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Divider,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Lock,
  Email,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Edit,
  LocationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { brand } from '../../brand';

const AccountCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: brand.radius.lg,
  boxShadow: 'none',
  marginBottom: theme.spacing(4),
  background: brand.colors.cardSurface,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${brand.colors.cardBorder}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    background: brand.colors.cardSurfaceHover,
    boxShadow: brand.shadow.cardHover,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: brand.colors.accent,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const AccountInfo = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [editMode, setEditMode] = useState({
    profile: false,
    security: false
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = (section) => {
    setEditMode(prev => ({ ...prev, [section]: false }));
    setSnackbar({
      open: true,
      message: section === 'profile' ? 'Profile updated successfully!' : 'Password changed successfully!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant={isMobile ? 'h4' : 'h3'} 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: brand.colors.accent
          }}
        >
          Account Information
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your profile and security settings
        </Typography>
      </Box>

      {/* Profile Information Card */}
      <AccountCard>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <SectionTitle variant="h5">
            <Person fontSize="medium" />
            Profile Information
          </SectionTitle>
          {!editMode.profile ? (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setEditMode(prev => ({ ...prev, profile: true }))}
              sx={{
                textTransform: 'none',
                borderRadius: brand.radius.pill,
                borderColor: brand.colors.accent,
                color: brand.colors.accent
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setEditMode(prev => ({ ...prev, profile: false }))}
                sx={{
                  textTransform: 'none',
                  borderRadius: brand.radius.pill
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSave('profile')}
                sx={{
                  textTransform: 'none',
                  borderRadius: brand.radius.pill,
                  background: brand.gradients.accent,
                  color: brand.colors.dark
                }}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{ 
                width: 120, 
                height: 120, 
                mb: 2,
                border: `3px solid ${brand.colors.accent}`
              }}
              src="/path-to-avatar.jpg"
            />
            {editMode.profile && (
              <Button variant="text" sx={{ textTransform: 'none' }}>
                Change Photo
              </Button>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!editMode.profile}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color={editMode.profile ? 'primary' : 'disabled'} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!editMode.profile}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode.profile}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color={editMode.profile ? 'primary' : 'disabled'} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editMode.profile}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color={editMode.profile ? 'primary' : 'disabled'} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!editMode.profile}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color={editMode.profile ? 'primary' : 'disabled'} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccountCard>

      {/* Security Settings Card */}
      <AccountCard>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <SectionTitle variant="h5">
            <Lock fontSize="medium" />
            Security Settings
          </SectionTitle>
          {!editMode.security ? (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setEditMode(prev => ({ ...prev, security: true }))}
              sx={{
                textTransform: 'none',
                borderRadius: brand.radius.pill,
                borderColor: brand.colors.accent,
                color: brand.colors.accent
              }}
            >
              Change Password
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setEditMode(prev => ({ ...prev, security: false }))}
                sx={{
                  textTransform: 'none',
                  borderRadius: brand.radius.pill
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSave('security')}
                sx={{
                  textTransform: 'none',
                  borderRadius: brand.radius.pill,
                  background: brand.gradients.accent,
                  color: brand.colors.dark
                }}
              >
                Update Password
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type={showPassword.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={!editMode.security}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color={editMode.security ? 'primary' : 'disabled'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handlePasswordVisibility('current')}
                      edge="end"
                    >
                      {showPassword.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showPassword.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              disabled={!editMode.security}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handlePasswordVisibility('new')}
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type={showPassword.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={!editMode.security}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handlePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {editMode.security && (
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2,
                borderRadius: brand.radius.md,
                backgroundColor: brand.colors.accentSoft
              }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Password Requirements:
                </Typography>
                <Box component="ul" sx={{ 
                  pl: 2,
                  '& li': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    fontSize: '0.875rem'
                  }
                }}>
                  <Box component="li">
                    <CheckCircle fontSize="small" color="success" />
                    Minimum 8 characters
                  </Box>
                  <Box component="li">
                    <CheckCircle fontSize="small" color="success" />
                    At least one uppercase letter
                  </Box>
                  <Box component="li">
                    <CheckCircle fontSize="small" color="success" />
                    At least one number or special character
                  </Box>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </AccountCard>

      {/* Account Actions Card */}
      <AccountCard>
        <SectionTitle variant="h5">
          Account Actions
        </SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              sx={{
                textTransform: 'none',
                borderRadius: brand.radius.md,
                py: 1.5
              }}
            >
              Deactivate Account
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: brand.radius.md,
                py: 1.5,
                borderColor: theme.palette.mode === 'dark' ? '#B25035' : '#B25035',
                color: theme.palette.mode === 'dark' ? '#B25035' : '#B25035'
              }}
            >
              Download Data
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{
                textTransform: 'none',
                borderRadius: brand.radius.md,
                py: 1.5
              }}
            >
              Delete Account
            </Button>
          </Grid>
        </Grid>
      </AccountCard>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountInfo;
