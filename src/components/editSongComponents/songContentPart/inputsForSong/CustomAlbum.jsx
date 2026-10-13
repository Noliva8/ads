import { useState, lazy, Suspense, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useMutation } from "@apollo/client";

import { CUSTOM_ALBUM } from "../../../../utils/mutation.js";

import { useForm } from "react-hook-form";

import AlbumCoverUpload from "./AlbumCoverUpload.jsx";
import { brand, brandOutlinedButtonSx, brandPrimaryButtonSx } from "../../../../brand";
import './customAlbum.css';


const LazyReleaseDatePicker = lazy(() => import("./ReleaseDatePicker.jsx"));

const ReleaseDateFallback = () => (
  <TextField
    fullWidth
    placeholder="Loading release date picker..."
    disabled
    sx={{
      backgroundColor: brand.colors.cardSurface,
      "& .MuiInputLabel-root": { color: `${brand.colors.textPrimary} !important` },
      "& .MuiInputBase-root": { color: `${brand.colors.textPrimary} !important` },
      "& .MuiInputBase-input": {
        color: `${brand.colors.textPrimary} !important`,
        "&::placeholder": { color: brand.colors.textMuted },
      },
    }}
  />
);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "calc(100vw - 32px)", sm: "520px", md: "640px" },
  height: "auto",
  maxHeight: "80vh",
  backgroundColor: brand.colors.surface,
  border: `1px solid ${brand.colors.cardBorder}`,
  boxShadow: brand.shadow.lg,
  borderRadius: brand.radius.md,
  p: { xs: 2, sm: 3 },
};

export default function CustomAlbum({ albumOpen, setAlbumOpen, profile, refetchAlbums, artistId: artistIdProp }) {
  const [inputModal, setInputModel] = useState(false);
  const [createCustomAlbum] = useMutation(CUSTOM_ALBUM);
  const [albumId, setAlbumId] = useState('');
  const artistId = artistIdProp || profile?.data?._id;
  const closeButtonRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      releaseDate: null, // Default value for date field
    },
  });

  const releaseDateValue = watch("releaseDate");

  const handleClose = async () => {
      const result = await Swal.fire({
      title: "Are you sure?",
      text: "Album data are not saved!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: brand.colors.primary,
      cancelButtonColor: brand.colors.error,
      confirmButtonText: "Yes, close it!",
    });

    if (result.isConfirmed) {
      setAlbumOpen(false);
      await Swal.fire({
        title: "Closed!",
        text: "Your album has been closed.",
        icon: "success",
      });
    }
  };

  useEffect(() => {
    if (albumOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [albumOpen]);

  const onSubmit = async (data) => {
    try {

      const response = await createCustomAlbum({
        variables: {
          title: data.title,
          releaseDate: data.releaseDate,
          artistId: artistId,
          albumCoverImage: "",
        },
        
      });

      // Refetch albums to ensure the dropdown reflects the new album
      await refetchAlbums();

      const newAlbumId = response.data.createCustomAlbum._id;

      if (response.data) {
        setAlbumId(newAlbumId);
        setAlbumOpen(false);  // Close the modal
        setInputModel(true);  // Trigger the album cover input modal
      }
    } catch (err) {
      console.error("Error creating album:", err);

      // Handle specific error messages from the server
      if (err.message.includes("An album with this title already exists")) {
        Swal.fire({
          icon: "error",
          title: "Title already exists",
          text: "An album with this title already exists. Click on the dropdown menu to find your album.",
          customClass: {
            popup: "custom-alert",
          },
          confirmButtonText: "OK", // Confirm button text
        }).then(() => {
          setAlbumOpen(false);  // Close the modal after the user clicks "OK"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error creating album.",
          customClass: {
            popup: "custom-alert",
          },
          confirmButtonText: "OK",
        }).then(() => {
          setAlbumOpen(false);  // Close the modal after the user clicks "OK"
        });
      }
    }
  };


  return (
    <div>
      <Modal
        open={albumOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClose}
            sx={{
              ...brandOutlinedButtonSx,
              position: "absolute",
              top: 12,
              right: 12,
              minWidth: 40,
              width: 40,
              height: 40,
              p: 0,
            }}
            ref={closeButtonRef}
          >
            <CloseIcon />
          </Button>

          <Paper
            sx={{
              width: "100%",
              backgroundColor: brand.colors.cardSolidSurface,
              backgroundImage: "none",
              p: { xs: 2, sm: 3 },
              borderRadius: brand.radius.md,
              border: `1px solid ${brand.colors.cardBorder}`,
              boxShadow: "none",
              color: brand.colors.textPrimary,
            }}
          >
            <Stack spacing={2.5}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: brand.typography.fontFamily,
                  fontSize: { xs: "1.45rem", sm: "1.75rem" },
                  fontWeight: 800,
                  color: brand.colors.textPrimary,
                }}
              >
                Create Album
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Typography sx={{ color: brand.colors.textPrimary, fontWeight: 700 }}>
                    Title
                  </Typography>
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    variant="outlined"
                    autoFocus
                    {...register("title")}
                    sx={{
                      backgroundColor: brand.colors.cardSurface,
                      borderRadius: brand.radius.md,
                      "& .MuiOutlinedInput-root": {
                        color: brand.colors.textPrimary,
                        borderRadius: brand.radius.md,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: brand.colors.borderStrong,
                      },
                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: brand.colors.accent,
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: brand.colors.accent,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Typography sx={{ color: brand.colors.textPrimary, fontWeight: 700 }}>
                    Release Date
                  </Typography>
                  <Suspense fallback={<ReleaseDateFallback />}>
                    <LazyReleaseDatePicker
                      value={releaseDateValue}
                      onChange={(date) => setValue("releaseDate", date)}
                      error={errors.releaseDate}
                      helperText={errors.releaseDate?.message}
                    />
                  </Suspense>
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    ...brandPrimaryButtonSx,
                    padding: "12px 24px",
                    fontSize: "1rem",
                    mt: 2,
                  }}
                  onClick={handleSubmit(onSubmit)}
                >
                  Create album
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Modal>

      <AlbumCoverUpload inputModal={inputModal} setInputModel={setInputModel} albumId={albumId} />
    </div>
  );
}
