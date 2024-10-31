import { Logout, Menu as MenuIcon, MenuOpen, Person } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useNavigation } from 'react-router-dom';

import { paths } from '@/config/paths';
import { useLogout, useUser } from '@/lib/auth';

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
      sx={{ position: 'fixed', top: 0, left: 0, height: '2px', width: '100%' }}
    />
  );
};

const Logo = () => {
  return (
    <Link to={paths.app.dashboard.getHref()} style={{ textDecoration: 'none' }}>
      <Typography sx={{ fontSize: '24px', fontWeight: 300 }}>Early warning</Typography>
    </Link>
  );
};

type HeaderProps = {
  sidebarExpanded: boolean;
  handleSidebarToggle: () => void;
};

export const Header = ({ sidebarExpanded, handleSidebarToggle }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const userMenuOpen = Boolean(anchorEl);
  const handleUserMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const user = useUser();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ px: 2, gap: 2 }} disableGutters>
        <Progress />

        <IconButton aria-label="collapse" onClick={handleSidebarToggle}>
          {sidebarExpanded ? <MenuOpen /> : <MenuIcon />}
        </IconButton>

        <Logo />

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
                filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.32))',
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
          <MenuItem onClick={() => navigate(paths.app.dashboard.path)}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>My profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => logout.mutate({})}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Log out</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
