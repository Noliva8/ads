import React from "react";
import { useSubscription } from "@apollo/client";
import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CloudUpload, Headphones, People, TravelExplore } from "@mui/icons-material";
import { brand, brandCardSx } from "../brand";
import { ONLINE_USER_PRESENCE_STATS_UPDATED } from "../utils/query";

const numberFormatter = new Intl.NumberFormat("en-US");

const formatNumber = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "0";
  return numberFormatter.format(numericValue);
};

export default function PresenceStatsCards() {
  const { data, loading, error } = useSubscription(ONLINE_USER_PRESENCE_STATS_UPDATED);

  const stats = data?.onlineUserPresenceStatsUpdated || {
    totalOnline: 0,
    uploading: 0,
    playing: 0,
    browsing: 0,
  };

  const metrics = [
    {
      title: "Online now",
      value: stats.totalOnline,
      subtitle: "Live users",
      icon: People,
    },
    {
      title: "Uploading",
      value: stats.uploading,
      subtitle: "Active uploads",
      icon: CloudUpload,
    },
    {
      title: "Playing",
      value: stats.playing,
      subtitle: "Listening now",
      icon: Headphones,
    },
    {
      title: "Browsing",
      value: stats.browsing,
      subtitle: "Exploring app",
      icon: TravelExplore,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Grid key={metric.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ ...brandCardSx, height: "100%" }}>
              <CardContent>
                <Typography
                  variant="caption"
                  sx={{
                    color: brand.colors.label,
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {metric.title}
                </Typography>
                <Icon sx={{ color: brand.colors.accent, float: "right" }} />
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{ color: brand.colors.textPrimary, mt: 1 }}
                >
                  {formatNumber(metric.value)}
                </Typography>
                <Typography variant="body2" sx={{ color: brand.colors.textSecondary }}>
                  {metric.subtitle}
                </Typography>
                <Typography variant="body2" sx={{ color: brand.colors.accent, mt: 2 }}>
                  {error
                    ? "Unable to connect live stats"
                    : loading
                      ? "Waiting for live updates"
                      : "Updated in real time"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
