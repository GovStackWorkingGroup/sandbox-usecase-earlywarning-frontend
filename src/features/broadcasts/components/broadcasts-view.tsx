import { Box, Button, Chip, ChipProps, Divider, Icon, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@/components/ui/container/container';
import { paths } from '@/config/paths';
import { useBroadcasts } from '@/features/broadcasts/api/get-broadcasts';
import { BroadcastsTable } from '@/features/broadcasts/components/broadcasts-table';
import { useUser } from '@/lib/auth';
import { Broadcast } from '@/types/api';
import { formatPeriod } from '@/utils/format';

const severityMap: { [key: string]: { label: string; color: ChipProps['color'] } } = {
  HIGH: { label: 'High', color: 'error' },
  MEDIUM: { label: 'Medium', color: 'warning' },
  LOW: { label: 'Low', color: 'success' },
};

const threatMap: { [key: string]: { icon: string } } = {
  Cyclone: { icon: 'storm' },
  Drought: { icon: 'total_dissolved_solids' },
  Flood: { icon: 'thunderstorm' },
  Heatwave: { icon: 'thermometer_add' },
  Locust: { icon: 'pest_control' },
};

const getSeverityChip = (severity: string) => {
  const { label, color } = severityMap[severity] || { label: 'Unknown', color: 'default' };

  return (
    <Chip
      size="small"
      icon={<Icon baseClassName="material-symbols-outlined">error</Icon>}
      label={label}
      color={color}
      sx={{ width: 'fit-content' }}
    />
  );
};

const getTypeChip = (type: string) => {
  const { icon } = threatMap[type] || { icon: 'Unknown' };

  return (
    <Chip
      size="small"
      icon={
        <Icon baseClassName="material-symbols-outlined" sx={{ '&&': { color: '#131F0E' } }}>
          {icon}
        </Icon>
      }
      label={type}
      variant="outlined"
      sx={{ width: 'fit-content', borderColor: '#131F0E' }}
    />
  );
};

export const BroadcastsView = () => {
  const [pendingBroadcasts, setPendingBroadcasts] = useState<Broadcast[]>([]);

  const user = useUser();
  const navigate = useNavigate();

  const pendingBroadcastsQuery = useBroadcasts({
    userId: user.data?.userUUID,
    country: user.data?.country.name,
    status: 'DRAFT',
    active: false,
    size: 5,
    sort: 'periodStart,desc',
  });

  useEffect(() => {
    if (pendingBroadcastsQuery.data) {
      console.log('pendingBroadcastsQuery', pendingBroadcastsQuery.data.content);
      setPendingBroadcasts(pendingBroadcastsQuery.data.content);
    }
  }, [pendingBroadcastsQuery.data]);

  return (
    <Box display="flex" flexDirection="column" gap={4.5}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'column', lg: 'row' }} gap={3}>
        <Box sx={{ flexGrow: 1, width: { xs: '100%', md: '100%', lg: 'auto' } }}>
          <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
            My Pending Broadcasts
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              backgroundColor: '#FFFEFC',
              border: '1px solid #C3C8BB',
              borderRadius: 1,
              mt: 2,
            }}
          >
            {pendingBroadcasts.length > 0 ? (
              pendingBroadcasts.map((pendingBroadcast, index) => (
                <Fragment key={index}>
                  <Box
                    key={index}
                    display="flex"
                    flexDirection="column"
                    gap={1.5}
                    sx={{ p: 2, pt: 1.5, pb: 1 }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography fontSize={12} color="textSecondary">
                          {formatPeriod(pendingBroadcast.periodStart, pendingBroadcast.periodEnd)}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
                          <Typography variant="body1">{pendingBroadcast.countryName}</Typography>
                          <Divider orientation="vertical" sx={{ my: 0.5 }} flexItem />
                          <Box display="flex" alignItems="center" gap={1}>
                            {pendingBroadcast.affectedCounties.map((county, index) => (
                              <Fragment key={county.countyId}>
                                <Typography variant="body1">{county.countyName}</Typography>
                                {index < pendingBroadcast.affectedCounties.length - 1 && (
                                  <Divider orientation="vertical" sx={{ my: 0.5 }} flexItem />
                                )}
                              </Fragment>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Box display="flex" gap={1}>
                        {getSeverityChip('HIGH')} {/*FIXME severity is not in example data*/}
                        {getTypeChip('Drought')} {/*FIXME type is not in example data*/}
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip label="Draft" size="small" sx={{ backgroundColor: '#BCEBED' }} />
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ px: 3 }}
                        onClick={() =>
                          navigate(paths.app.broadcastEdit.getHref(pendingBroadcast.broadcastId))
                        }
                      >
                        Continue
                      </Button>
                    </Box>
                  </Box>
                  {index < pendingBroadcasts.length - 1 && <Divider />}
                </Fragment>
              ))
            ) : (
              <Box
                sx={{
                  my: '128px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Icon
                  baseClassName="material-symbols-outlined"
                  sx={{ mx: 'auto', fontSize: 48, color: '#426834' }}
                >
                  search
                </Icon>
                <Typography>No Pending Broadcasts</Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '100%', lg: 262 } }}>
          <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
            Quick Broadcast
          </Typography>
          <Container
            title="New Broadcast"
            sx={{ backgroundColor: '#C3EFAD', mt: 2 }}
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
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
          Broadcasts
        </Typography>
        <BroadcastsTable showFilters={true} initialRowsPerPage={5} sort="periodStart,desc" />
      </Box>
    </Box>
  );
};
