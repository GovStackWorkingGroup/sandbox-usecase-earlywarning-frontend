import { createTheme } from '@mui/material';

const TOOLBAR_HEIGHT = 48;

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#426834',
      dark: '#304e25',
      light: '#C3EFAD',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#27D0C7',
    },
    background: {
      paper: '#FFFEFC',
      default: '#FCF9F6',
    },
    text: {
      primary: '#191D16',
      secondary: '#43483F',
      disabled: '#73796E',
    },
    error: {
      main: '#BA1A1A',
    },
    warning: {
      main: '#EF6C00',
    },
    info: {
      main: '#00696C',
    },
    divider: '#C3C8BB',
  },
  typography: {
    allVariants: {
      color: '#191D16',
    },
    fontFamily: 'Inter',
    h1: {
      fontWeight: 300,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        root: {
          width: 240,
        },
        paper: {
          width: 240,
          backgroundColor: 'inherit',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#EDEFE4',
          borderBottom: '1px solid #E0E0E0',
          color: '#1C6D00',
          boxShadow: 'none',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#131F0E',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          '&[role="menu"]': {
            backgroundColor: '#FCF9F6',
          },
        },
      },
    },
  },
  mixins: {
    toolbar: {
      height: TOOLBAR_HEIGHT,
      minHeight: TOOLBAR_HEIGHT,
    },
  },
});
