import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { threatApi } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Broadcast } from '@/types/api';

import { getBroadcastQueryOptions } from './get-broadcast';

export const updateDiscussionInputSchema = z.object({
  title: z.string().min(1, 'Required'),
});

export type UpdateDiscussionInput = z.infer<typeof updateDiscussionInputSchema>;

export const updateDiscussion = ({
  data,
  broadcastId,
}: {
  data: UpdateDiscussionInput;
  broadcastId: string;
}): Promise<Broadcast> => {
  return threatApi.put(`/v1/broadcasts/${broadcastId}`, data);
};

type UseUpdateBroadcastOptions = {
  mutationConfig?: MutationConfig<typeof updateDiscussion>;
};

export const useUpdateDiscussion = ({ mutationConfig }: UseUpdateBroadcastOptions = {}) => {
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
    mutationFn: updateDiscussion,
  });
};
