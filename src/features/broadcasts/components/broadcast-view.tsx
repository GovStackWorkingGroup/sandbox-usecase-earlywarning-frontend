import { Box } from '@mui/material';
import React from 'react';

import { Spinner } from '@/components/ui/spinner/spinner';
import { useBroadcast } from '@/features/broadcasts/api/get-broadcast';

export const BroadcastView = ({ broadcastId }: { broadcastId: string }) => {
  const broadcastQuery = useBroadcast({
    broadcastId,
  });

  if (broadcastQuery.isLoading) {
    return <Spinner />;
  }

  const broadcast = broadcastQuery?.data;

  if (!broadcast) return null;

  return (
    <Box>{broadcast.broadcastId}</Box>
  );
};
