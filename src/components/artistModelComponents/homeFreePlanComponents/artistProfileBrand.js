import { alpha } from "@mui/material/styles";
import {
  brand,
  brandOutlinedButtonSx,
  brandPanelSx,
  brandPrimaryButtonSx,
} from "../../../brand";

export const artistProfileColors = {
  textPrimary: brand.colors.textPrimary,
  textSecondary: brand.colors.textSecondary,
  surface: brand.colors.cardSolidSurface,
  panel: brand.colors.cardSurface,
  panelStrong: alpha(brand.colors.dark, 0.42),
  border: brand.colors.cardBorder,
  borderStrong: brand.colors.borderStrong,
  accent: brand.colors.accent,
  accentSoft: brand.colors.accentSoft,
};

export const artistProfileModalSx = ({ isMobile, isTablet = false, maxWidth = "400px" }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: isMobile ? "calc(100% - 24px)" : isTablet ? "85%" : "90%",
  maxWidth,
  bgcolor: brand.colors.cardSolidSurface,
  color: brand.colors.textPrimary,
  border: `1px solid ${brand.colors.cardBorder}`,
  boxShadow: brand.shadow.lg,
  p: isMobile ? 2 : 4,
  borderRadius: brand.radius.md,
  maxHeight: "90vh",
  overflowY: "auto",
});

export const artistProfileCardSx = ({ isMobile = false, wide = false } = {}) => ({
  backgroundColor: brand.colors.cardSurface,
  color: brand.colors.textPrimary,
  borderRadius: brand.radius.md,
  width: "100%",
  maxWidth: wide ? "100%" : { xs: "100%", sm: 600 },
  minHeight: wide ? "auto" : { xs: "auto", sm: 210 },
  height: "100%",
  margin: 0,
  padding: wide ? (isMobile ? "14px" : "18px") : { xs: "12px", sm: "18px" },
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${brand.colors.cardBorder}`,
  boxShadow: "none",
  transition: "border-color 0.2s ease, background-color 0.2s ease",
  "&:hover": {
    borderColor: brand.colors.borderStrong,
    backgroundColor: brand.colors.cardSurfaceHover,
  },
});

export const artistProfileValueSx = ({ isMobile = false, textAlign = "left" } = {}) => ({
  ...brandPanelSx,
  backgroundColor: artistProfileColors.panelStrong,
  color: brand.colors.textPrimary,
  padding: isMobile ? "0.75rem" : "1rem",
  minHeight: 56,
  maxWidth: "100%",
  overflowY: "auto",
  overflowWrap: "anywhere",
  lineHeight: "1.6em",
  textAlign,
  whiteSpace: "pre-wrap",
});

export const artistProfileEditButtonSx = {
  ...brandOutlinedButtonSx,
  borderColor: brand.colors.borderStrong,
  color: brand.colors.textPrimary,
  fontWeight: 700,
  borderRadius: brand.radius.md,
  backgroundColor: alpha(brand.colors.white, 0.08),
  "&:hover": {
    borderColor: brand.colors.accent,
    backgroundColor: brand.colors.accentSoft,
    color: brand.colors.accentHover,
  },
  "&.Mui-disabled": {
    borderColor: brand.colors.cardBorder,
    color: brand.colors.textMuted,
    backgroundColor: alpha(brand.colors.white, 0.04),
  },
};

export const artistProfilePrimaryButtonSx = {
  ...brandPrimaryButtonSx,
  borderRadius: brand.radius.md,
};

export const artistProfileFormLabelSx = {
  color: brand.colors.textSecondary,
  fontWeight: 700,
  letterSpacing: "0.03em",
};

export const artistProfileTextAreaStyle = {
  width: "100%",
  marginTop: "10px",
  padding: "0.8rem",
  backgroundColor: alpha(brand.colors.dark, 0.72),
  color: brand.colors.textPrimary,
  borderRadius: "5px",
  border: `1px solid ${brand.colors.cardBorder}`,
  fontSize: "1rem",
};
