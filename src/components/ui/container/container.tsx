import { Box, Typography, styled, Tooltip, Theme, Button, Icon } from '@mui/material';
import { SxProps } from '@mui/system';
import React, { ReactNode } from 'react';

interface ButtonProps {
  text: string;
  action: () => void;
}

interface ContainerProps {
  title?: string;
  tooltip?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
  button?: ButtonProps;
}

const StyledContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sx',
})<{ sx?: SxProps<Theme> }>(({ theme, sx }) => {
  const hasBackgroundColor = sx && typeof sx === 'object' && 'backgroundColor' in sx;
  return {
    borderRadius: '4px',
    border: '1px solid #C3C8BB',
    backgroundColor: '#FFFEFC',
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    ...(!hasBackgroundColor && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '60px',
        height: '60px',
        backgroundColor: '#F8FAF0',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      },
    }),
  };
});

const Container = ({ title, tooltip, children, sx, button }: ContainerProps) => {
  return (
    <StyledContainer sx={sx}>
      {title && (
        <Box display="flex" gap={1} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6" display="inline" sx={{ fontWeight: 400 }}>
            {title}
          </Typography>
          {tooltip && (
            <Tooltip
              arrow
              title={tooltip}
              placement="top"
              slotProps={{
                arrow: {
                  sx: {
                    color: '#43483F',
                  },
                },
                tooltip: {
                  sx: {
                    width: '200px',
                    backgroundColor: '#43483F',
                    color: '#F0F5F5',
                  },
                },
              }}
            >
              <Icon baseClassName="material-symbols-outlined" sx={{ fontSize: 20 }}>
                info
              </Icon>
            </Tooltip>
          )}
        </Box>
      )}
      <Box flexGrow={1} sx={{ zIndex: 1 }}>
        {children}
      </Box>
      {button && (
        <Button
          onClick={button.action}
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: '#F8FAF0',
            color: '#426834',
            border: `1px solid ${sx && typeof sx === 'object' && 'backgroundColor' in sx ? '#F8FAF0' : '#54624D'}`,
            boxShadow: 'none',
            width: 125,
          }}
        >
          {button.text}
        </Button>
      )}
    </StyledContainer>
  );
};

export default Container;
