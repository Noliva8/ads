import React from "react";
import { useQuery } from "@apollo/client";
import {
  Alert,
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { brand, brandCardSx } from "../../brand";
import { VISITOR_ANALYTICS_STATS } from "../../utils/query";

const numberFormatter = new Intl.NumberFormat("en-US");

const formatNumber = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "0";
  return numberFormatter.format(numericValue);
};

const formatAxisNumber = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "0";
  if (Math.abs(numericValue) >= 1000) {
    return `${(numericValue / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return formatNumber(numericValue);
};

const formatPercent = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "0%";
  const normalizedValue = numericValue > 0 && numericValue <= 1 ? numericValue * 100 : numericValue;
  return `${normalizedValue.toFixed(1).replace(/\.0$/, "")}%`;
};

const formatRatioPercent = (numerator, denominator) => {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return "0%";
  }

  return formatPercent((numerator / denominator) * 100);
};

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getLastSevenDays = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      date: getDateKey(date),
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      visits: 0,
      uniqueVisitors: 0,
    };
  });
};

const fillLastSevenDays = (dailyVisits) => {
  const visitsByDate = new Map(dailyVisits.map((day) => [day.date, day]));

  return getLastSevenDays().map((day) => {
    const apiDay = visitsByDate.get(day.date);

    return {
      ...day,
      label: apiDay?.label || day.label,
      visits: Number(apiDay?.visits) || 0,
      uniqueVisitors: Number(apiDay?.uniqueVisitors) || 0,
    };
  });
};

const selectSx = {
  minWidth: 148,
  "& .MuiOutlinedInput-root": {
    height: 38,
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
      "& .Mui-selected": {
        backgroundColor: brand.colors.accentSoft,
      },
    },
  },
};

const SummaryCard = ({ label, value, note, loading }) => (
  <Card sx={{ ...brandCardSx, height: "100%" }}>
    <CardContent sx={{ p: 2.25, "&:last-child": { pb: 2.25 } }}>
      <Typography
        variant="caption"
        sx={{
          color: brand.colors.label,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      {loading ? (
        <>
          <Skeleton
            variant="text"
            width={104}
            sx={{ bgcolor: brand.colors.cardBorder, fontSize: "2.25rem", mt: 1 }}
          />
          <Skeleton
            variant="text"
            width={112}
            sx={{ bgcolor: brand.colors.cardBorder, fontSize: "0.875rem" }}
          />
        </>
      ) : (
        <>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: brand.colors.textPrimary, mt: 1.25 }}
          >
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 0.75 }}>
            {note}
          </Typography>
        </>
      )}
    </CardContent>
  </Card>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <Box
      sx={{
        backgroundColor: brand.colors.surface,
        border: `1px solid ${brand.colors.cardBorder}`,
        borderRadius: brand.radius.md,
        px: 1.5,
        py: 1,
        boxShadow: brand.shadow.md,
      }}
    >
      <Typography variant="caption" sx={{ color: brand.colors.label, fontWeight: 800 }}>
        {label}
      </Typography>
      {payload.map((entry) => (
        <Typography key={entry.dataKey} variant="body2" sx={{ color: entry.color }}>
          {entry.name}: {formatNumber(entry.value)}
        </Typography>
      ))}
    </Box>
  );
};

const DetailRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 2,
    }}
  >
    <Typography variant="body2" sx={{ color: brand.colors.textSecondary }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ color: brand.colors.textPrimary, fontWeight: 800 }}>
      {value}
    </Typography>
  </Box>
);

export default function Analytics({ embedded = false }) {
  const { data, loading, error } = useQuery(VISITOR_ANALYTICS_STATS, {
    fetchPolicy: "cache-and-network",
  });

  const stats = data?.visitorAnalyticsStats;
  const dailyVisits = stats?.dailyVisits ?? [];
  const chartDailyVisits = fillLastSevenDays(dailyVisits);
  const totalVisitors = Number(stats?.totalVisitors) || 0;
  const anonymousVisitors = Number(stats?.anonymousVisitors) || 0;
  const convertedVisitors = Number(stats?.convertedVisitors) || 0;
  const returningVisitors = Math.max(Number(stats?.returningVisitors) || 0, convertedVisitors);
  const newVisitors = Math.max(totalVisitors - returningVisitors, 0);
  const busiestDayLabel =
    dailyVisits.find((day) => day.date === stats?.busiestDay || day.label === stats?.busiestDay)
      ?.label || stats?.busiestDay || "No traffic yet";

  const summaryCards = [
    {
      label: "Total Visitors",
      value: formatNumber(totalVisitors),
      note: "unique visitors",
    },
    {
      label: "New Visitors",
      value: formatNumber(newVisitors),
      note: "first time",
    },
    {
      label: "Returning Visitors",
      value: formatNumber(returningVisitors),
      note: "came back",
    },
    {
      label: "Total Visits",
      value: formatNumber(stats?.totalVisits),
      note: "sessions",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: embedded ? 0 : { xs: 2, md: 3 },
        background: embedded ? "transparent" : brand.colors.dark,
        color: brand.colors.textPrimary,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading visitor analytics: {error.message}
        </Alert>
      )}

      {!embedded && (
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
          <Box sx={{ maxWidth: 720 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ color: brand.colors.textPrimary, textTransform: "uppercase" }}
            >
              Visitor Analytics
            </Typography>
            <Typography variant="body1" sx={{ color: brand.colors.textSecondary, mt: 0.75 }}>
              Understand who's discovering Flolup and whether they're coming back
            </Typography>
          </Box>

          <FormControl size="small" sx={selectSx}>
            <Select value="last7days" MenuProps={selectMenuProps}>
              <MenuItem value="last7days">Last 7 days</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      <Grid container spacing={2.25} sx={{ mb: 2.25 }}>
        {summaryCards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <SummaryCard
              label={card.label}
              value={card.value}
              note={card.note}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.25}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ ...brandCardSx, height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 }, "&:last-child": { pb: { xs: 2, md: 3 } } }}>
              <Typography
                variant="caption"
                sx={{
                  color: brand.colors.label,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Visits
              </Typography>

              <Box sx={{ width: "100%", height: { xs: 280, md: 340 }, mt: 2 }}>
                {loading ? (
                  <Skeleton
                    variant="rounded"
                    height="100%"
                    sx={{ bgcolor: brand.colors.cardBorder, borderRadius: brand.radius.md }}
                  />
                ) : (
                  <ResponsiveContainer>
                    <LineChart data={chartDailyVisits} margin={{ top: 10, right: 16, bottom: 8, left: 0 }}>
                      <CartesianGrid stroke={brand.colors.cardBorder} vertical={false} />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: brand.colors.textSecondary, fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: brand.colors.textSecondary, fontSize: 12 }}
                        tickFormatter={formatAxisNumber}
                        width={52}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Line
                        name="Visits"
                        type="monotone"
                        dataKey="visits"
                        stroke={brand.colors.accent}
                        strokeWidth={3}
                        dot={{ r: 4, fill: brand.colors.accent, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: brand.colors.accentHover, strokeWidth: 0 }}
                      />
                      <Line
                        name="Unique visitors"
                        type="monotone"
                        dataKey="uniqueVisitors"
                        stroke={brand.colors.info}
                        strokeWidth={2}
                        strokeDasharray="6 5"
                        dot={{ r: 3, fill: brand.colors.info, strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: brand.colors.info, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  mt: 2,
                  color: brand.colors.textSecondary,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 28, height: 3, backgroundColor: brand.colors.accent }} />
                  <Typography variant="body2">Visits</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 0,
                      borderTop: `2px dashed ${brand.colors.info}`,
                    }}
                  />
                  <Typography variant="body2">Unique visitors</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ color: brand.colors.label, fontWeight: 800, mb: 0.5 }}
                >
                  Busiest day
                </Typography>
                {loading ? (
                  <Skeleton
                    variant="text"
                    width={180}
                    sx={{ bgcolor: brand.colors.cardBorder, fontSize: "1rem" }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ color: brand.colors.textPrimary }}>
                    {busiestDayLabel} · {formatNumber(stats?.busiestDayVisits)} visits
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ ...brandCardSx, height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, md: 3 }, "&:last-child": { pb: { xs: 2, md: 3 } } }}>
              <Typography
                variant="caption"
                sx={{
                  color: brand.colors.label,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Conversion
              </Typography>

              {loading ? (
                <Box sx={{ mt: 3 }}>
                  <Skeleton
                    variant="rounded"
                    height={260}
                    sx={{ bgcolor: brand.colors.cardBorder, borderRadius: brand.radius.md }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: "grid", gap: 3, mt: 3 }}>
                  <DetailRow
                    label="Anonymous visitors"
                    value={formatNumber(stats?.anonymousVisitors)}
                  />
                  <DetailRow label="Converted" value={formatNumber(stats?.convertedVisitors)} />
                  <DetailRow
                    label="Eligible anonymous"
                    value={formatNumber(stats?.eligibleAnonymousVisitors)}
                  />

                  <Box sx={{ borderTop: `1px solid ${brand.colors.cardBorder}`, pt: 3 }}>
                    <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mb: 1 }}>
                      Conversion rate
                    </Typography>
                    <Typography
                      variant="h2"
                      fontWeight={800}
                      sx={{ color: brand.colors.accent, textAlign: "center", my: 2 }}
                    >
                      {formatRatioPercent(convertedVisitors, newVisitors)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: brand.colors.textSecondary, textAlign: "center" }}
                    >
                      {formatNumber(convertedVisitors)} of {formatNumber(newVisitors)} new visitors converted
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
