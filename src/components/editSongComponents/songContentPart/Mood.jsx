import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Controller } from "react-hook-form";
import { brand } from "../../../brand";

const MAIN_MOODS = [
 "Happy",
    "Sad",
    "Romantic",
    "Calm",
    "Energetic",


    "Worship",
    "Praise",
    "Party",
    "Wedding",
    "Workout",
];



const SUB_MOODS = {
  
   Happy: [
  "Joyful",
  "Optimistic",
  "Playful",
  "Celebratory",
],
  

  Sad: [
  "Heartbreak",
  "Lonely",
  "Struggle",
  "Grief",
],
 
Romantic: [
  "Crush",
  "In Love",
  "Intimate",
  "Commitment",
],
  

  Calm: [
  "Peaceful",
  "Reflective",
  "Soothing",
],


Energetic: [
  "Hype",
  "Powerful",
  "Motivational",
  "Aggressive",
],

 Worship: [
  "Devotional",
  "Prayerful",
  "Meditative",
  "Surrender",
],

Praise: [
  "Thanksgiving",
  "Exaltation",
  "Testimony",
],

Party: [
  "Club",
  "Turn Up",
  "Festival",
],

Wedding: [
  "Gusaba",
  "Ceremony",
  "First Dance",
  "Reception",
],

Workout: [
  "Gym",
  "Running",
  "Training",
]
 
};



export default function Mood({ control, watch }) {
  const selectedMoods = watch("mood") || [];

  return (
    <Box mb={3}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ color: brand.colors.textPrimary, fontWeight: 500 }}>
          Mood
        </Typography>
        <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 0.5 }}>
          How does your song feel? Pick up to 2.
        </Typography>
      </Box>

      <Controller
        name="mood"
        control={control}
        defaultValue={[]}
        render={({ field: { value, onChange } }) => (
          <Select
            multiple
            fullWidth
            displayEmpty
            value={value || []}
            onChange={(event) => {
              const nextValue = event.target.value;
              onChange(typeof nextValue === "string" ? nextValue.split(",").slice(0, 2) : nextValue.slice(0, 2));
            }}
            renderValue={(selected) => {
              if (!selected.length) {
                return (
                  <Typography component="span" sx={{ color: brand.colors.textMuted }}>
                    Select mood
                  </Typography>
                );
              }

              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {selected.map((mood) => (
                    <Chip
                      key={mood}
                      label={mood}
                      size="small"
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                      onDelete={(event) => {
                        event.stopPropagation();
                        onChange((value || []).filter((selectedMood) => selectedMood !== mood));
                      }}
                      sx={{
                        backgroundColor: brand.colors.accentSoft,
                        color: brand.colors.textPrimary,
                        "& .MuiChip-deleteIcon": {
                          color: brand.colors.textSecondary,
                          "&:hover": {
                            color: brand.colors.accent,
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              );
            }}
            MenuProps={{
              sx: { zIndex: 1700 },
              PaperProps: {
                sx: {
                  backgroundColor: brand.colors.cardSolidSurface,
                  backgroundImage: "none",
                  color: brand.colors.textPrimary,
                  border: `1px solid ${brand.colors.cardBorder}`,
                  boxShadow: brand.shadow.lg,
                  "& .MuiMenuItem-root": {
                    color: brand.colors.textPrimary,
                    "&.Mui-selected, &.Mui-selected:hover": {
                      backgroundColor: brand.colors.accentSoft,
                    },
                    "&:hover": {
                      backgroundColor: brand.colors.cardSurface,
                    },
                  },
                  "& .MuiCheckbox-root": {
                    color: brand.colors.textMuted,
                    "&.Mui-checked": {
                      color: brand.colors.accent,
                    },
                  },
                },
              },
            }}
            sx={{
              minWidth: 220,
              width: "100%",
              backgroundColor: brand.colors.cardSurface,
              color: brand.colors.textPrimary,
              borderRadius: brand.radius.md,
              "& .MuiSelect-icon": {
                color: brand.colors.accent,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: brand.colors.borderStrong,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: brand.colors.accent,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: brand.colors.accent,
              },
            }}
          >
            {MAIN_MOODS.map((mood) => (
              <MenuItem
                key={mood}
                value={mood}
                disabled={(value || []).length >= 2 && !(value || []).includes(mood)}
              >
                <Checkbox checked={(value || []).includes(mood)} />
                <ListItemText primary={mood} />
              </MenuItem>
            ))}
          </Select>
        )}
      />

      {/* Per-Mood SubMood Inputs */}
      {selectedMoods.map((mood) => (
        <Box key={mood} mt={3}>
          <Typography variant="subtitle2" sx={{ color: brand.colors.textSecondary, mb: 1 }}>
            {mood} sub-moods
          </Typography>
          <Controller
            name={`subMoods.${mood}`}
            control={control}
            defaultValue={[]}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                multiple
                freeSolo
                options={SUB_MOODS[mood] || []}
                value={value}
                onChange={(_, newValue) => onChange(newValue)}
                slotProps={{
                  paper: {
                    sx: {
                      backgroundColor: brand.colors.cardSolidSurface,
                      backgroundImage: "none",
                      color: brand.colors.textPrimary,
                      border: `1px solid ${brand.colors.cardBorder}`,
                      boxShadow: brand.shadow.lg,
                    },
                  },
                  popper: {
                    sx: { zIndex: 1700 },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={`Select or type for ${mood}`}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: brand.colors.cardSurface,
                        borderRadius: brand.radius.md,
                        color: brand.colors.textPrimary,
                        "& fieldset": {
                          borderColor: brand.colors.borderStrong,
                        },
                        "&:hover fieldset": {
                          borderColor: brand.colors.accent,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: brand.colors.accent,
                        },
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
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    const { key: tagKey, ...rest } = tagProps || {};
                    return (
                      <Chip
                        key={tagKey ?? `${option}-${index}`}
                        label={option}
                        size="small"
                        {...rest}
                        sx={{
                          mr: 0.5,
                          backgroundColor: brand.colors.accentSoft,
                          color: brand.colors.textPrimary,
                          "& .MuiChip-deleteIcon": {
                            color: brand.colors.textSecondary,
                            "&:hover": {
                              color: brand.colors.accent,
                            },
                          },
                        }}
                      />
                    );
                  })
                }
              />
            )}
          />
        </Box>
      ))}
    </Box>
  );
}
