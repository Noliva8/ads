import React from "react";
import { useQuery } from "@apollo/client";
import { MoreVert } from "@mui/icons-material";
import { Alert, Box, Card, CardContent, IconButton, Skeleton, Typography } from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { brand, brandCardSx, brandPanelSx } from "../../../brand";
import {
  ARTIST_DASHBOARD_STATS,
  PLAYS_DASHBOARD_STATS,
  SONGS_DASHBOARD_STATS,
  USERS_DASHBOARD_STATS,
} from "../../../utils/query";

const numberFormatter = new Intl.NumberFormat("en-US");

const toNumber = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const formatNumber = (value) => numberFormatter.format(toNumber(value));

const getPreviousTotal = (total, thisWeek) => Math.max(toNumber(total) - toNumber(thisWeek), 0);

const getRawValue = (previousTotal, currentTotal, index) =>
  Math.round(previousTotal + (currentTotal - previousTotal) * (index / 6));

const getWaveValue = (base, amplitude, index) => {
  const progress = index / 6;
  const wave = Math.sin(progress * Math.PI * 1.15 - Math.PI * 0.12);
  const rise = progress * 22;
  return Math.round(base + rise + wave * amplitude);
};

const buildGrowthData = ({ artistStats, songStats, userStats, playStats }) => {
  const metrics = {
    artists: {
      previous: getPreviousTotal(artistStats?.total, artistStats?.thisWeek),
      current: toNumber(artistStats?.total),
    },
    songs: {
      previous: getPreviousTotal(songStats?.total, songStats?.thisWeek),
      current: toNumber(songStats?.total),
    },
    users: {
      previous: getPreviousTotal(userStats?.total, userStats?.thisWeek),
      current: toNumber(userStats?.total),
    },
    plays: {
      previous: getPreviousTotal(playStats?.total, playStats?.thisWeek),
      current: toNumber(playStats?.total),
    },
  };

  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, index) => ({
    label,
    artists: getWaveValue(26, 10, index),
    songs: getWaveValue(42, 13, index),
    users: getWaveValue(58, 11, index),
    plays: getWaveValue(74, 15, index),
    artistsCount: getRawValue(metrics.artists.previous, metrics.artists.current, index),
    songsCount: getRawValue(metrics.songs.previous, metrics.songs.current, index),
    usersCount: getRawValue(metrics.users.previous, metrics.users.current, index),
    playsCount: getRawValue(metrics.plays.previous, metrics.plays.current, index),
  }));
};

const GrowthTooltip = ({ active, payload, label }) => {
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
          {entry.name}: {formatNumber(entry.payload?.[`${entry.dataKey}Count`])}
        </Typography>
      ))}
    </Box>
  );
};

export default function OwnerGrowth() {
  const {
    data: artistData,
    loading: artistsLoading,
    error: artistsError,
  } = useQuery(ARTIST_DASHBOARD_STATS, {
    fetchPolicy: "cache-and-network",
  });
  const {
    data: songsData,
    loading: songsLoading,
    error: songsError,
  } = useQuery(SONGS_DASHBOARD_STATS, {
    fetchPolicy: "cache-and-network",
  });
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(USERS_DASHBOARD_STATS, {
    fetchPolicy: "cache-and-network",
  });
  const {
    data: playsData,
    loading: playsLoading,
    error: playsError,
  } = useQuery(PLAYS_DASHBOARD_STATS, {
    fetchPolicy: "cache-and-network",
  });

  const artistStats = artistData?.artistDashboardStats;
  const songStats = songsData?.songsDashboardStats;
  const userStats = usersData?.usersDashboardStats;
  const playStats = playsData?.playsDashboardStats;
  const loading = artistsLoading || songsLoading || usersLoading || playsLoading;
  const error = artistsError || songsError || usersError || playsError;

  const growthData = buildGrowthData({ artistStats, songStats, userStats, playStats });

  return (
    <Card sx={brandCardSx}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 3 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: brand.colors.label,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Growth
            </Typography>
            <Typography variant="body1" sx={{ color: brand.colors.textSecondary, mt: 1 }}>
              Artists / Songs / Users / Plays
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: brand.colors.label }}>
            <MoreVert />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading growth stats: {error.message}
          </Alert>
        )}

        <Box sx={{ ...brandPanelSx, p: 2, minHeight: 340, overflow: "hidden" }}>
          {loading ? (
            <Skeleton
              variant="rounded"
              height={300}
              sx={{ bgcolor: brand.colors.cardBorder, borderRadius: brand.radius.md }}
            />
          ) : (
            <Box sx={{ width: "100%", height: { xs: 300, md: 340 } }}>
              <ResponsiveContainer>
                <LineChart data={growthData} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid stroke={brand.colors.cardBorder} vertical={false} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: brand.colors.textSecondary, fontSize: 12 }}
                  />
                  <YAxis
                    hide
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: brand.colors.textSecondary, fontSize: 12 }}
                    domain={[0, 110]}
                    width={0}
                  />
                  <Tooltip content={<GrowthTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={32}
                    iconType="line"
                    wrapperStyle={{ color: brand.colors.textSecondary, fontSize: 12 }}
                  />
                  <Line
                    name="Artists"
                    type="monotone"
                    dataKey="artists"
                    stroke={brand.colors.accent}
                    strokeWidth={3}
                    dot={{ r: 4, fill: brand.colors.accent, strokeWidth: 0 }}
                  />
                  <Line
                    name="Songs"
                    type="monotone"
                    dataKey="songs"
                    stroke={brand.colors.info}
                    strokeWidth={3}
                    dot={{ r: 4, fill: brand.colors.info, strokeWidth: 0 }}
                  />
                  <Line
                    name="Users"
                    type="monotone"
                    dataKey="users"
                    stroke={brand.colors.secondary}
                    strokeWidth={3}
                    dot={{ r: 4, fill: brand.colors.secondary, strokeWidth: 0 }}
                  />
                  <Line
                    name="Plays"
                    type="monotone"
                    dataKey="plays"
                    stroke={brand.colors.campaignPrimary}
                    strokeWidth={3}
                    dot={{ r: 4, fill: brand.colors.campaignPrimary, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
