import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  FormHelperText,
  Typography,
  useTheme
} from '@mui/material';
import { tokens } from '../../../theme';
import { brand, brandPanelSx } from '../../../brand';


const BasicInfoStep = ({ data, setData, errors }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const adTypes = ['audio', 'banner', 'video'];
  const scopes = ['worldwide', 'country', 'city'];

  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTargetingChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      targeting: {
        ...prev.targeting,
        [field]: value,
      },
    }));
  };

  const handleScheduleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value,
      },
    }));
  };

  // Styled TextField component
  const StyledTextField = ({ ...props }) => (
    <TextField
      fullWidth
      variant="outlined"
      InputLabelProps={{ 
        style: { color: colors.graySoft[400] },
        shrink: props.type === 'date' ? true : undefined
      }}
      InputProps={{
        style: { color: colors.graySoft[100] },
        sx: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.colors.cardBorder
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.colors.accent
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.colors.accent
          },
          ...brandPanelSx,
        }
      }}
      FormHelperTextProps={{
        style: { color: colors.redAccent[500] }
      }}
      {...props}
    />
  );

  // Styled Select component
  const StyledSelect = ({ children, ...props }) => (
    <Select
      sx={{
        color: colors.graySoft[100],
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: brand.colors.cardBorder
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: brand.colors.accent
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: brand.colors.accent
        },
        ...brandPanelSx,
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: brand.colors.surface,
            color: colors.graySoft[100]
          }
        }
      }}
      {...props}
    >
      {children}
    </Select>
  );

//   if (!data?.title || !data?.adType || !data?.targeting?.scope || !data?.schedule?.startDate) {
//   return <Typography color="error">Loading ad details...</Typography>;
// }


  return (

    


    <Box sx={{ p: 2 }}>

      <Typography variant="h6" sx={{ 
        mb: 3, 
        color: colors.graySoft[100],
        fontWeight: 'bold'
      }}>
        Campaign Details
      </Typography>

      <Grid container spacing={3}>
        {/* Title */}
        <Grid item xs={12}>
          <StyledTextField
            label="Ad Title"
            // value={data.title}
            // onChange={(e) => handleChange('title', e.target.value)}
            // error={!!errors.title}
            // helperText={errors.title}
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <StyledTextField
            label="Ad Description"
            multiline
            rows={3}
            // value={data.description}
            // onChange={(e) => handleChange('description', e.target.value)}
            // error={!!errors.description}
            // helperText={errors.description}
          />
        </Grid>

        {/* Ad Type */}
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.adType}>
            <InputLabel sx={{ color: colors.graySoft[400] }}>Ad Type</InputLabel>
            <StyledSelect
              value={data.adType || ''}
              onChange={(e) => handleChange('adType', e.target.value)}
              label="Ad Type"
            >

              {adTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </StyledSelect>
            <FormHelperText sx={{ color: colors.redAccent[500] }}>
              {/* {errors.adType} */}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Targeting Scope */}
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors['targeting.scope']}>
            <InputLabel sx={{ color: colors.graySoft[400] }}>Targeting Scope</InputLabel>
            <StyledSelect
              value={data.targeting?.scope || ''}
              onChange={(e) => handleTargetingChange('scope', e.target.value)}
              label="Targeting Scope"
            >
              {scopes.map((scope) => (
                <MenuItem key={scope} value={scope}>
                  {scope.charAt(0).toUpperCase() + scope.slice(1)}
                </MenuItem>
              ))}
            </StyledSelect>
            <FormHelperText sx={{ color: colors.redAccent[500] }}>
              {errors['targeting.scope']}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Country (if scope is country) */}
        {data.targeting?.scope === 'country' && (
          <Grid item xs={12}>
            <StyledTextField
              label="Target Countries (comma-separated)"
              value={data.targeting?.countries?.join(', ') || ''}
              onChange={(e) =>
                handleTargetingChange(
                  'countries',
                  e.target.value.split(',').map((c) => c.trim())
                )
              }
              error={!!errors['targeting.countries']}
              helperText={errors['targeting.countries']}
            />
          </Grid>
        )}

        {/* City (if scope is city) */}
        {data.targeting?.scope === 'city' && (
          <Grid item xs={12}>
            <StyledTextField
              label="Target City"
              value={data.targeting?.city || ''}
              onChange={(e) => handleTargetingChange('city', e.target.value)}
              error={!!errors['targeting.city']}
              helperText={errors['targeting.city']}
            />
          </Grid>
        )}

        {/* Start Date */}
        <Grid item xs={12} sm={6}>
          <StyledTextField
            type="date"
            label="Start Date"
            value={data.schedule?.startDate?.substring(0, 10) || ''}
            onChange={(e) => handleScheduleChange('startDate', e.target.value)}
            error={!!errors['schedule.startDate']}
            helperText={errors['schedule.startDate']}
          />
        </Grid>

        {/* End Date */}
        <Grid item xs={12} sm={6}>
          <StyledTextField
            type="date"
            label="End Date"
            value={data.schedule?.endDate?.substring(0, 10) || ''}
            onChange={(e) => handleScheduleChange('endDate', e.target.value)}
            error={!!errors['schedule.endDate']}
            helperText={errors['schedule.endDate']}
          />
        </Grid>
      </Grid>
    </Box>



  );

};

export default BasicInfoStep;
