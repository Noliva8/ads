import React from "react";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Button,
  Chip,
  Avatar,
  Alert,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import {
  DataGrid,
  gridClasses,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as PreviewIcon,
} from "@mui/icons-material";
import { MY_ADS } from "../../../../utils/query";
import { tokens } from "../../../../theme";
import { brand, brandPrimaryButtonSx } from "../../../../brand";







export default function AdDisplay({
  embedded = false,           // <<— NEW: render without internal Card
  height = 480,               // <<— NEW: fixed grid height (scrolls inside)
  showToolbar = true,
  onCreateClick,              // optional callback for “Create” in empty state
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data, loading, error } = useQuery(MY_ADS, {
    variables: { limit: 25, offset: 0 },
    fetchPolicy: "cache-and-network",
  });

  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 10 });
  const ads = data?.myAds ?? [];

  const getStatusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "pending": return "warning";
      case "rejected": return "error";
      case "paused": return "default";
      default: return "default";
    }
  };

  const handleEdit = (id) => console.log("Edit ad:", id);
  const handleToggleStatus = (id, status) => console.log("Toggle:", id, status);
  const handleDelete = (id) => console.log("Delete:", id);
  const handlePreview = (ad) => console.log("Preview:", ad);

  const columns = [
    {
      field: "adTitle",
      headerName: "Ad Campaign",
      flex: 2.2,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} noWrap title={params.value} sx={{ color: colors.graySoft[100] }}>
            {params.value}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: colors.graySoft[300] }}>
            {params.row.adType}{params.row.budget ? ` • $${params.row.budget}` : ""}
          </Typography>
        </Box>
      ),
    },
    {
      field: "targeting",
      headerName: "Targeting",
      flex: 1.7,
      minWidth: 200,
      valueGetter: (params) => params.value?.scope === "country" ? "Nationwide" : params.value?.city,
      renderCell: (params) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body1" noWrap sx={{ color: colors.graySoft[100] }}>
            {params.value}
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: colors.graySoft[400] }}>
            {Array.isArray(params.row.targeting?.countries) && params.row.targeting.countries.length
              ? params.row.targeting.countries.join(", ")
              : "All countries"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1.1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="medium"
          color={getStatusColor(params.value)}
          variant={params.value === "paused" ? "outlined" : "filled"}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "preview",
      headerName: "Preview",
      flex: 1.1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar
          src={params.row.adArtWorkUrl || undefined}
          variant="rounded"
          sx={{
            width: 56, height: 56,
            bgcolor: brand.colors.cardSurface,
            border: `1px solid ${brand.colors.cardBorder}`,
            cursor: "pointer",
          }}
          onClick={() => handlePreview(params.row)}
        >
          <PreviewIcon />
        </Avatar>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1.2,
      minWidth: 160,
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.id)} />,
        <GridActionsCellItem
          icon={params.row.status === "active" ? <PauseIcon /> : <PlayIcon />}
          label={params.row.status === "active" ? "Pause" : "Activate"}
          onClick={() => handleToggleStatus(params.id, params.row.status)}
        />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id)} />,
      ],
    },
  ];

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading your ads: {error.message}
      </Alert>
    );
  }

  // Shared DataGrid styles that make it look native inside a parent Card
  const gridSx = {
    bgcolor: "transparent",
    border: 0,
    [`& .${gridClasses.columnHeader}`]: {
      bgcolor: "transparent",
      color: colors.graySoft[100],
      fontWeight: 800,
      borderBottom: `1px solid ${brand.colors.cardBorder}`,
    },
    [`& .${gridClasses.cell}`]: {
      color: colors.graySoft[100],
      borderBottom: `1px solid ${brand.colors.cardBorder}`,
      py: 1.25,
      fontSize: "0.98rem",
    },
    "& .MuiDataGrid-footerContainer": {
      bgcolor: "transparent",
      color: colors.graySoft[200],
      borderTop: `1px solid ${brand.colors.cardBorder}`,
    },
    "& .MuiDataGrid-toolbarContainer": {
      p: 1,
      bgcolor: "transparent",
    },
    [`& .${gridClasses.row}:hover`]: {
      backgroundColor: brand.colors.cardSurface,
    },
  };

  // Embedded mode: no internal Card, fixed height in a Box
  return (
    <Box sx={{ width: "100%", height }}>
      <DataGrid
        rows={ads}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id || row._id}
        disableRowSelectionOnClick
        rowHeight={78}
        columnHeaderHeight={56}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        slots={{
          toolbar: showToolbar ? GridToolbar : undefined,
          loadingOverlay: LinearProgress,
          noRowsOverlay: () => (
            <Box
              sx={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                height: "100%", gap: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: colors.graySoft[200] }}>
                No ads created yet
              </Typography>
              <Typography variant="body2" sx={{ color: colors.graySoft[400] }}>
                Start by creating your first ad campaign
              </Typography>
              <Button
                variant="contained"
                onClick={onCreateClick}
                sx={brandPrimaryButtonSx}
              >
                Create First Ad
              </Button>
            </Box>
          ),
        }}
        slotProps={{
          toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 400 } },
        }}
        sx={gridSx}
      />
    </Box>
  );
}
