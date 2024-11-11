import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  ChipProps,
  Divider,
  Icon,
  Typography,
} from '@mui/material';
import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner/spinner';
import { paths } from '@/config/paths';
import { useBroadcast } from '@/features/broadcasts/api/get-broadcast';
import { useThreat } from '@/features/threats/api/get-threat';
import { useUserById } from '@/features/users/api/get-user-by-id';
import { formatDate, formatDateTime, formatPeriod } from '@/utils/format';

const statusMap: { [key: string]: { label: string; color: string } } = {
  SENT: { label: 'Sent', color: '#D8E7CC' },
  PENDING: { label: 'Pending', color: '#DFE4D7' },
  PUBLISHED: { label: 'Published', color: '#DFE4D7' },
  DRAFT: { label: 'Draft', color: '#BCEBED' },
};

const getStatusChip = (status: string) => {
  const { label, color } = statusMap[status] || { label: 'Unknown', color: 'white' };

  return <Chip size="small" label={label} sx={{ backgroundColor: color }} />;
};

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

const pastBroadcasts = [
  {
    title: 'Evacuation Notice',
    periodStart: '2024-07-14T00:00:00',
    countryName: 'Kenya',
    affectedCounties: [{ countyName: 'Makueni County' }],
  },
  {
    title: 'Drought Alert',
    periodStart: '2024-07-14T00:00:00',
    countryName: 'Kenya',
    affectedCounties: [{ countyName: 'Makueni County' }],
  },
  {
    title: 'Evacuation Notice',
    periodStart: '2024-07-14T00:00:00',
    countryName: 'Kenya',
    affectedCounties: [{ countyName: 'Makueni County' }],
  },
  {
    title: 'Evacuation Notice',
    periodStart: '2024-07-14T00:00:00',
    countryName: 'Kenya',
    affectedCounties: [{ countyName: 'Makueni County' }],
  },
  {
    title: 'Evacuation Notice',
    periodStart: '2024-07-14T00:00:00',
    countryName: 'Kenya',
    affectedCounties: [{ countyName: 'Makueni County' }],
  },
];

