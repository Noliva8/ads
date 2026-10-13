import React, { Suspense, lazy, useState } from "react";
// import {
//   Box,
//   FormControl,
//   MenuItem,
//   Select,
//   Typography,
// } from "@mui/material";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { brand, brandCardSx } from "../../brand";



const Analytics = lazy(() => import("../../components/Analytics/analytics"));
const OwnerMetrics = lazy(() => import("./components/OwnerMetrics"));
const OwnerGrowth = lazy(() => import("./components/OwnerGrowth"));



const filterSelectSx = {
  minWidth: 150,
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: brand.radius.pill,
    backgroundColor: brand.colors.cardSurface,
    color: brand.colors.textPrimary,
    fontWeight: 700,
    fontSize: "0.85rem",
    "& fieldset": {
      borderColor: brand.colors.cardBorder,
    },
    "&:hover fieldset": {
      borderColor: brand.colors.borderStrong,
    },
    "&.Mui-focused fieldset": {
      borderColor: brand.colors.accent,
    },
  },
  "& .MuiSelect-icon": {
    color: brand.colors.accent,
  },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      mt: 1,
      backgroundColor: brand.colors.surface,
      color: brand.colors.textPrimary,
      border: `1px solid ${brand.colors.cardBorder}`,
      "& .MuiMenuItem-root": {
        fontSize: "0.9rem",
      },
      "& .Mui-selected": {
        backgroundColor: brand.colors.accentSoft,
      },
    },
  },
};

const SectionFallback = ({ minHeight = 160 }) => (
  <Box
    sx={{
      ...brandCardSx,
      minHeight,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: brand.colors.label,
      fontWeight: 700,
    }}
  >
    Loading...
  </Box>
);

export default function OwnerDashboard() {
  const [timeRange, setTimeRange] = useState("last7days");
  const [country, setCountry] = useState("rwanda");

  return (
    <Box
      sx={{
        height: "auto",
        p: 3,
        background: brand.colors.dark,
        color: brand.colors.textPrimary,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: brand.colors.label }}
        >
          {brand.companyName.toUpperCase()} OVERVIEW
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <FormControl size="small" sx={filterSelectSx}>
            <Select
              value={timeRange}
              onChange={(event) => setTimeRange(event.target.value)}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="last7days">Last 7 days</MenuItem>
              <MenuItem value="lastMonth">Last month</MenuItem>
              <MenuItem value="last3Months">Last 3 months</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={filterSelectSx}>
            <Select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="all">All country</MenuItem>
              <MenuItem value="rwanda">Rwanda</MenuItem>
              <MenuItem value="usa">USA</MenuItem>
              <MenuItem value="uganda">Uganda</MenuItem>
              <MenuItem value="burundi">Burundi</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Suspense fallback={<SectionFallback />}>
        <OwnerMetrics />
      </Suspense>

      <Box sx={{ mt: 3 }}>
        <Suspense fallback={<SectionFallback minHeight={420} />}>
          <OwnerGrowth />
        </Suspense>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Suspense fallback={<SectionFallback minHeight={420} />}>
          <Analytics embedded />
        </Suspense>
      </Box>
    </Box>
  );
}
