import { Box, Toolbar } from '@mui/material';
import React, { ReactNode, useState } from 'react';

import { Footer } from '@/components/layouts/page/footer';
import { Header } from '@/components/layouts/page/header';
import { Sidebar } from '@/components/layouts/page/sidebar';

export function PageLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
      }}
    >
      <Header sidebarExpanded={sidebarExpanded} handleSidebarToggle={handleSidebarToggle} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar sidebarExpanded={sidebarExpanded} handleSidebarToggle={handleSidebarToggle} />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Toolbar />
          <Box sx={{ flexGrow: 1, p: 4, pt: 2 }}>{children}</Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
