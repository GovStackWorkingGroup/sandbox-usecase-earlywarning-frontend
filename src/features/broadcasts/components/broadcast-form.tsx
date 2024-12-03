import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Chip,
  ChipProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2 as Grid,
  Icon,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import TelegramIcon from '@/assets/icons/telegram.svg?react';
import WhatsappIcon from '@/assets/icons/whatsapp.svg?react';
import { Spinner } from '@/components/ui/spinner/spinner';
import { paths } from '@/config/paths';
import { useDeleteBroadcast } from '@/features/broadcasts/api/delete-broadcast';
import { useBroadcast } from '@/features/broadcasts/api/get-broadcast';
import { usePublishBroadcast } from '@/features/broadcasts/api/publish-broadcast';
import { useUpdateBroadcast } from '@/features/broadcasts/api/update-broadcast';
import { useThreat } from '@/features/threats/api/get-threat';
import { useUser } from '@/lib/auth';
import { Broadcast } from '@/types/api';
import { formatDate, formatPeriod } from '@/utils/format';

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

const channels = [
  {
    icon: <Icon baseClassName="material-symbols-outlined">email</Icon>,
    label: 'Email',
    value: 'EMAIL',
    disabled: true,
  },
  {
    icon: <Icon baseClassName="material-symbols-outlined">sms</Icon>,
    label: 'SMS',
    value: 'SMS',
    disabled: false,
  },
  {
    icon: <SvgIcon component={WhatsappIcon} sx={{ color: 'inherit' }} inheritViewBox />,
    label: 'WhatsApp',
    value: 'WHATSAPP',
    disabled: true,
  },
  {
    icon: <SvgIcon component={TelegramIcon} sx={{ color: 'inherit' }} inheritViewBox />,
    label: 'Telegram',
    value: 'TELEGRAM',
    disabled: true,
  },
];

const languages = [
  { label: 'English', disabled: false },
  { label: 'Swahili', disabled: false },
  { label: 'Amharic', disabled: true },
  { label: 'Arabic', disabled: true },
  { label: 'Somali', disabled: true },
  { label: 'French', disabled: true },
  { label: 'Oromo', disabled: true },
  { label: 'Tigrinya', disabled: true },
  { label: 'Nuer', disabled: true },
  { label: 'Dinka', disabled: true },
  { label: 'Luganda', disabled: true },
  { label: 'Kinyarwanda', disabled: true },
  { label: 'Kirundi', disabled: true },
  { label: 'Karamojong', disabled: true },
  { label: 'Pokot', disabled: true },
];

const steps = ['Configuration', 'Content Creation', 'Preview'];

