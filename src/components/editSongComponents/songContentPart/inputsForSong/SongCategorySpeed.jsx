import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { brand } from "../../../../brand";

const CATEGORY_OPTIONS = [
  { value: "SECULAR", label: "Secular" },
  { value: "RELIGIOUS", label: "Religious" },
  { value: "INSTRUMENTAL", label: "Instrumental" },
];

const SPEED_OPTIONS = [
  { value: "SLOW", label: "Slow" },
  { value: "MEDIUM", label: "Medium" },
  { value: "FAST", label: "Fast" },
];

function MetadataSelect({ Controller, control, errors, name, label, placeholder, options }) {
  return (
    <Box
      mb={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          color: brand.colors.textPrimary,
          fontWeight: 500,
          mb: 1,
        }}
      >
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select
            {...field}
            fullWidth
            displayEmpty
            error={!!errors?.[name]}
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
            <MenuItem value="" disabled>
              <Typography component="span" sx={{ color: brand.colors.textMuted }}>
                {placeholder}
              </Typography>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      {errors?.[name] && (
        <Typography variant="subtitle2" color="error" sx={{ mt: 1 }}>
          {errors[name].message}
        </Typography>
      )}
    </Box>
  );
}

export default function SongCategorySpeed({ Controller, control, errors }) {
  return (
    <>
      <MetadataSelect
        Controller={Controller}
        control={control}
        errors={errors}
        name="songCategory"
        label="Song Category"
        placeholder="Select a category"
        options={CATEGORY_OPTIONS}
      />
      <MetadataSelect
        Controller={Controller}
        control={control}
        errors={errors}
        name="speed"
        label="Speed"
        placeholder="Select speed"
        options={SPEED_OPTIONS}
      />
    </>
  );
}
