import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { brand } from "../../../../brand";

const textFieldStyles = {
  backgroundColor: brand.colors.cardSurface,
  borderRadius: brand.radius.md,
  "& .MuiInputLabel-root": { color: `${brand.colors.textSecondary} !important` },
  "& .MuiInputBase-root": { color: `${brand.colors.textPrimary} !important` },
  "& .MuiInputBase-input": {
    color: `${brand.colors.textPrimary} !important`,
    "&::placeholder": {
      color: brand.colors.textMuted,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: `${brand.colors.borderStrong} !important`,
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: `${brand.colors.accent} !important`,
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: `${brand.colors.accent} !important`,
  },
  "& .MuiSvgIcon-root": {
    color: brand.colors.accent,
  },
};

export default function ReleaseDatePicker({ value, onChange, error, helperText }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value ? dayjs(value) : null}
        onChange={(date) => onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")}
        slotProps={{
          textField: {
            id: "releaseDate",
            name: "releaseDate",
            fullWidth: true,
            error: !!error,
            helperText,
            sx: textFieldStyles,
          },
        }}
      />
    </LocalizationProvider>
  );
}
