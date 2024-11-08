import { Box, Typography } from '@mui/material';
import React from 'react';

import { ThreatsTable } from '@/features/threats/components/threats-table';

export const ThreatsView = () => {
  return (
    <Box display="flex" flexDirection="column" gap={4.5}>
      <Box>
        <Typography variant="h5" sx={{ lineHeight: 'normal', mb: 0.5 }}>
          Recent Threats
        </Typography>
        <Typography fontSize={12} color="#43483F" letterSpacing={0.4}>
          Recently Received Threats Within My Jurisdiction
        </Typography>
        <ThreatsTable initialRowsPerPage={5} sort="periodStart,desc" showPagination={false} />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ lineHeight: 'normal', mb: 0.5 }}>
          All Threats
        </Typography>
        <ThreatsTable initialRowsPerPage={10} sort="periodStart,desc" showFilters={true} />
      </Box>
    </Box>
  );
};
