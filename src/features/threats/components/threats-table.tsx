import {
  Box,
  Chip,
  ChipProps,
  Divider,
  Icon,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';

import { useThreatsByCountry } from '@/features/threats/api/get-threats';
import { Threat } from '@/types/api';

const getThreatIcon = (type: string) => {
  switch (type) {
    case 'Cyclone':
      return 'storm';
    case 'Drought':
      return 'total_dissolved_solids';
    case 'Flood':
      return 'thunderstorm';
    case 'Heatwave':
      return 'thermometer_add';
    case 'Locust':
      return 'pest_control';
    default:
      return null;
  }
};

const getSeverityChip = (severity: string) => {
  let label: string;
  let color: ChipProps['color'];

  switch (severity) {
    case 'HIGH':
      label = 'High';
      color = 'error';
      break;
    case 'MEDIUM':
      label = 'Medium';
      color = 'warning';
      break;
    case 'LOW':
      label = 'Low';
      color = 'success';
      break;
    default:
      label = 'Unknown';
      color = 'default';
  }

  return (
    <Chip
      size="small"
      icon={<Icon baseClassName="material-symbols-outlined">error</Icon>}
      label={label}
      color={color}
    />
  );
};

const formatDate = (dateString: string, includeYear: boolean) => {
  const options: Intl.DateTimeFormatOptions = includeYear
    ? { month: '2-digit', day: '2-digit', year: 'numeric' }
    : { month: '2-digit', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const formatPeriod = (start: string, end: string) => {
  const startDate = formatDate(start, false);
  const endDate = formatDate(end, true);
  return `${startDate} • ${endDate}`;
};

export const ThreatsTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Threat[]>([]);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
  });

  const threatsQuery = useThreatsByCountry({
    country: 'Kenya',
    page: page,
    size: rowsPerPage,
    sort: 'periodStart,desc',
  });

  useEffect(() => {
    if (threatsQuery.data) {
      setRows(threatsQuery.data.content);
      setPagination({
        totalElements: threatsQuery.data.totalElements,
        totalPages: threatsQuery.data.totalPages,
      });
    }
  }, [threatsQuery.data]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const uniqueCountries = Array.from(
    new Set(rows.flatMap((row) => row.affectedCountries.map((country) => country.countryName))),
  );

  const uniqueCounties = Array.from(
    new Set(
      rows.flatMap((row) =>
        row.affectedCountries.flatMap((country) =>
          country.affectedCounties.map((county) => county.countyName),
        ),
      ),
    ),
  );

  return (
    <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 160 }}>Type</TableCell>
            <TableCell sx={{ flex: 1, minWidth: 240 }}>Location</TableCell>
            <TableCell sx={{ width: 136 }}>Severity</TableCell>
            <TableCell sx={{ width: 200 }}>Period</TableCell>
            <TableCell sx={{ width: 120 }}>Broadcasts</TableCell>
            <TableCell sx={{ width: 120 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        {rows.length > 0 ? (
          <>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.threatUUID}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Icon
                        baseClassName="material-symbols-outlined"
                        sx={{ color: '#43483F', mr: 1 }}
                      >
                        {getThreatIcon(row.type)}
                      </Icon>
                      {row.type}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Tooltip
                        arrow
                        title="My Jurisdiction"
                        placement="top"
                        slotProps={{
                          arrow: {
                            sx: {
                              color: '#43483F',
                            },
                          },
                          tooltip: {
                            sx: {
                              width: 'auto',
                              backgroundColor: '#43483F',
                              color: '#F0F5F5',
                            },
                          },
                        }}
                      >
                        <Icon
                          baseClassName="material-symbols-outlined"
                          sx={{ color: '#43483F', mr: 0.5, fontSize: 20 }}
                        >
                          where_to_vote
                        </Icon>
                      </Tooltip>
                      {uniqueCountries.map((country, index) => (
                        <Fragment key={country}>
                          <Typography fontSize={14} color="#191D16">
                            {country}
                          </Typography>
                          {index < uniqueCountries.length - 1 && (
                            <Divider orientation="vertical" sx={{ my: 0.3, mx: 1 }} flexItem />
                          )}
                        </Fragment>
                      ))}
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ pt: 0.5 }}>
                      {uniqueCounties.map((county, index) => (
                        <Fragment key={county}>
                          <Typography fontSize={14} color="#73796E">
                            {county}
                          </Typography>
                          {index < uniqueCounties.length - 1 && (
                            <Divider orientation="vertical" sx={{ my: 0.3, mx: 1 }} flexItem />
                          )}
                        </Fragment>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{getSeverityChip(row.severity)}</TableCell>
                  <TableCell>{formatPeriod(row.periodStart, row.periodEnd)}</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        onClick={() => {
                          console.log('Broadcast');
                        }}
                      >
                        <Icon baseClassName="material-symbols-outlined" sx={{ color: '#426834' }}>
                          broadcast_on_home
                        </Icon>
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          console.log('Open');
                        }}
                      >
                        <Icon baseClassName="material-symbols-outlined" sx={{ color: '#386667' }}>
                          visibility
                        </Icon>
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={6}
                  count={pagination.totalElements}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} sx={{ border: 0 }}>
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
                  <Typography>No active threats in your jurisdiction</Typography>
                  <Typography fontSize={14}>
                    New threats will appear here when they are reported. Monitor this space for
                    updates.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};
