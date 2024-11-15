import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getBroadcastQueryOptions } from '@/features/broadcasts/api/get-broadcast';
import { attachToken, threatApi } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const publishBroadcast = ({
  broadcastId,
  userId,
}: {
  broadcastId: string;
  userId: string;
}) => {
  return threatApi.post(
    `/v1/broadcasts/${broadcastId}/publish`,
    {},
    {
      params: { userId },
      headers: attachToken().headers,
    },
  );
};

type UsePublishBroadcastOptions = {
  broadcastId: string;
  mutationConfig?: MutationConfig<typeof publishBroadcast>;
};

export const usePublishBroadcast = ({
  broadcastId,
  mutationConfig,
}: UsePublishBroadcastOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getBroadcastQueryOptions(broadcastId).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: ({ broadcastId, userId }: { broadcastId: string; userId: string }) =>
      publishBroadcast({ broadcastId, userId }),
  });
};
