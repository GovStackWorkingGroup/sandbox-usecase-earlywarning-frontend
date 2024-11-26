import { Box, Toolbar, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';

import { Footer } from '@/components/layouts/page/footer';
import { Header } from '@/components/layouts/page/header';
import { Sidebar } from '@/components/layouts/page/sidebar';
import { SidebarLogViewer } from '@/components/layouts/page/sidebar-log-viewer';
import { logViewerWidth } from '@/config/theme';
import { useDrawer } from '@/hooks/use-drawer';

export function PageLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { isOpen: isSidebarOpen, open: openSidebar, toggle: toggleSidebar } = useDrawer(true);
  const { isOpen: isLogViewerOpen, toggle: toggleLogViewer } = useDrawer(false);

  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
      }}
    >
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isLogViewerOpen={isLogViewerOpen}
      />
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          width: isLogViewerOpen ? `calc(100% - ${logViewerWidth}px)` : '100%',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: isLogViewerOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} openSidebar={openSidebar} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            pt: 0,
            minWidth: isLogViewerOpen ? `calc(750px - ${logViewerWidth}px)` : '750px',
          }}
        >
          <Toolbar />
          {children}
          <Footer />
        </Box>
      </Box>
      <SidebarLogViewer isLogViewerOpen={isLogViewerOpen} toggleLogViewer={toggleLogViewer} />
    </Box>
  );
}