export const BroadcastForm = ({ broadcastId }: { broadcastId: string }) => {
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedLanguages, setSelectedLanguages] = useState<
    { label: string; disabled: boolean }[]
  >([]);
  const [channelError, setChannelError] = useState(false);
  const [languageError, setLanguageError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [primaryLanguageError, setPrimaryLanguageError] = useState(false);
  const [secondaryLanguageError, setSecondaryLanguageError] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const user = useUser();
  const navigate = useNavigate();

  const { control, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: {
      title: '',
      channelType: '',
      primaryLangMessage: '',
      secondaryLangMessage: '',
    },
  });

  const broadcastQuery = useBroadcast({ broadcastId });

  const { data: threat, refetch: fetchThreat } = useThreat({
    threatId: broadcastQuery.data?.threatId ?? '',
  });

  useEffect(() => {
    if (broadcastQuery.data?.threatId) {
      fetchThreat();
    }
  }, [broadcastQuery.data?.threatId, fetchThreat]);

  useEffect(() => {
    if (broadcastQuery.data) {
      reset({
        title: broadcastQuery.data.title,
        channelType: broadcastQuery.data.channelType,
        primaryLangMessage: broadcastQuery.data.primaryLangMessage,
        secondaryLangMessage: broadcastQuery.data.secondaryLangMessage,
      });

      if (selectedLanguages.length === 0) {
        const newSelectedLanguages = [];
        if (broadcastQuery.data.primaryLangMessage) {
          newSelectedLanguages.push({ label: 'English', disabled: false });
        }
        if (broadcastQuery.data.secondaryLangMessage) {
          newSelectedLanguages.push({ label: 'Swahili', disabled: false });
        }
        if (newSelectedLanguages.length === 0) {
          newSelectedLanguages.push({ label: 'English', disabled: false });
          newSelectedLanguages.push({ label: 'Swahili', disabled: false });
        }
        setSelectedLanguages(newSelectedLanguages);
      }
    }
  }, [broadcastQuery.data, reset]);

  useEffect(() => {
    const availableChannels = channels.filter((channel) => !channel.disabled);
    if (availableChannels.length === 1) {
      setValue('channelType', availableChannels[0].value);
    }
  }, [setValue]);

  const { mutate: updateBroadcast, isPending: isUpdateBroadcastPending } = useUpdateBroadcast({
    mutationConfig: {
      onSuccess: () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: () => {
        enqueueSnackbar('Error updating broadcast', { variant: 'error' });
      },
    },
  });

  const { mutate: publishBroadcast, isPending: isPublishBroadcastPending } = usePublishBroadcast({
    broadcastId,
    mutationConfig: {
      onSuccess: () => {
        enqueueSnackbar('Broadcast updated successfully', { variant: 'success' });
        navigate(paths.app.broadcast.getHref(broadcastId), {
          state: { previousLocation: location },
        });
      },
      onError: () => {
        enqueueSnackbar('Error updating broadcast', { variant: 'error' });
      },
    },
  });

  const deleteBroadcastMutation = useDeleteBroadcast({
    mutationConfig: {
      onSuccess: () => {
        enqueueSnackbar('Broadcast deleted successfully', { variant: 'success' });
        navigate(paths.app.broadcasts.getHref());
      },
      onError: () => {
        enqueueSnackbar('Error deleting broadcast', { variant: 'error' });
      },
    },
  });

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

  const onSubmit = () => {
    publishBroadcast({ broadcastId, userId: user.data?.userUUID ?? '' });
  };

  const handleNext = () => {
    const formData = getValues();
    let valid = true;

    if (activeStep === 0) {
      if (!getValues('channelType')) {
        setChannelError(true);
        valid = false;
      } else {
        setChannelError(false);
      }

      if (selectedLanguages.length === 0) {
        setLanguageError(true);
        valid = false;
      } else {
        setLanguageError(false);
      }
    } else if (activeStep === 1) {
      if (!formData.title) {
        setTitleError(true);
        valid = false;
      } else {
        setTitleError(false);
      }

      if (
        selectedLanguages.some((lang) => lang.label === 'English') &&
        !formData.primaryLangMessage
      ) {
        setPrimaryLanguageError(true);
        valid = false;
      } else {
        setPrimaryLanguageError(false);
      }

      if (
        selectedLanguages.some((lang) => lang.label === 'Swahili') &&
        !formData.secondaryLangMessage
      ) {
        setSecondaryLanguageError(true);
        valid = false;
      } else {
        setSecondaryLanguageError(false);
      }
    }

    if (valid) {
      let newData: Partial<Broadcast> = {};

      if (activeStep === 0) {
        newData = {
          channelType: formData.channelType,
        };

        const selectedLanguageLabels = selectedLanguages.map((lang) => lang.label);
        if (!selectedLanguageLabels.includes('English')) {
          newData.primaryLangMessage = '';
        }
        if (!selectedLanguageLabels.includes('Swahili')) {
          newData.secondaryLangMessage = '';
        }
      } else if (activeStep === 1) {
        newData = {
          title: formData.title,
          primaryLangMessage: formData.primaryLangMessage,
          secondaryLangMessage: formData.secondaryLangMessage,
        };
      }

      updateBroadcast({ data: { ...broadcast, ...newData }, broadcastId });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChannelSelect = (value: string) => {
    setValue('channelType', value);
    if (value) {
      setChannelError(false);
    }
  };

  const handleLanguageChange = (event: any, value: { label: string; disabled: boolean }[]) => {
    setSelectedLanguages(value);
    if (value.length > 0) {
      setLanguageError(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('title', event.target.value);
    if (event.target.value) {
      setTitleError(false);
    }
  };

  const handleClickConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmDialogDelete = () => {
    deleteBroadcastMutation.mutate({ broadcastId });
    setConfirmDialogOpen(false);
  };

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
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean; sx?: object } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};

              if (index === 0) {
                stepProps.sx = { pl: 0 };
              } else if (index === steps.length - 1) {
                stepProps.sx = { pr: 0 };
              }

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === 0 && (
            <Box display="flex" flexDirection="column" gap={4}>
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  backgroundColor: '#FFFEFC',
                  border: `1px solid ${channelError ? '#f44336' : '#C3C8BB'}`,
                  borderRadius: 1,
                  padding: 2,
                }}
              >
                <Typography fontSize={16} fontWeight={500}>
                  Channel Selection
                </Typography>
                <Controller
                  name="channelType"
                  control={control}
                  render={({ field }) => (
                    <Grid container spacing={2}>
                      {channels.map((channel) => (
                        <Grid key={channel.value} size={6}>
                          <Button
                            variant={field.value === channel.value ? 'contained' : 'outlined'}
                            color="primary"
                            fullWidth
                            onClick={() => {
                              handleChannelSelect(channel.value);
                            }}
                            startIcon={channel.icon}
                            disabled={channel.disabled}
                            disableElevation
                            sx={{
                              p: 3,
                              justifyContent: 'flex-start',
                              textAlign: 'left',
                              border: channel.disabled
                                ? 'none'
                                : field.value === channel.value
                                  ? '1px solid #426834'
                                  : '1px solid #C3C8BB',
                              backgroundColor: channel.disabled
                                ? 'rgba(67, 72, 63, 0.04)'
                                : field.value === channel.value
                                  ? '#C3EFAD'
                                  : 'transparent',
                              color: channel.disabled ? '#73796E' : '#191D16',
                              '&:hover': {
                                backgroundColor: channel.disabled
                                  ? 'rgba(67, 72, 63, 0.04)'
                                  : field.value === channel.value
                                    ? '#C3EFAD'
                                    : 'rgba(195, 239, 173, 0.20)',
                                borderColor: field.value === channel.value ? '#426834' : '#C3C8BB',
                              },
                              '& .MuiButton-startIcon': {
                                color: channel.disabled ? '#73796E' : '#426834',
                              },
                            }}
                          >
                            {channel.label}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                />
                {channelError && (
                  <Typography fontSize={12} color="error">
                    Please select a channel.
                  </Typography>
                )}
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  backgroundColor: '#FFFEFC',
                  border: `1px solid ${languageError ? '#f44336' : '#C3C8BB'}`,
                  borderRadius: 1,
                  padding: 2,
                }}
              >
                <Typography fontSize={16} fontWeight={500}>
                  Language
                </Typography>
                <FormControl>
                  <Autocomplete
                    multiple
                    options={languages}
                    getOptionLabel={(option) => option.label}
                    getOptionDisabled={(option) =>
                      selectedLanguages.some((lang) => lang.label === option.label) ||
                      option.disabled
                    }
                    value={selectedLanguages}
                    filterSelectedOptions
                    disableCloseOnSelect
                    disableClearable
                    onChange={handleLanguageChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            size="small"
                            label={option.label}
                            key={key}
                            {...tagProps}
                            sx={{
                              backgroundColor: '#426834',
                              color: 'white',
                              '& .MuiChip-deleteIcon': {
                                color: 'rgba(255, 254, 252, 0.26)',
                              },
                            }}
                          />
                        );
                      })
                    }
                    renderInput={(params) => <TextField {...params} label="Selected Languages" />}
                  />
                  <FormHelperText sx={{ color: '#73796E' }}>
                    Languages are pre-selected based on the location. You can add or remove
                    languages as needed.
                  </FormHelperText>
                </FormControl>
                {languageError && (
                  <Typography color="error" fontSize={12}>
                    Please select at least one language.
                  </Typography>
                )}
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  backgroundColor: '#FFFEFC',
                  border: '1px solid #C3C8BB',
                  borderRadius: 1,
                  padding: 2,
                }}
              >
                <Box>
                  <Typography fontSize={16} fontWeight={500}>
                    Recipient
                  </Typography>
                  <Typography fontSize={12} color="#43483F" letterSpacing={0.4}>
                    Within the Threat Location
                  </Typography>
                </Box>
                <FormControl>
                  <RadioGroup
                    defaultValue="all"
                    sx={{
                      '& .MuiFormControlLabel-root.Mui-disabled .MuiSvgIcon-root': {
                        color: 'rgba(0, 0, 0, 0.6)',
                      },
                      '& .MuiFormControlLabel-root:not(.Mui-disabled) .MuiSvgIcon-root': {
                        color: '#426834',
                      },
                    }}
                  >
                    <FormControlLabel
                      value="all"
                      control={<Radio />}
                      label="Whole Population within my Jurisdiction"
                    />
                    <FormControlLabel
                      value="organizations"
                      control={<Radio disabled />}
                      label="Organizations within my Jurisdiction"
                    />
                    <FormControlLabel
                      value="custom"
                      control={<Radio disabled />}
                      label="Custom Recipients"
                    />
                  </RadioGroup>
                  <FormHelperText sx={{ color: '#73796E' }}>
                    Choose the target audience for your broadcast. This selection determines who
                    will receive the alert within the specified location.
                  </FormHelperText>
                </FormControl>
              </Box>
            </Box>
          )}
          {activeStep === 1 && (
            <Box display="flex" flexDirection="column" gap={4}>
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  backgroundColor: '#FFFEFC',
                  border: `1px solid ${titleError ? '#f44336' : '#C3C8BB'}`,
                  borderRadius: 1,
                  padding: 2,
                }}
              >
                <Typography fontSize={16} fontWeight={500}>
                  Broadcast Title
                </Typography>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField {...field} label="Title" onChange={handleTitleChange} />
                      <FormHelperText sx={{ color: '#73796E' }}>
                        Broadcast Title will be only visible within system.
                      </FormHelperText>
                    </FormControl>
                  )}
                />
                {titleError && (
                  <Typography color="error" fontSize={12}>
                    Title is required.
                  </Typography>
                )}
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  backgroundColor: '#FFFEFC',
                  border: '1px solid #C3C8BB',
                  borderRadius: 1,
                  padding: 2,
                }}
              >
                <Typography fontSize={16} fontWeight={500}>
                  Response Options
                </Typography>
                <FormControl>
                  <RadioGroup
                    defaultValue="validate"
                    sx={{
                      '& .MuiFormControlLabel-root.Mui-disabled .MuiSvgIcon-root': {
                        color: 'rgba(0, 0, 0, 0.6)',
                      },
                      '& .MuiFormControlLabel-root:not(.Mui-disabled) .MuiSvgIcon-root': {
                        color: '#426834',
                      },
                    }}
                  >
                    <FormControlLabel
                      value="general"
                      control={<Radio disabled />}
                      label="General Response"
                    />
                    <FormControlLabel
                      value="validate"
                      control={<Radio />}
                      label="Validate Status"
                    />
                    <FormControlLabel value="none" control={<Radio disabled />} label="None" />
                  </RadioGroup>
                  <FormHelperText sx={{ color: '#73796E' }}>
                    Choose the target audience for your broadcast. This selection determines who
                    will receive the alert within the specified location.
                  </FormHelperText>
                </FormControl>
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  backgroundColor: '#FFFEFC',
                  border: '1px solid #C3C8BB',
                  borderRadius: 1,
                  padding: 2,
                }}
              >
                <Typography fontSize={16} fontWeight={500}>
                  Content
                </Typography>
                {selectedLanguages.map((lang) => (
                  <Controller
                    key={lang.label}
                    name={lang.label === 'English' ? 'primaryLangMessage' : 'secondaryLangMessage'}
                    control={control}
                    render={({ field }) => (
                      <Accordion
                        elevation={0}
                        square={true}
                        sx={{
                          border: `1px solid ${
                            (lang.label === 'English' && primaryLanguageError) ||
                            (lang.label === 'Swahili' && secondaryLanguageError)
                              ? '#f44336'
                              : '#C3C8BB'
                          }`,
                          borderRadius: 2,
                          '&:before': {
                            display: 'none',
                          },
                        }}
                        disableGutters
                      >
                        <AccordionSummary
                          expandIcon={
                            <Icon baseClassName="material-symbols-outlined">
                              keyboard_arrow_down
                            </Icon>
                          }
                          sx={{
                            '&.Mui-expanded': {
                              borderBottom: '1px solid #C3C8BB',
                            },
                          }}
                        >
                          {lang.label}
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 2 }}>
                          <TextField
                            {...field}
                            multiline
                            rows={8}
                            fullWidth
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) {
                                if (lang.label === 'English') {
                                  setPrimaryLanguageError(false);
                                } else if (lang.label === 'Swahili') {
                                  setSecondaryLanguageError(false);
                                }
                              }
                            }}
                          />
                          <FormHelperText sx={{ color: '#73796E' }}>
                            No more than 255 characters.
                          </FormHelperText>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  />
                ))}
                {(primaryLanguageError || secondaryLanguageError) && (
                  <Typography color="error" fontSize={12}>
                    Content is required.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          {activeStep === 2 && (
            <Box display="flex" flexDirection="column" gap={4}>
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
                      {getValues('title')}
                    </Box>

                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography fontSize={14}>Broadcast Channel</Typography>
                      {getValues('channelType')}
                    </Box>

                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography fontSize={14}>Languages</Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {selectedLanguages.map((language) => (
                          <Chip
                            key={language.label}
                            size="small"
                            sx={{
                              backgroundColor: '#1B5E20',
                              color: 'white',
                              borderColor: '#1B5E20',
                            }}
                            label={language.label}
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
              </Box>

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
                <Typography fontSize={16} fontWeight={500}>
                  Response options
                </Typography>
                <Box>
                  <Typography fontSize={16}>Validate Status</Typography>
                  <Typography fontSize={12} color="#43483F" letterSpacing={0.4}>
                    Recipients responds as Yes or No to confirm if this situation affects their
                    area.
                  </Typography>
                </Box>
              </Box>

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
                <Typography fontSize={16} fontWeight={500}>
                  Content
                </Typography>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {selectedLanguages.map((language) => (
                    <Fragment key={language.label}>
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
                            <Icon baseClassName="material-symbols-outlined">
                              keyboard_arrow_down
                            </Icon>
                          }
                        >
                          {language.label}
                        </AccordionSummary>
                        <AccordionDetails sx={{ whiteSpace: 'pre-wrap' }}>
                          {language.label === 'English'
                            ? getValues('primaryLangMessage')
                            : getValues('secondaryLangMessage')}
                        </AccordionDetails>
                      </Accordion>
                    </Fragment>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Button
              variant="text"
              size="large"
              color="error"
              startIcon={
                <Icon
                  baseClassName="material-symbols-outlined"
                  sx={{ fontVariationSettings: "'FILL' 1" }}
                >
                  delete
                </Icon>
              }
              onClick={handleClickConfirmDialogOpen}
            >
              Delete
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                mr: 1,
                color: '#1C6D00',
              }}
            >
              Back
            </Button>
            <Button
              disableElevation
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit(onSubmit) : handleNext}
              disabled={isUpdateBroadcastPending || isPublishBroadcastPending}
              sx={{
                backgroundColor: '#65D243',
                color: '#191D16',
                border: 'none',
                '&:hover': {
                  backgroundColor: '#65D243',
                },
              }}
            >
              {activeStep === steps.length - 1 ? 'Broadcast' : 'Next'}
            </Button>
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
              <Typography fontSize={20}>Threat Details</Typography>
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
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this broadcast? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDialogDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
