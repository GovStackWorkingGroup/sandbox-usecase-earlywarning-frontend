import {
  BroadcastOnHome,
  ChatBubbleOutline,
  ContentPasteOutlined,
  MapOutlined,
  Menu as MenuIcon,
  MenuOpen,
  OpenInNew,
  SearchOutlined,
  SpaceDashboardOutlined,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  CSSObject,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  TextField,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import React, { ReactElement, ReactNode, SVGProps, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useNavigation } from 'react-router-dom';

import { useLogout, useUser } from '@/lib/auth';

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  items?: number;
  disabled?: boolean;
};

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

const Logo = () => {
  return (
    <Link to="/">
      <Typography>Early warning</Typography>
    </Link>
  );
};

const Progress = () => {
  const { state, location } = useNavigation();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
  }, [location?.pathname]);

  useEffect(() => {
    if (state === 'loading') {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            return 100;
          }
          const newProgress = oldProgress + 10;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 300);

      return () => {
        clearInterval(timer);
      };
    }
  }, [state]);

  if (state !== 'loading') {
    return null;
  }

  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{ position: 'fixed', top: 0, left: 0, height: 0.5, width: '100%' }}
    />
  );
};

export function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const userMenuOpen = Boolean(anchorEl);
  const handleUserMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const user = useUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const navigation = [
    { name: 'Dashboard', to: '.', icon: SpaceDashboardOutlined },
    { name: 'Threats', to: './threats', icon: ContentPasteOutlined, items: 1 }, // TODO: Add items count
    { name: 'Broadcasts', to: './broadcasts', icon: BroadcastOnHome, items: 4 }, // TODO: Add items count
    { name: 'Feedbacks', to: './feedbacks', icon: ChatBubbleOutline, items: 23 }, // TODO: Add items count
    { name: 'Map View', to: './map-view', icon: MapOutlined, disabled: true },
  ].filter(Boolean) as SideNavigationItem[];

  const footer = [
    { name: 'Drought Watch ICPAC', to: 'https://droughtwatch.icpac.net/', icon: OpenInNew },
    { name: 'Hazard Watch ICPAC', to: 'https://eahazardswatch.icpac.net/', icon: OpenInNew },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
      }}
    >
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ px: 2, gap: 2 }} disableGutters>
          <Progress />

          <IconButton aria-label="collapse" onClick={handleSidebarToggle}>
            {sidebarExpanded ? <MenuOpen /> : <MenuIcon />}
          </IconButton>

          <Logo />

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleUserMenuClick}
              size="small"
              sx={{ ml: 'auto' }}
              aria-controls={userMenuOpen ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={userMenuOpen ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#426834' }}>
                {`${user.data?.firstName[0]}${user.data?.lastName[0]}`.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={userMenuOpen}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 0.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              },
            }}
          >
            <MenuItem onClick={() => navigate('./profile')}>My profile</MenuItem>
            <MenuItem onClick={() => logout.mutate({})}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={sidebarExpanded}
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            overflow: 'auto',
            py: 3,
            px: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ overflow: 'hidden' }}>
            <Box sx={{ width: '100%', mb: 2 }}>
              {sidebarExpanded ? (
                <TextField
                  id="sidebar-search"
                  placeholder="Search"
                  size="small"
                  sx={[{ width: '100%' }, sidebarExpanded ? { mr: 3 } : { mr: 'auto' }]}
                  slotProps={{
                    input: {
                      sx: { pl: 2 },
                      startAdornment: <SearchOutlined />,
                    },
                    htmlInput: {
                      sx: {
                        pl: 1.5,
                        '&::placeholder': {
                          opacity: 1,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <IconButton sx={{ ml: 0.5 }} aria-label="search">
                  <SearchOutlined />
                </IconButton>
              )}
            </Box>
            <List>
              {navigation.map((item) => (
                <ListItem
                  component={NavLink}
                  key={item.name}
                  to={item.to}
                  sx={{
                    borderRadius: 1,
                    '&.active': {
                      backgroundColor: '#C3EFAD',
                    },
                  }}
                  onClick={(e): void => {
                    if (item.disabled) e.preventDefault();
                    else onClick?.(e);
                  }}
                  onKeyDown={(e): void => {
                    if (e.key === 'Enter' && item.disabled) e.preventDefault();
                    else onKeyDown?.(e);
                  }}
                  disablePadding
                >
                  <ListItemButton
                    disabled={item.disabled}
                    sx={[
                      sidebarExpanded
                        ? { justifyContent: 'initial' }
                        : { justifyContent: 'center' },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        { minWidth: 36 },
                        !sidebarExpanded && {
                          mr: 'auto',
                          justifyContent: 'center',
                        },
                      ]}
                    >
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      sx={[sidebarExpanded ? { opacity: 1 } : { opacity: 0 }]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          {sidebarExpanded && (
            <Box sx={{ mt: 'auto', overflow: 'hidden' }}>
              <List>
                {footer.map((item) => (
                  <ListItem
                    component={Link}
                    key={item.name}
                    to={item.to}
                    target="_blank"
                    disablePadding
                  >
                    <ListItemButton sx={{ px: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <item.icon />
                      </ListItemIcon>
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4, pt: 0 }}>
        <Toolbar />
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}
