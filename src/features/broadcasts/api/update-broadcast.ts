import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { threatApi } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Broadcast } from '@/types/api';

import { getBroadcastQueryOptions } from './get-broadcast';

export const updateBoradcastInputSchema = z.object({
  title: z.string().min(1, 'Required'),
});

export type UpdateBroadcastInput = z.infer<typeof updateBoradcastInputSchema>;

export const updateBroadcast = ({
  data,
  broadcastId,
}: {
  data: UpdateBroadcastInput;
  broadcastId: string;
}): Promise<Broadcast> => {
  return threatApi.put(`/api/v1/broadcasts/${broadcastId}`, data);
};

type UseUpdateBroadcastOptions = {
  mutationConfig?: MutationConfig<typeof updateBroadcast>;
};

export const useUpdateBroadcast = ({ mutationConfig }: UseUpdateBroadcastOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({
        queryKey: getBroadcastQueryOptions(data.broadcastId).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateBroadcast,
  });
};
