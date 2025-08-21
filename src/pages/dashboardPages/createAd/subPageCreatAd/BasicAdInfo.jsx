import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Divider,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormContext, Controller } from "react-hook-form";
import { tokens } from "../../../../theme";

// Predefined country and city data
const SUPPORTED_COUNTRIES = {
  'United States': {
    name: 'United States',
    majorCities: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
      'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
      'Wisconsin', 'Wyoming'
    ],
    otherCities: [],
    allCities: function() { return this.majorCities; }
  },
  'Rwanda': {
    name: 'Rwanda',
    majorCities: ['Kigali'],
    otherCities: ['Southern Province', 'Northern Province', 'Western Province', 'Eastern Province'],
    allCities: function() { return [...this.majorCities, ...this.otherCities]; }
  },
  'Uganda': {
    name: 'Uganda',
    majorCities: ['Kampala'],
    otherCities: ['Entebbe', 'Jinja', 'Mbale', 'Mbarara', 'Gulu', 'Lira', 'Arua'],
    allCities: function() { return [...this.majorCities, ...this.otherCities]; }
  },
  'Kenya': {
    name: 'Kenya',
    majorCities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
    otherCities: ['Eldoret', 'Thika', 'Malindi', 'Kitale', 'Kakamega'],
    allCities: function() { return [...this.majorCities, ...this.otherCities]; }
  },
  'Nigeria': {
    name: 'Nigeria',
    majorCities: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Benin City'],
    otherCities: ['Ibadan', 'Enugu', 'Kaduna', 'Aba', 'Zaria', 'Jos'],
    allCities: function() { return [...this.majorCities, ...this.otherCities]; }
  }
};

const COUNTRY_OPTIONS = Object.keys(SUPPORTED_COUNTRIES).map(country => ({
  value: country,
  label: country
}));

