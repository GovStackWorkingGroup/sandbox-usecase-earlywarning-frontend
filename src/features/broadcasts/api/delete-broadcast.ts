import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getBroadcastsQueryOptions } from '@/features/broadcasts/api/get-broadcasts';
import { attachToken, threatApi } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const deleteBroadcast = ({ broadcastId }: { broadcastId: string }) => {
  return threatApi.delete(`/v1/broadcasts/${broadcastId}`, { headers: attachToken().headers });
};

type UseDeleteBroadcastOptions = {
  mutationConfig?: MutationConfig<typeof deleteBroadcast>;
};

export const useDeleteBroadcast = ({ mutationConfig }: UseDeleteBroadcastOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getBroadcastsQueryOptions({}).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteBroadcast,
  });
};
