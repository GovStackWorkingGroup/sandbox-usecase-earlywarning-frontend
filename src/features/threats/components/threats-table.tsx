import {
  Badge,
  Box,
  Checkbox,
  Chip,
  ChipProps,
  Divider,
  FormControlLabel,
  Icon,
  IconButton,
  Menu,
  MenuItem,
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
import { Link } from 'react-router-dom';

import { paths } from '@/config/paths';
import { useThreats } from '@/features/threats/api/get-threats';
import { useUser } from '@/lib/auth';
import { Threat } from '@/types/api';
import { formatPeriod } from '@/utils/format';

const threatIcons: { [key: string]: string } = {
  Cyclone: 'storm',
  Drought: 'total_dissolved_solids',
  Flood: 'thunderstorm',
  Heatwave: 'thermometer_add',
  Locust: 'pest_control',
};

const getThreatIcon = (type: string) => {
  const icon = threatIcons[type] || '';

  return (
    <Icon baseClassName="material-symbols-outlined" sx={{ color: '#43483F', mr: 1 }}>
      {icon}
    </Icon>
  );
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
    />
  );
};

export type ThreatsTableProps = {
  initialRowsPerPage: number;
  sort: string;
  showPagination?: boolean;
  showFilters?: boolean;
};

export const ThreatsTable = ({
  initialRowsPerPage,
  sort,
  showPagination = true,
  showFilters = false,
}: ThreatsTableProps) => {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Threat[]>([]);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
  });
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filterWithinJurisdiction, setFilterWithinJurisdiction] = useState(false);
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  const user = useUser();

  const threatsQuery = useThreats({
    country: filterWithinJurisdiction ? user.data?.country.name : undefined,
    active: filterActiveOnly,
    page: page,
    size: rowsPerPage,
    sort: sort,
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

  const filterOpen = Boolean(filterAnchorEl);

  const handleFilterButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterWithinJurisdictionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterWithinJurisdiction(event.target.checked);
    setPage(0);
  };

  const handleFilterActiveOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterActiveOnly(event.target.checked);
    setPage(0);
  };

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

  const activeFiltersCount = [filterWithinJurisdiction, filterActiveOnly].filter(Boolean).length;

  return (
    <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          {showFilters && (
            <TableRow sx={{ backgroundColor: '#D8E7CC' }}>
              <TableCell colSpan={6} sx={{ py: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontSize={20}>Threat list</Typography>
                  <IconButton
                    onClick={handleFilterButtonClick}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.12)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <Badge
                      badgeContent={activeFiltersCount}
                      sx={{ '& .MuiBadge-badge': { backgroundColor: '#426834', color: 'white' } }}
                    >
                      <Icon baseClassName="material-symbols-outlined" sx={{ color: '#386667' }}>
                        filter_list
                      </Icon>
                    </Badge>
                  </IconButton>
                  <Menu
                    anchorEl={filterAnchorEl}
                    open={filterOpen}
                    onClose={handleFilterClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.32))',
                          mt: 0.5,
                          '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disableRipple={true}
                            checked={filterWithinJurisdiction}
                            onChange={handleFilterWithinJurisdictionChange}
                          />
                        }
                        label="Within Jurisdiction"
                      />
                    </MenuItem>
                    <MenuItem>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filterActiveOnly}
                            onChange={handleFilterActiveOnlyChange}
                          />
                        }
                        label="Active Only"
                      />
                    </MenuItem>
                  </Menu>
                </Box>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell sx={{ width: 160, minWidth: 160 }}>Type</TableCell>
            <TableCell sx={{ flex: 1, minWidth: 240 }}>Location</TableCell>
            <TableCell sx={{ width: 136, minWidth: 136 }}>Severity</TableCell>
            <TableCell sx={{ width: 200, minWidth: 200 }}>Period</TableCell>
            <TableCell sx={{ width: 120, minWidth: 120 }}>Broadcasts</TableCell>
            <TableCell sx={{ width: 120, minWidth: 120 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        {rows.length > 0 ? (
          <>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.threatId}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getThreatIcon(row.type)}
                      {row.type}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {uniqueCountries.map((country, index) => (
                        <Fragment key={country}>
                          {country === user.data?.country.name && (
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
                          )}
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
                          <Typography fontSize={14} color="#73796E" whiteSpace="nowrap">
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
                  <TableCell>{formatPeriod(row.periodStart, row.periodEnd, false)}</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {/*FIXME link to broadcast*/}
                      <IconButton
                        onClick={() => {
                          console.log('Broadcast');
                        }}
                      >
                        <Icon baseClassName="material-symbols-outlined" sx={{ color: '#426834' }}>
                          broadcast_on_home
                        </Icon>
                      </IconButton>
                      <IconButton component={Link} to={paths.app.threat.getHref(row.threatId)}>
                        <Icon baseClassName="material-symbols-outlined" sx={{ color: '#386667' }}>
                          visibility
                        </Icon>
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {showPagination && (
              <TableFooter>
                <TableRow sx={{ border: 0 }}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    colSpan={6}
                    count={pagination.totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            )}
          </>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>
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
                  <Typography>No threats to show</Typography>
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
