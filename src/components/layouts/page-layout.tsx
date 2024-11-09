import { Box, Toolbar } from '@mui/material';
import React, { ReactNode } from 'react';

import { Footer } from '@/components/layouts/page/footer';
import { Header } from '@/components/layouts/page/header';
import { Sidebar } from '@/components/layouts/page/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';

export function PageLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { isSidebarOpen, openSidebar, toggleSidebar } = useSidebar(true);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
      }}
    >
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar isSidebarOpen={isSidebarOpen} openSidebar={openSidebar} />
        <Box
          component="main"
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, pt: 0, minWidth: 750 }}
        >
          <Toolbar />
          {children}
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