export default function BasicAdInfo({ colors }) {
  const theme = useTheme();
  const _colors = colors || tokens(theme.palette.mode);

  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);

  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const scope = watch("targeting.scope");
  const country = watch("targeting.countries[0]");
  const wholeCountry = watch("targeting.wholeCountry");

  const inputSx = {
    "& .MuiInputLabel-root": { color: _colors.graySoft[400] },
    "& .MuiInputLabel-root.Mui-focused": { color: _colors.graySoft[300] },
    "& .MuiOutlinedInput-root": {
      backgroundColor: _colors.blackNeutral[500],
      borderRadius: 1,
      "& fieldset": { borderColor: _colors.blackNeutral[400] },
      "&:hover fieldset": { borderColor: _colors.graySoft[400] },
      "&.Mui-focused fieldset": { borderColor: _colors.orange[500] },
    },
    "& .MuiInputBase-input": {
      color: _colors.graySoft[100],
      "::placeholder": { color: _colors.graySoft[400], opacity: 1 },
    },
  };

  const menuPaperSx = {
    bgcolor: _colors.blackNeutral[600],
    color: _colors.graySoft[100],
    border: `1px solid ${_colors.blackNeutral[500]}`,
  };

  useEffect(() => {
    if (country) {
      const countryData = SUPPORTED_COUNTRIES[country];
      if (countryData) {
        if (country === 'United States') {
          setStateOptions(countryData.allCities()); // Populate states as cities for the USA
          setCityOptions([]); // Clear city options
        } else {
          setCityOptions(countryData.allCities()); // Populate cities for other countries
          setStateOptions([]); // Clear state options for non-USA countries
        }
      }
    } else {
      setCityOptions([]); // Clear city options when no country is selected
      setStateOptions([]); // Clear state options when no country is selected
    }
  }, [country]); // Trigger this effect when the country changes

  return (
 <Box width='100%' height= "100%">

      
      <Card
        sx={{
          width: '100%',
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: _colors.blackNeutral[600],
        }}
      >

    

        <CardContent sx={{ flexGrow: 1 }}>

          <Typography
            variant="h3"
                  fontWeight="bold"
            color={_colors.graySoft[100]}
            mb={2}
          >
            Start Creating Ad
          </Typography>



         


          <Box>
            <Grid container columnSpacing={3} rowSpacing={3}>


              {/* Title */}
              <Grid size={{ xs: 12, sm: 6}} >

                <TextField
                  label="Ad Title"
                  fullWidth
                  {...register("adTitle", {
                    required: "Please enter the ad title.",
                  })}
                  error={!!errors.adTitle}
                  helperText={errors.adTitle?.message}
                  sx={inputSx}
                />
              </Grid>

              {/* Ad Type */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!errors.adType} sx={inputSx}>
                  <InputLabel id="ad-type-label">Ad Type</InputLabel>
                  <Controller
                    name="adType"
                    control={control}
                    rules={{ required: "Please select the ad Type." }}
                    defaultValue="audio"
                    render={({ field }) => (
                      <Select {...field} labelId="ad-type-label" label="Ad Type" MenuProps={{ PaperProps: { sx: menuPaperSx } }}>
                        <MenuItem value="audio">Audio</MenuItem>
                        <MenuItem value="banner">Banner</MenuItem>
                        <MenuItem value="overlay">Overlay</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Targeting scope */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!errors?.targeting?.scope} sx={inputSx}>
                  <InputLabel id="scope-label">Targeting Scope</InputLabel>
                  <Controller
                    name="targeting.scope"
                    control={control}
                    defaultValue="country"
                    rules={{ required: "Please select the targeting scope." }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="scope-label"
                        label="Targeting Scope"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          setValue("targeting.countries", []);
                          setValue("targeting.city", "");
                          setValue("targeting.wholeCountry", false);
                        }}
                        MenuProps={{ PaperProps: { sx: menuPaperSx } }}
                      >
                        <MenuItem value="worldwide">Worldwide</MenuItem>
                        <MenuItem value="country">Country</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Country selection */}
              {scope === "country" && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={!!errors?.targeting?.countries} sx={inputSx}>
                      <InputLabel id="country-label">Country</InputLabel>
                      <Controller
                        name="targeting.countries"
                        control={control}
                        defaultValue={[]}
                        rules={{
                          validate: (v) =>
                            (v?.length ?? 0) > 0 || "Please select a country.",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="country-label"
                            label="Country"
                            value={field.value[0] || ""}
                            onChange={(e) =>
                              field.onChange(e.target.value ? [e.target.value] : [])
                            }
                            MenuProps={{ PaperProps: { sx: menuPaperSx } }}
                          >
                            {COUNTRY_OPTIONS.map((country) => (
                              <MenuItem key={country.value} value={country.value}>
                                {country.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", alignItems: "center" }}>
                    <Controller
                      name="targeting.wholeCountry"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              sx={{ color: _colors.orange[500] }}
                            />
                          }
                          label="Run in whole country"
                          sx={{ color: _colors.graySoft[100] }}
                        />
                      )}
                    />
                  </Grid>

                  {/* State (only USA) */}
                  {scope === "country" && country === 'United States' && !wholeCountry && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={inputSx}>
                        <InputLabel id="state-label">State</InputLabel>
                        <Controller
                          name="targeting.state"
                          control={control}
                          defaultValue=""
                          rules={{ required: "Please select a state." }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              labelId="state-label"
                              label="State"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              MenuProps={{ PaperProps: { sx: menuPaperSx } }}
                            >
                              {stateOptions.map((state) => (
                                <MenuItem key={state} value={state}>{state}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  )}

                  {/* City (for non-USA or when not whole country) */}
                  {scope === "country" && !wholeCountry && country && country !== 'United States' && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth sx={inputSx}>
                        <InputLabel id="city-label">City</InputLabel>
                        <Controller
                          name="targeting.city"
                          control={control}
                          defaultValue=""
                          rules={{ required: "Please select a city." }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              labelId="city-label"
                              label="City"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              MenuProps={{ PaperProps: { sx: menuPaperSx } }}
                            >
                              {cityOptions.map((city) => (
                                <MenuItem key={city} value={city}>{city}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  )}
                </>
              )}

              {/* Date Fields */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="schedule.startDate"
                  control={control}
                  defaultValue={dayjs().format("YYYY-MM-DD")}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      label="Start Date"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(val) =>
                        field.onChange(val ? dayjs(val).format("YYYY-MM-DD") : "")
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors?.schedule?.startDate,
                          helperText: errors?.schedule?.startDate?.message,
                          sx: inputSx,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="schedule.endDate"
                  control={control}
                  defaultValue={dayjs().add(7, "day").format("YYYY-MM-DD")}
                  rules={{
                    required: "End date is required",
                    validate: (v) => {
                      const start = getValues("schedule.startDate");
                      if (
                        start &&
                        v &&
                        dayjs(v).isBefore(dayjs(start), "day")
                      ) {
                        return "End date must be on or after the start date.";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="End Date"
                      value={field.value ? dayjs(field.value) : null}
                      minDate={
                        watch("schedule.startDate")
                          ? dayjs(watch("schedule.startDate"))
                          : undefined
                      }
                      onChange={(val) =>
                        field.onChange(val ? dayjs(val).format("YYYY-MM-DD") : "")
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors?.schedule?.endDate,
                          helperText: errors?.schedule?.endDate?.message,
                          sx: inputSx,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description (optional)"
                  fullWidth
                  multiline
                  rows={3}
                  {...register("description")}
                  sx={inputSx}
                />
              </Grid>

              {/* Submit Button */}
              <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: _colors.orange[500],
                    "&:hover": { backgroundColor: _colors.orange[600] },
                  }}
                >
                  Calculate Price
                </Button>
             
              </Grid>


              
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>

  );
}
