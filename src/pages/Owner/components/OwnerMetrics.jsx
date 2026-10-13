import React from "react";
import { useQuery } from "@apollo/client";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Alert, Card, CardContent, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useLocation, useNavigate } from "react-router-dom";
import PresenceStatsCards from "../../../components/PresenceStatsCards";
import { brand, brandCardSx } from "../../../brand";
import {
  ARTIST_DASHBOARD_STATS,
  PLAYS_DASHBOARD_STATS,
  SONGS_DASHBOARD_STATS,
  USERS_DASHBOARD_STATS,
} from "../../../utils/query";

const numberFormatter = new Intl.NumberFormat("en-US");

const formatNumber = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "0";
  return numberFormatter.format(numericValue);
};

const formatPercentValue = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Number(numericValue.toFixed(1));
};

const StatValue = ({ loading, value, subtitle }) => {
  if (loading) {
    return (
      <>
        <Skeleton
          variant="text"
          width={88}
          sx={{ bgcolor: brand.colors.cardBorder, fontSize: "2.125rem", mt: 1 }}
        />
        {subtitle && (
          <Skeleton
            variant="text"
            width={112}
            sx={{ bgcolor: brand.colors.cardBorder, fontSize: "0.875rem" }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{ color: brand.colors.textPrimary, mt: 1 }}
      >
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: brand.colors.textSecondary }}>
          {subtitle}
        </Typography>
      )}
    </>
  );
};

const StatNote = ({ loading, value }) => {
  if (loading) {
    return (
      <Skeleton
        variant="text"
        width={96}
        sx={{ bgcolor: brand.colors.cardBorder, fontSize: "0.875rem", mt: 2 }}
      />
    );
  }

  return (
    <Typography variant="body2" sx={{ color: brand.colors.accent, mt: 2 }}>
      {value}
    </Typography>
  );
};

const WeeklyTrendNote = ({ loading, thisWeek, previousWeek, changePercent }) => {
  if (loading) {
    return (
      <>
        <Skeleton
          variant="text"
          width={104}
          sx={{ bgcolor: brand.colors.cardBorder, fontSize: "0.875rem", mt: 2 }}
        />
        <Skeleton
          variant="text"
          width={132}
          sx={{ bgcolor: brand.colors.cardBorder, fontSize: "0.875rem" }}
        />
      </>
    );
  }

  const previousWeekValue = Number(previousWeek);
  const hasPreviousWeek = Number.isFinite(previousWeekValue) && previousWeekValue > 0;
  const percent = formatPercentValue(changePercent);
  const isDecrease = percent < 0;
  const TrendIcon = isDecrease ? ArrowDownward : ArrowUpward;

  return (
    <>
      <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 2 }}>
        {formatNumber(thisWeek)} this week
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: hasPreviousWeek
            ? isDecrease
              ? "error.main"
              : brand.colors.accent
            : brand.colors.textSecondary,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mt: 0.5,
        }}
      >
        {hasPreviousWeek ? (
          <>
            <TrendIcon sx={{ fontSize: 16 }} />
            {Math.abs(percent)}% vs previous week
          </>
        ) : (
          "No previous week data"
        )}
      </Typography>
    </>
  );
};

export default function OwnerMetrics() {
  const navigate = useNavigate();
  const location = useLocation();
  const dashboardBase = location.pathname.startsWith("/super-admin")
    ? "/super-admin"
    : location.pathname.startsWith("/admin")
      ? "/admin"
      : location.pathname.startsWith("/dashboard")
        ? "/dashboard"
        : "/owner";
  
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
  const metrics = [
    {
      title: "Artists",
      value: formatNumber(artistData?.artistDashboardStats?.total),
      note: `+${formatNumber(artistData?.artistDashboardStats?.thisWeek)} this wk`,
      loading: artistsLoading,
      path: `${dashboardBase}/all-artists`,
    },
    {
      title: "Songs",
      value: formatNumber(songsData?.songsDashboardStats?.total),
      note: `+${formatNumber(songsData?.songsDashboardStats?.thisWeek)} this wk`,
      loading: songsLoading,
      path: `${dashboardBase}/all-songs`,
    },
    {
      title: "Users",
      value: formatNumber(usersData?.usersDashboardStats?.total),
      note: `+${formatNumber(usersData?.usersDashboardStats?.thisWeek)} this wk`,
      loading: usersLoading,
    },
    {
      title: "Plays",
      value: formatNumber(playsData?.playsDashboardStats?.total),
      subtitle: "Lifetime plays",
      thisWeek: playsData?.playsDashboardStats?.thisWeek,
      previousWeek: playsData?.playsDashboardStats?.previousWeek,
      changePercent: playsData?.playsDashboardStats?.changePercent,
      loading: playsLoading,
      renderNote: (metric) => (
        <WeeklyTrendNote
          loading={metric.loading}
          thisWeek={metric.thisWeek}
          previousWeek={metric.previousWeek}
          changePercent={metric.changePercent}
        />
      ),
    },
  ];
  const error = artistsError || songsError || usersError || playsError;

  const openMetric = (metric) => {
    if (metric.path) {
      navigate(metric.path);
    }
  };

  const handleMetricKeyDown = (event, metric) => {
    if (!metric.path) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMetric(metric);
    }
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading dashboard stats: {error.message}
        </Alert>
      )}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {metrics.map((metric) => (
          <Grid key={metric.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              onClick={() => openMetric(metric)}
              onKeyDown={(event) => handleMetricKeyDown(event, metric)}
              role={metric.path ? "button" : undefined}
              tabIndex={metric.path ? 0 : undefined}
              sx={{
                ...brandCardSx,
                height: "100%",
                cursor: metric.path ? "pointer" : "default",
                outline: "none",
                "&:focus-visible": metric.path
                  ? {
                      borderColor: brand.colors.accent,
                      boxShadow: `0 0 0 3px ${brand.colors.accentSoft}`,
                    }
                  : undefined,
              }}
            >
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
                <StatValue
                  loading={metric.loading}
                  value={metric.value}
                  subtitle={metric.subtitle}
                />
                {metric.renderNote ? (
                  metric.renderNote(metric)
                ) : (
                  <StatNote loading={metric.loading} value={metric.note} />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <PresenceStatsCards />
    </>
  );
}
