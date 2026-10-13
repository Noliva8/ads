import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const textFieldStyles = {
  bgcolor: "var(--secondary-background-color)",
  "& .MuiInputLabel-root": { color: "white !important" },
  "& .MuiInputBase-root": { color: "white !important" },
  "& .MuiInputBase-input": {
    color: "white !important",
    "&::placeholder": {
      color: "rgba(255,255,255,0.75)",
    },
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
