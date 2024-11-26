import { Box, Button, Divider, Icon, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { MobilePhone } from '@/components/ui/mobile-frame/mobile-frame';
import { paths } from '@/config/paths';
import { logViewerWidth } from '@/config/theme';
import { useCreateBroadcast } from '@/features/broadcasts/api/create-broadcast';
import { LogsView } from '@/features/log-viewer/components/logs-view';
import { useThreats } from '@/features/threats/api/get-threats';
import { Log } from '@/types/api';

type LogViewerProps = {
  toggleLogViewer: () => void;
};

export const LogViewer = ({ toggleLogViewer }: LogViewerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [broadcastId, setBroadcastId] = useState<string>('');
  const [finalLog, setFinalLog] = useState<Log>();
  const [isPublishPage, setIsPublishPage] = useState<boolean>(false);

  const { data: threatsData, isLoading } = useThreats({
    active: true,
    page: 1,
    size: 1,
    sort: 'createdAt,desc',
  });

  const createBroadcastMutation = useCreateBroadcast({
    mutationConfig: {
      onSuccess: (data) => {
        navigate(paths.app.broadcastEdit.getHref(data.broadcastId));
      },
    },
  });

  const handleBroadcastingPageClick = async () => {
    if (!isLoading && threatsData && threatsData.content.length > 0) {
      const threatId = threatsData.content[0]?.threatId;

      if (threatId) {
        createBroadcastMutation.mutate({ threatId });
      } else {
        console.error('Threat ID not available');
      }
    }
  };

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const isValidUUID =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        pathParts[1],
      );

    const isPublishPage = pathParts[0] === 'broadcasts' && isValidUUID && pathParts.length === 2;

    setIsPublishPage(isPublishPage);
    if (isPublishPage) {
      setBroadcastId(pathParts[1]);
    }
  }, [location]);

  const getStatusMessage = () => {
    if (broadcastId === '' || !isPublishPage) {
      return "Broadcast is not initiated!<br />User hasn't received a message yet.";
    }
    if (!finalLog) {
      return 'Processing...';
    }
    return 'Broadcast is sent!<br />User has received the message.';
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          color: 'white',
          minHeight: 48,
          py: 1,
          px: 1.5,
          borderBottom: '1px solid rgba(235, 249, 255, 0.60)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          color="inherit"
          fontFamily="Roboto Mono"
          fontWeight={700}
          letterSpacing={0.4}
          textTransform="uppercase"
        >
          Broadcast Logs
        </Typography>
        <IconButton sx={{ color: 'inherit', p: 0.5 }} onClick={toggleLogViewer}>
          <Icon baseClassName="material-symbols-outlined">close</Icon>
        </IconButton>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          px: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          color: 'white',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {isPublishPage ? (
          <LogsView broadcastId={broadcastId} setFinalLog={setFinalLog} />
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              justifyContent: 'center',
            }}
          >
            <Typography
              color="inherit"
              fontFamily="Roboto Mono"
              fontSize={14}
              fontWeight={700}
              letterSpacing={0.15}
              textTransform="uppercase"
              lineHeight={1.5}
            >
              To see the logs
              <br />
              please initiate broadcast
            </Typography>
            <Typography
              color="inherit"
              fontFamily="Roboto Mono"
              fontSize={12}
              letterSpacing={0.15}
              textTransform="uppercase"
              lineHeight={1.5}
              sx={{ wordBreak: 'break-word', whiteSpace: 'normal', width: logViewerWidth - 25 }}
            >
              This log viewer shows the technical flow of your broadcast across different GovStack
              Building Blocks and services. Initiate a broadcast to see real-time system
              interactions and message delivery progress.
            </Typography>
            <Box>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 4,
                  background: '#EBF9FF',
                  color: '#1B1B1B',
                  py: 0.5,
                  fontFamily: 'Roboto Mono',
                }}
                onClick={handleBroadcastingPageClick}
              >
                Broadcasting Page
              </Button>
            </Box>
          </Box>
        )}
        <Divider sx={{ borderColor: 'rgba(235, 249, 255, 0.24)' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            color="inherit"
            fontFamily="Roboto Mono"
            fontSize={12}
            letterSpacing={0.15}
            textTransform="uppercase"
            lineHeight={1.5}
            sx={{
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              width: logViewerWidth - 25,
              minHeight: 36,
              display: 'flex',
              alignItems: 'flex-end',
            }}
            dangerouslySetInnerHTML={{ __html: getStatusMessage() }}
          />
          <MobilePhone log={finalLog} />
        </Box>
      </Box>
    </Box>
  );
};
