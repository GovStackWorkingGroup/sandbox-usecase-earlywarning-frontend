import {
  Badge,
  Box,
  Checkbox,
  Chip,
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
  Typography,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { paths } from '@/config/paths';
import { useBroadcasts } from '@/features/broadcasts/api/get-broadcasts';
import { useUser } from '@/lib/auth';
import { Broadcast } from '@/types/api';
import { formatDate } from '@/utils/format';

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

export type BroadcastsTableProps = {
  initialRowsPerPage: number;
  sort: string;
  showPagination?: boolean;
  showFilters?: boolean;
};

export const BroadcastsTable = ({
  initialRowsPerPage,
  sort,
  showPagination = true,
  showFilters = false,
}: BroadcastsTableProps) => {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Broadcast[]>([]);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
  });
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filterMineOnly, setFilterMineOnly] = useState(false);
  const [filterWithinJurisdiction, setFilterWithinJurisdiction] = useState(false);
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  const user = useUser();

  const broadcastsQuery = useBroadcasts({
    country: filterWithinJurisdiction ? user.data?.country.name : undefined,
    userId: filterMineOnly ? user.data?.userUUID : undefined,
    active: filterActiveOnly,
    page: page,
    size: rowsPerPage,
    sort: sort,
  });

  useEffect(() => {
    if (broadcastsQuery.data) {
      setRows(broadcastsQuery.data.content);
      setPagination({
        totalElements: broadcastsQuery.data.totalElements,
        totalPages: broadcastsQuery.data.totalPages,
      });
    }
  }, [broadcastsQuery.data]);

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

  const handleFilterMineOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterMineOnly(event.target.checked);
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

  const activeFiltersCount = [filterMineOnly, filterWithinJurisdiction, filterActiveOnly].filter(
    Boolean,
  ).length;

  return (
    <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          {showFilters && (
            <TableRow sx={{ backgroundColor: '#D8E7CC' }}>
              <TableCell colSpan={6} sx={{ py: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontSize={20}>Broadcast list</Typography>
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
                            checked={filterMineOnly}
                            onChange={handleFilterMineOnlyChange}
                          />
                        }
                        label="Mine Only"
                      />
                    </MenuItem>
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
            <TableCell sx={{ flex: 1, minWidth: 240 }}>Title</TableCell>
            <TableCell sx={{ width: 160, minWidth: 160 }}>Language</TableCell>
            <TableCell sx={{ width: 136, minWidth: 136 }}>Channel</TableCell>
            <TableCell sx={{ width: 200, minWidth: 200 }}>Date</TableCell>
            <TableCell sx={{ width: 120, minWidth: 120 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        {rows.length > 0 ? (
          <>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.broadcastId}>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Box display="flex" flexDirection="column">
                        <Typography fontSize={14} fontWeight={500}>
                          {row.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="textSecondary">
                            {row.countryName}
                          </Typography>
                          <Divider orientation="vertical" flexItem />
                          <Box display="flex" alignItems="center" gap={1}>
                            {row.affectedCounties.map((county, index) => (
                              <Fragment key={county.countyId}>
                                <Typography variant="body2" color="textSecondary">
                                  {county.countyName}
                                </Typography>
                                {index < row.affectedCounties.length - 1 && (
                                  <Divider orientation="vertical" flexItem />
                                )}
                              </Fragment>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Box display="flex" justifyContent="flex-start">
                        {getStatusChip(row.status)}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {/*FIXME no languages in request response*/}
                      {['English', 'Swahili'].map((language) => (
                        <Chip
                          key={language}
                          size="small"
                          variant="outlined"
                          icon={
                            <Icon
                              baseClassName="material-symbols-outlined"
                              sx={{ '&&': { color: '#426834' } }}
                            >
                              language
                            </Icon>
                          }
                          label={language}
                          sx={{ borderColor: '#73796E' }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {/*FIXME no channels in request response*/}
                    <Box display="flex" alignItems="center" gap={1}>
                      <Icon baseClassName="material-symbols-outlined">sms</Icon>
                      <Typography fontSize={14}>SMS</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(row.initiated)}</TableCell>
                  <TableCell>
                    <IconButton component={Link} to={paths.app.broadcast.getHref(row.broadcastId)}>
                      <Icon baseClassName="material-symbols-outlined" sx={{ color: '#386667' }}>
                        visibility
                      </Icon>
                    </IconButton>
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
                  <Typography>No broadcast found with current filters</Typography>
                  <Typography fontSize={14}>Try adjusting your filters to see more.</Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};
