import { Box, Divider, Grid2 as Grid, Typography } from '@mui/material';
import React from 'react';

import { ContentLayout } from '@/components/layouts';
import Container from '@/components/ui/container/container';
import { ThreatsTable } from '@/features/threats/components/threats-table';

export const DashboardRoute = () => {
  return (
    <ContentLayout title="Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }} sx={{ maxWidth: 1200 }}>
          <Grid container rowSpacing={2} columnSpacing={3}>
            <Grid size={12} display="flex" gap={1.5} alignItems="flex-end">
              <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
                Overview
              </Typography>
              <Typography fontSize={12} letterSpacing={1} textTransform="uppercase">
                Last 7 days
              </Typography>
            </Grid>
            <Grid size={4}>
              <Container
                title="Threats"
                tooltip="Threats are raw information regarding a warning or potential hazard."
              >
                <Box display="flex" justifyContent="space-between" textAlign="center">
                  <Box flex={1} pr={1.5}>
                    <Typography variant="h3">23</Typography>
                    <Typography fontSize={14} color="#43483F">
                      Active
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box flex={1} pl={1.5}>
                    <Typography variant="h3" color="#BA1A1A">
                      12
                    </Typography>
                    <Typography
                      fontSize={14}
                      color="#43483F"
                      sx={{
                        '@media (max-width: 1070px), (min-width: 1340px) and (max-width: 1440px)': {
                          fontSize: 12,
                          mt: 0.4,
                        },
                      }}
                    >
                      High Priority
                    </Typography>
                  </Box>
                </Box>
              </Container>
            </Grid>
            <Grid size={4}>
              <Container
                title="Broadcasts"
                tooltip="Broadcasts are information that is shared with a group of end-users."
              >
                <Box display="flex" justifyContent="space-between" textAlign="center">
                  <Box flex={1} pr={1.5}>
                    <Typography variant="h3">19</Typography>
                    <Typography fontSize={14} color="#43483F">
                      Sent
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box flex={1} pl={1.5}>
                    <Typography variant="h3" color="#426834">
                      12
                    </Typography>
                    <Typography fontSize={14} color="#43483F">
                      Pending
                    </Typography>
                  </Box>
                </Box>
              </Container>
            </Grid>
            <Grid size={4}>
              <Container
                title="Feedbacks"
                tooltip="Feedback are messages received from individual users in response to broadcasts or about ongoing situations."
              >
                <Box display="flex" justifyContent="space-between" textAlign="center">
                  <Box flex={1} pr={1.5}>
                    <Typography variant="h3">421</Typography>
                    <Typography fontSize={14} color="#43483F">
                      Received
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box flex={1} pl={1.5}>
                    <Typography variant="h3" color="#426834">
                      6
                    </Typography>
                    <Typography fontSize={14} color="#43483F">
                      Today
                    </Typography>
                  </Box>
                </Box>
              </Container>
            </Grid>
            <Grid size={12} sx={{ mt: '20px' }}>
              <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
                Quick Actions
              </Typography>
            </Grid>
            <Grid size={4}>
              <Container
                title="New Broadcast"
                sx={{ backgroundColor: '#C3EFAD', height: '100%' }}
                button={{
                  text: 'Create new',
                  action: () => {
                    console.log('Create broadcast');
                  },
                }}
              >
                <Typography color="#43483F" fontSize={14} sx={{ minHeight: 42 }}>
                  There are 6 new threats waiting for a broadcast.
                </Typography>
              </Container>
            </Grid>
            <Grid size={4}>
              <Container
                title="View Broadcasts"
                sx={{ height: '100%' }}
                button={{
                  text: 'View all',
                  action: () => {
                    console.log('View all broadcasts');
                  },
                }}
              >
                <Typography color="#43483F" fontSize={14} sx={{ minHeight: 42 }}>
                  There are 4 broadcasts created by you last week.
                </Typography>
              </Container>
            </Grid>
            <Grid size={4}>
              <Container
                title="View Feedbacks"
                sx={{ height: '100%' }}
                button={{
                  text: 'View all',
                  action: () => {
                    console.log('View all feedbacks');
                  },
                }}
              >
                <Typography color="#43483F" fontSize={14} sx={{ minHeight: 42 }}>
                  There are 8 new feedback for today.
                </Typography>
              </Container>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, lg: 'grow' }}>
          <Typography variant="h5" sx={{ lineHeight: 'normal', mb: 2 }}>
            Latest Broadcasts
          </Typography>
          <Container sx={{ p: 0, height: 'calc(100% - 44px)' }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  px: 1.5,
                  py: 1.85,
                  '&:not(:last-child)': {
                    borderBottom: '1px solid #C3C8BB',
                  },
                }}
              >
                <Typography fontSize={14} fontWeight={500}>
                  Broadcast {index + 1}
                </Typography>
                <Box display="flex" alignItems="center" sx={{ pt: 1 }}>
                  <Typography fontSize={14} color="#43483F" sx={{ pr: 1 }}>
                    Kenya
                  </Typography>
                  <Divider orientation="vertical" sx={{ my: 0.3 }} flexItem />
                  <Typography fontSize={14} color="#43483F" sx={{ pl: 1 }}>
                    Oromia
                  </Typography>
                </Box>
              </Box>
            ))}
          </Container>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4.5 }}>
        <Typography variant="h5" sx={{ lineHeight: 'normal', mb: 0.5 }}>
          Recent Threats
        </Typography>
        <Typography fontSize={12} color="#43483F" letterSpacing={0.4}>
          Within My Jurisdiction
        </Typography>
        <ThreatsTable country="Kenya" initialRowsPerPage={5} sort="periodStart,desc" />
      </Box>
    </ContentLayout>
  );
};
