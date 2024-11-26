import {
  Box,
  Button,
  Chip,
  ChipProps,
  CircularProgress,
  Divider,
  Icon,
  Typography,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import mapExample1 from '@/assets/map-example-1.png';
import mapExample2 from '@/assets/map-example-2.png';
import mapExample3 from '@/assets/map-example-3.png';
import mapExample4 from '@/assets/map-example-4.png';
import { Spinner } from '@/components/ui/spinner/spinner';
import { paths } from '@/config/paths';
import { useCreateBroadcast } from '@/features/broadcasts/api/create-broadcast';
import { BroadcastsTable } from '@/features/broadcasts/components/broadcasts-table';
import { useThreat } from '@/features/threats/api/get-threat';
import { formatPeriod } from '@/utils/format';

const mapExamples = [mapExample1, mapExample2, mapExample3, mapExample4];

const severityMap: { [key: string]: { label: string; color: ChipProps['color'] } } = {
  HIGH: { label: 'High', color: 'error' },
  MEDIUM: { label: 'Medium', color: 'warning' },
  LOW: { label: 'Low', color: 'success' },
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

const threatMap: { [key: string]: { icon: string } } = {
  Cyclone: { icon: 'storm' },
  Drought: { icon: 'total_dissolved_solids' },
  Flood: { icon: 'thunderstorm' },
  Heatwave: { icon: 'thermometer_add' },
  Locust: { icon: 'pest_control' },
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

const historyData = [
  {
    icon: 'fmd_bad',
    text: 'Threat Created',
    date: '12/12/2024',
  },
  {
    icon: 'broadcast_on_home',
    text: 'Broadcast Created',
    date: '12/12/2024',
  },
  {
    icon: 'flag',
    text: 'Threat Started',
    date: '12/12/2024',
  },
  {
    icon: 'broadcast_on_home',
    text: 'Broadcast Created',
    date: '12/12/2024',
  },
  {
    icon: 'chat_add_on',
    text: 'Feedback',
    date: '12/12/2024',
  },
  {
    icon: 'broadcast_on_home',
    text: 'Broadcast Created',
    date: '12/12/2024',
  },
  {
    icon: 'broadcast_on_home',
    text: 'Broadcast Created',
    date: '12/12/2024',
  },
  {
    icon: 'flag',
    text: 'Threat End',
    date: '12/12/2024',
  },
];

export const ThreatView = ({ threatId }: { threatId: string }) => {
  const navigate = useNavigate();

  const threatQuery = useThreat({
    threatId,
  });

  const [selectedMap, setSelectedMap] = useState<string>('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * mapExamples.length);
    setSelectedMap(mapExamples[randomIndex]);
  }, []);

  const createBroadcastMutation = useCreateBroadcast({
    mutationConfig: {
      onSuccess: (data) => {
        navigate(paths.app.broadcastEdit.getHref(data.broadcastId));
      },
    },
  });

  if (threatQuery.isLoading) {
    return <Spinner />;
  }

  const threat = threatQuery?.data;

  if (!threat) return null;

  const uniqueCountries = Array.from(
    new Set(threat.affectedCountries.map((country) => country.countryName)),
  );

  const uniqueCounties = Array.from(
    new Set(
      threat.affectedCountries.flatMap((country) =>
        country.affectedCounties.map((county) => county.countyName),
      ),
    ),
  );

  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'column', lg: 'row' }} gap={3}>
      <Box
        display="flex"
        flexDirection="column"
        gap={4.5}
        sx={{ flexGrow: 1, width: { xs: '100%', md: '100%', lg: 'auto' } }}
      >
        <Box>
          {threat.active && (
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: -0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#A7D293',
                  borderRadius: '50%',
                }}
              />
              <Typography color="#426834">Active</Typography>
            </Box>
          )}
          <Box display="flex" gap={1.5} alignItems="flex-end">
            <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
              Threat
            </Typography>
            <Typography variant="h5" sx={{ lineHeight: 'normal' }} color="#426834">
              #{threat.threatNumber}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginLeft: 'auto' }}
              startIcon={<Icon baseClassName="material-symbols-outlined">chat_add_on</Icon>}
              onClick={() => console.log('Feedback to ICPAC')}
            >
              Feedback to ICPAC
            </Button>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            sx={{
              backgroundColor: '#FFFEFC',
              border: '1px solid #C3C8BB',
              borderRadius: 1,
              padding: 2,
              mt: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box flex={1} pr={1.5} display="flex" flexDirection="column" gap={2}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography fontSize={14}>Location Within My Jurisdiction</Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <Icon
                      baseClassName="material-symbols-outlined"
                      sx={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </Icon>
                    <Box>
                      {uniqueCountries.map((country, index) => (
                        <Fragment key={country}>
                          <Typography color="#191D16">{country}</Typography>
                          {index < uniqueCountries.length - 1 && (
                            <Divider orientation="vertical" sx={{ my: 0.3, mx: 1 }} flexItem />
                          )}
                        </Fragment>
                      ))}
                      {uniqueCounties.map((county, index) => (
                        <Fragment key={county}>
                          <Typography fontSize={14} color="#43483F">
                            {county}
                          </Typography>
                          {index < uniqueCounties.length - 1 && (
                            <Divider orientation="vertical" sx={{ my: 0.3, mx: 1 }} flexItem />
                          )}
                        </Fragment>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography fontSize={14}>Period</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon
                      baseClassName="material-symbols-outlined"
                      sx={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      calendar_today
                    </Icon>
                    {formatPeriod(threat.periodStart, threat.periodEnd)}
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography fontSize={14}>Severity</Typography>
                  {getSeverityChip(threat.severity)}
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography fontSize={14}>Alert Type</Typography>
                  {getTypeChip(threat.type)}
                </Box>
              </Box>
              <Box flex={1} pl={1.5}>
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    backgroundImage: `url(${selectedMap})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid #C3C8BB',
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography fontSize={14}>Notes</Typography>
              {threat.notes ? (
                <Typography fontSize={14}>{threat.notes}</Typography>
              ) : (
                <Typography fontSize={14} color="#73796E">
                  No notes added yet.
                </Typography>
              )}
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button
                variant="text"
                startIcon={
                  <Icon
                    baseClassName="material-symbols-outlined"
                    sx={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    download
                  </Icon>
                }
                onClick={() => console.log('Download as PDF clicked')}
                disabled
              >
                Download as PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<Icon baseClassName="material-symbols-outlined">edit</Icon>}
                onClick={() => console.log('Edit note')}
              >
                Edit note
              </Button>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
              Broadcasts
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#65D243', color: '#042100' }}
              startIcon={
                createBroadcastMutation.isPending ? (
                  <CircularProgress size="20px" sx={{ color: 'rgba(0, 0, 0, 0.26)' }} />
                ) : (
                  <Icon baseClassName="material-symbols-outlined">add</Icon>
                )
              }
              onClick={() => {
                createBroadcastMutation.mutate({
                  threatId,
                });
              }}
              disabled={createBroadcastMutation.isPending}
            >
              Add broadcast
            </Button>
          </Box>
          <BroadcastsTable showFilters={true} initialRowsPerPage={5} sort="periodStart,desc" />
        </Box>
      </Box>
      <Box sx={{ pt: threat.active ? 3.5 : 1, width: { xs: '100%', md: '100%', lg: 230 } }}>
        <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
          History
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            backgroundColor: '#FFFEFC',
            border: '1px solid #C3C8BB',
            borderRadius: 1,
            padding: 2,
            mt: 2,
          }}
        >
          {historyData.map((item, index) => (
            <Fragment key={index}>
              <Box display="flex" alignItems="center" position="relative" gap={2}>
                <Icon
                  baseClassName="material-symbols-outlined"
                  sx={{
                    color: '#426834',
                    fontVariationSettings: item.text === 'Threat End' ? "'FILL' 1" : undefined,
                  }}
                >
                  {item.icon}
                </Icon>
                <Box>
                  <Typography fontSize={12} letterSpacing={1} noWrap>
                    {item.text.toUpperCase()}
                  </Typography>
                  <Typography fontSize={14} color="#43483F">
                    {item.date}
                  </Typography>
                </Box>
              </Box>
              {index !== historyData.length - 1 && (
                <Box
                  sx={{
                    ml: '11px',
                    height: '34px',
                    width: '2px',
                    backgroundColor: '#73796E',
                  }}
                />
              )}
            </Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
