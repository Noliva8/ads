import { useState, useRef, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Swal from "sweetalert2";
import "./customAlbum.css";
import Paper from "@mui/material/Paper";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useMutation } from "@apollo/client";


import { GET_PRESIGNED_URL } from "../../../../utils/mutation.js";

import { UPDATE_ALBUM } from '../../../../utils/mutation.js'
import { brand, brandPrimaryButtonSx } from "../../../../brand";






const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "calc(100vw - 32px)", sm: "440px", md: "520px" },
  backgroundColor: brand.colors.surface,
  border: `1px solid ${brand.colors.cardBorder}`,
  boxShadow: brand.shadow.lg,
  borderRadius: brand.radius.md,
  p: { xs: 2, sm: 3 },
};

export default function AlbumCoverUpload({
  inputModal,
  setInputModel,
  albumId,
  handleAlbumInputModel,
}) {
  const fileInputRef = useRef(null);


  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [progress, setProgress] = useState(0); // State for progress bar
  const [getPresignedUrl] = useMutation(GET_PRESIGNED_URL);
  const [UpdateAlbum] = useMutation(UPDATE_ALBUM);

  const handleAlbumImageUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    // cover image integrity check
    // -------------------------
    if (!file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No file selected!",
        customClass: {
          popup: "custom-alert",
        },
      });
      return;
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid file type. Please upload an image file (JPEG, PNG).",
        customClass: {
          popup: "custom-alert",
        },
      });
      return;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Image size exceeds allowed size. Upload less than 5MB.",
        customClass: {
          popup: "custom-alert",
        },
      });
      return;
    }

    // File upload
    // -----------
    try {
     

      setIsLoadingImage(true);
      setProgress(0); // Reset progress before starting

      const objectKey = `album-covers/${file.name}`;

      const { data } = await getPresignedUrl({
        variables: {
          bucket: "afrofeel-album-covers",
          key: objectKey,
          region: "us-west-2",
        },
      });

      const uploadedUrl = data.getPresignedUrl.url;

      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent); // Update progress state
        }
      });

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const imageUrl = uploadedUrl.split("?")[0];
          const canonicalUrl = `https://afrofeel-album-covers.s3.us-west-2.amazonaws.com/${objectKey}`;
          setUploadedImageUrl(canonicalUrl); // Set the uploaded image URL

          // Update the album with the uploaded image URL
          await UpdateAlbum({
            variables: {
              albumId: albumId,
              albumCoverImage: canonicalUrl,
            },
          });

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Album created successfully!",
            customClass: {
              popup: "custom-swal-popup",
            },
          });

          setInputModel(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to upload image to S3.",
            customClass: {
              popup: "custom-alert",
            },
          });
        }
      };

      xhr.onerror = () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to upload image. Please try again.",
          customClass: {
            popup: "custom-alert",
          },
        });
      };

      xhr.send(file); // Send the file

    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to upload image. Please try again.",
        customClass: {
          popup: "custom-alert",
        },
      });
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <div>
      <Modal
        open={inputModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ zIndex: (theme) => theme.zIndex.modal + 3 }}
      >
        <Box sx={style}>
          <Typography
            variant="h6"
            sx={{
              color: brand.colors.textPrimary,
              fontWeight: 800,
              mb: 2,
            }}
          >
            Upload Album Cover
          </Typography>
          <Paper
            sx={{
              width: "100%",
              minHeight: 140,
              backgroundColor: brand.colors.cardSolidSurface,
              backgroundImage: "none",
              border: `1px dashed ${brand.colors.borderStrong}`,
              borderRadius: brand.radius.md,
              display: "flex",
              p: 2,
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "none",
            }}
          >
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={brandPrimaryButtonSx}
            >
              Upload album cover
              <input
                type="file"
                id="albumCoverImage"
                name="albumCoverImage"
                className="albumCoverImage"
                accept="image/png, image/jpeg"
                onChange={handleAlbumImageUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </Button>
          </Paper>

          {isLoadingImage && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Typography variant="body2" sx={{ color: brand.colors.textSecondary }}>
                Uploading... {progress}%
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 10,
                  backgroundColor: brand.colors.cardSurface,
                  borderRadius: brand.radius.pill,
                  overflow: "hidden",
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    width: `${progress}%`,
                    height: "100%",
                    background: brand.gradients.accent,
                    transition: "width 0.1s ease-in-out",
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
}
