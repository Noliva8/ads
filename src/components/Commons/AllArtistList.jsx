import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import HomeFreePlan from "../artistModelComponents/HomeFreePlan";
import {
  brand,
  brandCardContentSx,
  brandOutlinedButtonSx,
  brandPanelSx,
} from "../../brand";

import { DASHBOARD_ARTISTS } from "../../utils/query";

const getArtistId = (artist) => artist?.id || artist?._id;

const getColumns = (onOpenArtist) => [
  {
    field: "fullName",
    headerName: "Full Name",
    minWidth: 200,
    flex: 1.5,
    renderCell: (params) => (
      <Link
        href={`/artist/${params.row.id || params.row._id}`}
        underline="hover"
        onClick={(event) => {
          event.preventDefault();
          onOpenArtist(params.row);
        }}
        sx={{ color: brand.colors.textPrimary, fontWeight: 700 }}
      >
        {params.value || "Unnamed artist"}
      </Link>
    ),
  },
  {
    field: "artistAka",
    headerName: "Stage Name",
    minWidth: 150,
    flex: 1,
    valueGetter: (value) => value || "-",
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 220,
    flex: 1.5,
    renderCell: (params) =>
      params.value ? (
        <Link
          href={`mailto:${params.value}`}
          underline="hover"
          sx={{ color: brand.colors.textPrimary }}
        >
          {params.value}
        </Link>
      ) : (
        "-"
      ),
  },
  {
    field: "region",
    headerName: "Region",
    minWidth: 150,
    flex: 1,
    valueGetter: (value) => value || "-",
  },
  {
    field: "country",
    headerName: "Country",
    minWidth: 150,
    flex: 1,
    valueGetter: (value) => value || "-",
  },
  {
    field: "isProfileComplete",
    headerName: "Profile Status",
    minWidth: 160,
    renderCell: (params) => {
      const isComplete = Boolean(params.row.isProfileComplete);

      return (
        <Chip
          label={isComplete ? "Complete" : "Incomplete"}
          size="small"
          variant="outlined"
          sx={{
            borderColor: isComplete ? brand.colors.borderStrong : brand.colors.warning,
            color: isComplete ? brand.colors.textPrimary : brand.colors.warning,
            fontWeight: 700,
          }}
        />
      );
    },
  },
  {
    field: "isVerified",
    headerName: "Verification",
    minWidth: 150,
    renderCell: (params) => (
      <Chip
        label={params.value ? "Verified" : "Unverified"}
        size="small"
        variant="outlined"
        sx={{
          borderColor: params.value ? brand.colors.borderStrong : brand.colors.warning,
          color: params.value ? brand.colors.textPrimary : brand.colors.warning,
          fontWeight: 700,
        }}
      />
    ),
  },
  {
    field: "createdAt",
    headerName: "Created At",
    minWidth: 190,
    flex: 1,
    valueFormatter: (value) => {
      if (!value) return "-";

      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
    },
  },
  {
    field: "actions",
    headerName: "",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    width: 72,
    align: "center",
    renderCell: (params) => (
      <Tooltip title="Edit artist">
        <IconButton
          aria-label={`Edit ${params.row.fullName || "artist"}`}
          size="small"
          onClick={() => onOpenArtist(params.row)}
          sx={{
            color: `${brand.colors.textPrimary} !important`,
            border: `1px solid ${brand.colors.textPrimary}`,
            "& .MuiSvgIcon-root": {
              color: `${brand.colors.textPrimary} !important`,
            },
            "&:hover": {
              color: `${brand.colors.textPrimary} !important`,
              background: brand.colors.cardSurface,
              borderColor: brand.colors.textPrimary,
            },
            "&:hover .MuiSvgIcon-root": {
              color: `${brand.colors.textPrimary} !important`,
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ),
  },
];

export default function AllArtistListPage() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistOverrides, setArtistOverrides] = useState({});

  const { data, loading, error, refetch } = useQuery(DASHBOARD_ARTISTS, {
    variables: { page: paginationModel.page + 1 },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const dashboardArtists = data?.dashboardArtists;
  const rows = useMemo(
    () =>
      (dashboardArtists?.artists ?? []).map((artist) => ({
        ...artist,
        ...(artistOverrides[getArtistId(artist)] ?? {}),
      })),
    [artistOverrides, dashboardArtists?.artists]
  );
  const apiLimit = dashboardArtists?.limit ?? paginationModel.pageSize;
  const totalArtists = dashboardArtists?.totalArtists ?? 0;
  const columns = useMemo(
    () =>
      getColumns((artist) => {
        setSelectedArtist(artist);
      }),
    []
  );
  const isEditOpen = Boolean(selectedArtist);
  const selectedArtistId = getArtistId(selectedArtist);

  const handleCloseEdit = () => {
    setSelectedArtist(null);
  };

  const handleArtistUpdated = useCallback(
    (artistProfile) => {
      if (artistProfile) {
        const artistId = getArtistId(artistProfile);

        if (artistId) {
          setArtistOverrides((current) => ({
            ...current,
            [artistId]: {
              ...(current[artistId] ?? {}),
              ...artistProfile,
            },
          }));
        }

        setSelectedArtist((current) => {
          if (!current || getArtistId(current) !== artistId) {
            return current;
          }

          return {
            ...current,
            ...artistProfile,
          };
        });
      }

      refetch?.();
    },
    [refetch]
  );

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: 3,
        background: brand.gradients.dashboard,
        color: brand.colors.textPrimary,
        fontFamily: brand.typography.fontFamily,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mt: 2,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: brand.colors.accent,
              fontWeight: 800,
              letterSpacing: 0,
            }}
          >
            {brand.productName}
          </Typography>
          <Typography variant="h5" fontWeight={800}>
            All Artists
          </Typography>
        </Box>

        <Box
          sx={{
            ...brandPanelSx,
            px: 2,
            py: 1,
            minWidth: 132,
            textAlign: { xs: "left", sm: "right" },
          }}
        >
          <Typography variant="caption" sx={{ color: brand.colors.textMuted }}>
            Total Artists
          </Typography>
          <Typography variant="h6" fontWeight={800} sx={{ color: brand.colors.accent }}>
            {totalArtists.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          Failed to load artists: {error.message}
        </Alert>
      ) : null}

      <Card
        sx={{
          mt: 3,
          background: brand.colors.cardSurface,
          border: `1px solid ${brand.colors.cardBorder}`,
          borderRadius: brand.radius.md,
          boxShadow: brand.shadow.md,
          backdropFilter: "blur(10px)",
        }}
      >
        <CardContent sx={{ ...brandCardContentSx, p: { xs: 1.5, sm: 2 } }}>
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id || row._id}
            disableRowSelectionOnClick
            paginationMode="server"
            rowCount={totalArtists}
            paginationModel={{
              page: paginationModel.page,
              pageSize: apiLimit,
            }}
            onPaginationModelChange={(model) => {
              setPaginationModel((current) => ({
                page: model.page,
                pageSize: model.pageSize || current.pageSize,
              }));
            }}
            pageSizeOptions={[apiLimit]}
            slots={{
              toolbar: GridToolbar,
              loadingOverlay: LinearProgress,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 400 },
              },
            }}
            sx={{
              border: "none",
              color: brand.colors.textPrimary,
              fontFamily: brand.typography.fontFamily,
              "& .MuiDataGrid-main": {
                borderRadius: brand.radius.md,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: brand.colors.surfaceRaised,
                color: brand.colors.textPrimary,
                fontWeight: 700,
                borderBottom: `1px solid ${brand.colors.cardBorder}`,
              },
              "& .MuiDataGrid-topContainer, & .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderTitleContainer": {
                backgroundColor: `${brand.colors.surfaceRaised} !important`,
                color: `${brand.colors.textPrimary} !important`,
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: brand.colors.textPrimary,
                fontWeight: 800,
              },
              "& .MuiDataGrid-columnSeparator": {
                color: brand.colors.cardBorder,
              },
              "& .MuiDataGrid-cell": {
                color: brand.colors.textPrimary,
                borderBottom: `1px solid ${brand.colors.cardBorder}`,
              },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: brand.colors.cardSolidSurface,
                color: brand.colors.textSecondary,
                borderTop: `1px solid ${brand.colors.cardBorder}`,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: brand.colors.accentSoft,
              },
              "& .MuiDataGrid-toolbarContainer": {
                px: 1,
                py: 1.25,
                borderBottom: `1px solid ${brand.colors.cardBorder}`,
              },
              "& .MuiButtonBase-root": {
                color: brand.colors.accent,
                textTransform: "none",
                fontWeight: 700,
              },
              "& .MuiInputBase-root": {
                color: brand.colors.textPrimary,
              },
              "& .MuiInputBase-root::before": {
                borderBottomColor: brand.colors.borderStrong,
              },
              "& .MuiInputBase-root:hover:not(.Mui-disabled)::before": {
                borderBottomColor: brand.colors.accent,
              },
              "& .MuiInputBase-root::after": {
                borderBottomColor: brand.colors.accent,
              },
              "& .MuiSvgIcon-root": {
                color: brand.colors.accent,
              },
              "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: brand.colors.textSecondary,
              },
              "& .MuiDataGrid-overlay": {
                color: brand.colors.textSecondary,
                background: brand.colors.cardSolidSurface,
              },
              "& .MuiLinearProgress-root": {
                backgroundColor: brand.colors.accentSoft,
              },
              "& .MuiLinearProgress-bar": {
                background: brand.gradients.accent,
              },
            }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={isEditOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            background: brand.colors.surface,
            color: brand.colors.textPrimary,
            border: `1px solid ${brand.colors.cardBorder}`,
            borderRadius: brand.radius.md,
            maxHeight: "92vh",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {selectedArtist?.fullName || "Artist Profile"}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            borderColor: brand.colors.cardBorder,
            p: { xs: 1, sm: 2 },
          }}
        >
          {selectedArtistId ? (
            <HomeFreePlan
              artistId={selectedArtistId}
              onArtistUpdated={handleArtistUpdated}
            />
          ) : (
            <Alert severity="error">Unable to load this artist profile.</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEdit} sx={brandOutlinedButtonSx}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
