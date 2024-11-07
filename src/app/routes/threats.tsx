import { Box, Typography } from '@mui/material';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';
import { LoaderFunctionArgs } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { getThreatsByCountryQueryOptions } from '@/features/threats/api/get-threats';
import { ThreatsTable } from '@/features/threats/components/threats-table';

export const threatsLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const country = url.searchParams.get('country') ?? '';

    const query = getThreatsByCountryQueryOptions({ country });

    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
  };

export const ThreatsRoute = () => {
  return (
    <ContentLayout title="Threats">
      <Box display="flex" flexDirection="column" gap={4.5}>
        <Box>
          <Typography variant="h5" sx={{ lineHeight: 'normal', mb: 0.5 }}>
            Recent Threats
          </Typography>
          <Typography fontSize={12} color="#43483F" letterSpacing={0.4}>
            Recently Received Threats Within My Jurisdiction
          </Typography>
          <ThreatsTable
            country="Kenya"
            initialRowsPerPage={5}
            sort="periodStart,desc"
            showPagination={false}
          />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ lineHeight: 'normal', mb: 0.5 }}>
            All Threats
          </Typography>
          <ThreatsTable
            country="Kenya"
            initialRowsPerPage={10}
            sort="periodStart,desc"
            showFilters={true}
          />
        </Box>
      </Box>
    </ContentLayout>
  );
};
