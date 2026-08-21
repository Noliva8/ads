import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { brand } from "./brand";



// color design token
// ------------------

export const tokens = (mode) => ({
    ...(mode === 'dark')?
    {
white: {
  100: "#ffffff",
  200: "#f5f5f5",
  300: "#e5e5e5",
  400: "#d4d4d4",
  500: "#c4c4c4",
  600: "#a3a3a3",
  700: "#737373",
  800: "#525252",
  900: "#404040"
},
whiteSoft: "#f5f5f5",
whiteMuted: "#d4d4d4",
        blackAccent: {
    100: "#d0d0d0",
    200: "#a0a0a0",
    300: "#717171",
    400: "#414141",
    500: "#121212",
    600: "#0e0e0e",
    700: "#0b0b0b",
    800: "#070707",
    900: "#040404"
},
blackNeutral: {
    100: "#d2d2d2",
    200: "#a5a5a5",
    300: "#787878",
    400: "#4b4b4b",
    500: "#1e1e1e",
    600: "#181818",
    700: "#121212",
    800: "#0c0c0c",
    900: "#060606"
},
graySoft: {
    100: "#d3d3d3",
    200: "#a8a8a8",
    300: "#7c7c7c",
    400: "#515151",
    500: "#252525",
    600: "#1e1e1e",
    700: "#161616",
    800: "#0f0f0f",
    900: "#070707"
},
orangeAccent: {
    100: "#fff9da",
    200: "#fff1b5",
    300: "#fde687",
    400: brand.colors.accentHover,
    500: brand.colors.accent,
    600: "#b69d1a",
    700: "#887614",
    800: "#5b4e0d",
    900: "#2d2707"
},

orange: {
    100: "#fff9da",
    200: "#fff1b5",
    300: "#fde687",
    400: brand.colors.accentHover,
    500: brand.colors.accent,
    600: "#b69d1a",
    700: "#887614",
    800: "#5b4e0d",
    900: "#2d2707"
},
redAccent: {
    100: "#fae1d7",
    200: "#f5c3af",
    300: "#efa686",
    400: "#ea885e",
    500: "#e56a36",
    600: "#b7552b",
    700: "#894020",
    800: "#5c2a16",
    900: "#2e150b"
},
greenAccent: {
  100: "#d1f7e2",
  200: "#a3efc6",
  300: "#75e7a9",
  400: "#47df8d",
  500: "#19d770",
  600: "#14ac5a",
  700: "#0f8043",
  800: "#0a552d",
  900: "#052916"
}



    }:{
        // light mode in future if needed
        // =============================

  white: {
    100: "#ffffff",
    200: "#f5f5f5",
    300: "#e5e5e5",
    400: "#d4d4d4",
    500: "#c4c4c4",
    600: "#a3a3a3",
    700: "#737373",
    800: "#525252",
    900: "#404040"
  },
  whiteSoft: "#f5f5f5",
  whiteMuted: "#d4d4d4",
        blackAccent: {
    100: "#040404",
    200: "#070707",
    300: "#0b0b0b",
    400: "#0e0e0e",
    500: "#121212",
    600: "#414141",
    700: "#717171",
    800: "#a0a0a0",
    900: "#d0d0d0"
},
blackNeutral: {
    100: "#060606",
    200: "#0c0c0c",
    300: "#121212",
    400: "#181818",
    500: "#1e1e1e",
    600: "#4b4b4b",
    700: "#787878",
    800: "#a5a5a5",
    900: "#d2d2d2",
},
graySoft: {
    100: "#070707",
    200: "#0f0f0f",
    300: "#161616",
    400: "#1e1e1e",
    500: "#252525",
    600: "#515151",
    700: "#7c7c7c",
    800: "#a8a8a8",
    900: "#d3d3d3",
},
orangeAccent: {
    100: "#2d2707",
    200: "#5b4e0d",
    300: "#887614",
    400: "#b69d1a",
    500: brand.colors.accent,
    600: brand.colors.accentHover,
    700: "#fde687",
    800: "#fff1b5",
    900: "#fff9da",
},

orange: {
    100: "#2d2707",
    200: "#5b4e0d",
    300: "#887614",
    400: "#b69d1a",
    500: brand.colors.accent,
    600: brand.colors.accentHover,
    700: "#fde687",
    800: "#fff1b5",
    900: "#fff9da"
},

redAccent: {
    100: "#2e150b",
    200: "#5c2a16",
    300: "#894020",
    400: "#b7552b",
    500: "#e56a36",
    600: "#ea885e",
    700: "#efa686",
    800: "#f5c3af",
    900: "#fae1d7",
},
greenAccent: {
  100: "#052916",
  200: "#0a552d",
  300: "#0f8043",
  400: "#14ac5a",
  500: "#19d770",
  600: "#47df8d",
  700: "#75e7a9",
  800: "#a3efc6",
  900: "#d1f7e2"
}


    }
})

// Mui theme settings

export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            primary: {
              main: colors.orangeAccent[500], // Highlight color
            },
            secondary: {
              main: colors.redAccent[500], // Accent secondary
            },
            neutral: {
              dark: colors.graySoft[700],
              main: colors.graySoft[500],
              light: colors.graySoft[100],
            },
            background: {
              default: brand.colors.background,
              paper: brand.colors.surface,
            },
            text: {
              primary: brand.colors.textPrimary,
              secondary: brand.colors.textSecondary,
            },
          }
        : {
            primary: {
              main: brand.colors.accent,
            },
            secondary: {
              main: colors.redAccent[500],
            },
            neutral: {
              dark: colors.graySoft[100],
              main: colors.graySoft[300],
              light: colors.graySoft[900], // softest light gray
            },
            background: {
              default: "#ffffff",
              paper: colors.graySoft[100],
            },
            text: {
              primary: colors.blackAccent[900],
              secondary: colors.blackNeutral[700],
            },
          }),
    },

    // typography

    typography: {
        fontFamily: brand.typography.fontFamily,
        fontSize: brand.typography.baseSize,
        h1: {
             fontFamily: brand.typography.fontFamily,
             fontSize: 40

        },
          h2: {
             fontFamily: brand.typography.fontFamily,
             fontSize: 32

        },
          h3: {
             fontFamily: brand.typography.fontFamily,
             fontSize: 24

        },
          h4: {
             fontFamily: brand.typography.fontFamily,
             fontSize: 20

        },
          h5: {
             fontFamily: brand.typography.fontFamily,
             fontSize: 16

        },
          h6: {
             fontFamily: brand.typography.fontFamily,
             fontSize: 14

        },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: brand.colors.cardSurface,
            backgroundImage: "none",
            borderRadius: brand.radius.lg,
            border: `1px solid ${brand.colors.cardBorder}`,
            boxShadow: "none",
            backdropFilter: "blur(10px)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
            "&:hover": {
              transform: "translateY(-10px)",
              backgroundColor: brand.colors.cardSurfaceHover,
              backgroundImage: "none",
              boxShadow: brand.shadow.cardHover,
            },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: brand.spacing.cardPadding,
            "&:last-child": {
              paddingBottom: brand.spacing.cardPadding,
            },
          },
        },
      },
    },
  };
};


// Context for the colors

export const ColorModeContext = createContext(
    {
        toggleColorMode: ()=> {

        }
    }
)

export const useMode = () => {
    const [ mode , setMode ] = useState('dark');
    const colorMode = useMemo(
    () => ({
        toggleColorMode: () => 
        setMode((prev) => (prev === 'light'? 'dark': 'light'))
    }),
    []
);

const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
return [theme, colorMode];
}