export const BroadcastView = ({ broadcastId }: { broadcastId: string }) => {
  const broadcastQuery = useBroadcast({ broadcastId });

  const { data: owner, refetch: fetchOwner } = useUserById({
    userId: broadcastQuery.data?.createdBy ?? '',
  });

  const { data: threat, refetch: fetchThreat } = useThreat({
    threatId: broadcastQuery.data?.threatId ?? '',
  });

  useEffect(() => {
    if (broadcastQuery.data?.createdBy) {
      fetchOwner();
    }
  }, [broadcastQuery.data?.createdBy, fetchOwner]);

  useEffect(() => {
    if (broadcastQuery.data?.threatId) {
      fetchThreat();
    }
  }, [broadcastQuery.data?.threatId, fetchThreat]);

  if (broadcastQuery.isLoading) {
    return <Spinner />;
  }

  const broadcast = broadcastQuery?.data;

  if (!broadcast) return null;

  const uniqueCountries = Array.from(
    new Set(threat?.affectedCountries.map((country) => country.countryName)),
  );

  const uniqueCounties = Array.from(
    new Set(
      threat?.affectedCountries.flatMap((country) =>
        country.affectedCounties.map((county) => county.countyName),
      ),
    ),
  );

  return (
    <>
      <Box sx={{ mb: 2 }}>
        {getStatusChip(broadcast.status)}
        <Box display="flex" gap={1.5} alignItems="flex-end" sx={{ height: '36.5px' }}>
          <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
            Broadcast
          </Typography>
          <Typography variant="h5" sx={{ lineHeight: 'normal' }} color="#426834">
            #{broadcast.broadcastNumber}
          </Typography>
          {broadcast.status === 'SENT' && (
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginLeft: 'auto' }}
              startIcon={<Icon baseClassName="material-symbols-outlined">chat_add_on</Icon>}
              onClick={() => console.log('Feedback to Broadcast')}
            >
              Feedback to Broadcast
            </Button>
          )}
        </Box>
      </Box>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'column', lg: 'row' }} gap={3}>
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ flexGrow: 1, width: { xs: '100%', md: '100%', lg: 'auto' } }}
        >
          <Box display="flex" flexDirection="column" gap={1.5}>
            {broadcast.status === 'PENDING' && (
              <Box
                display="flex"
                gap={1.5}
                sx={{
                  backgroundColor: '#00696C',
                  borderRadius: 1,
                  color: 'white',
                  py: 0.75,
                  px: 2,
                }}
              >
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                  <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 22, mt: 0.5 }}>
                    info
                  </Icon>
                </Box>
                <Box display="flex" flexDirection="column" gap={0.5}>
                  <Typography color="white" fontWeight={500}>
                    Broadcast Processing
                  </Typography>
                  <Typography color="white" fontSize={14}>
                    Your message is being prepared for sending. This may take a few moments.
                    We&apos;ll update you once it&apos;s on its way.
                  </Typography>
                </Box>
              </Box>
            )}
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              sx={{
                backgroundColor: '#FFFEFC',
                border: '1px solid #C3C8BB',
                borderRadius: 1,
                p: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Box flex={1} pr={1.5} display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography fontSize={14}>Broadcast Title</Typography>
                    {broadcast.title}
                  </Box>

                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography fontSize={14}>Broadcast Date (Initiated)</Typography>
                    {formatDateTime(broadcast.initiated)}
                  </Box>

                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography fontSize={14}>Broadcast Channel</Typography>
                    SMS {/* FIXME use real channel */}
                  </Box>

                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography fontSize={14}>Languages</Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {/*FIXME no languages in request response*/}
                      {['English', 'Swahili'].map((language) => (
                        <Chip
                          key={language}
                          size="small"
                          sx={{
                            backgroundColor: '#1B5E20',
                            color: 'white',
                            borderColor: '#1B5E20',
                          }}
                          label={language}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Box flex={1} pl={1.5} sx={{ maxWidth: 290 }}>
                  <Box
                    flex={1}
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#BDF6A4',
                      border: '1px solid #C3C8BB',
                      borderRadius: 1,
                      p: 2,
                      display: 'flex',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Box display="flex" flexDirection="column" gap={1.5}>
                      <Box display="flex" gap={1} alignItems="center">
                        <Typography fontSize={20}>Estimated reach</Typography>
                        <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 16 }}>
                          info
                        </Icon>
                      </Box>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography fontSize={48} lineHeight="56px">
                          420.123 {/*FIXME use real reach*/}
                        </Typography>
                        <Typography fontSize={14}>Individuals</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" gap={1}>
                <Typography fontSize={16}>Owner:</Typography>
                <Typography fontSize={16} fontWeight={500} color="#426834">
                  {owner?.firstName} {owner?.lastName}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={1.5}
            sx={{
              backgroundColor: '#FFFEFC',
              border: '1px solid #C3C8BB',
              borderRadius: 1,
              p: 2,
            }}
          >
            <Typography fontWeight={500}>Response Options</Typography>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography>General Response</Typography>
              <Typography fontSize={12} color="#43483F">
                Recipients are allowed to share detailed information about the situation in their
                own words.
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={1.5}
            sx={{
              backgroundColor: '#FFFEFC',
              border: '1px solid #C3C8BB',
              borderRadius: 1,
              p: 2,
            }}
          >
            <Typography fontWeight={500}>Content</Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
              {/*FIXME use real languages*/}
              {['English', 'Swahili'].map((language) => (
                <Fragment key={language}>
                  <Accordion
                    elevation={0}
                    square={true}
                    sx={{
                      border: '1px solid #C3C8BB',
                      borderRadius: 2,
                      '&:before': {
                        display: 'none',
                      },
                    }}
                    disableGutters
                  >
                    <AccordionSummary
                      expandIcon={
                        <Icon baseClassName="material-symbols-outlined">keyboard_arrow_down</Icon>
                      }
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      {language}
                    </AccordionSummary>
                    <AccordionDetails>
                      {language === 'English'
                        ? broadcast.primaryLangMessage
                        : broadcast.secondaryLangMessage}
                    </AccordionDetails>
                  </Accordion>
                </Fragment>
              ))}
            </Box>
            {['DRAFT', 'PROCESSING', 'PENDING'].includes(broadcast.status) && (
              <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => console.log('Button clicked')}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '100%', lg: 270 } }}>
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              backgroundColor: '#FFFEFC',
              border: '1px solid #C3C8BB',
              borderRadius: 1,
            }}
          >
            <Box sx={{ backgroundColor: '#D8E7CC', p: 2 }}>
              <Typography fontSize={20}>Thread Details</Typography>
            </Box>
            <Box display="flex" flexDirection="column" gap={1.5} sx={{ p: 2 }}>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography fontSize={14}>Location</Typography>
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
                    {uniqueCounties.map((county) => (
                      <Fragment key={county}>
                        <Typography fontSize={14} color="#43483F">
                          {county}
                        </Typography>
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
                  {formatPeriod(
                    threat?.periodStart ?? new Date().toDateString(),
                    threat?.periodEnd ?? new Date().toDateString(),
                  )}
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap={1}>
                <Typography fontSize={14}>Severity</Typography>
                {getSeverityChip(threat?.severity ?? '')}
              </Box>

              <Box display="flex" flexDirection="column" gap={1}>
                <Typography fontSize={14}>Alert Type</Typography>
                {getTypeChip(threat?.type ?? '')}
              </Box>

              <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to={paths.app.threat.getHref(broadcast.threatId)}
                >
                  Details
                </Button>
              </Box>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 3.5 }}>
            <Box>
              <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
                Past Broadcasts
              </Typography>
              <Typography fontSize={12} color="#43483F">
                For the Same Threats
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              sx={{
                backgroundColor: '#FFFEFC',
                border: '1px solid #C3C8BB',
                borderRadius: 1,
              }}
            >
              {pastBroadcasts.map((broadcast, index) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="column"
                  gap={0.25}
                  sx={{
                    p: 1.5,
                    '&:not(:last-child)': {
                      borderBottom: '1px solid #C3C8BB',
                    },
                  }}
                >
                  <Typography fontSize={14} fontWeight={500}>
                    {broadcast.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontSize={14} color="#43483F">
                      {broadcast.countryName}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Box display="flex" alignItems="center" gap={1}>
                      {broadcast.affectedCounties.map((county, index) => (
                        <Fragment key={index}>
                          <Typography fontSize={14} color="#43483F">
                            {county.countyName}
                          </Typography>
                          {index < broadcast.affectedCounties.length - 1 && (
                            <Divider orientation="vertical" flexItem />
                          )}
                        </Fragment>
                      ))}
                    </Box>
                  </Box>
                  <Typography fontSize={14} color="#43483F">
                    {formatDate(broadcast.periodStart)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
