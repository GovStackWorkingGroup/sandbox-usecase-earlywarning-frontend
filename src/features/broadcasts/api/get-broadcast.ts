import { queryOptions, useQuery } from '@tanstack/react-query';

import { attachToken, threatApi } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Broadcast } from '@/types/api';

export const getBroadcast = ({ broadcastId }: { broadcastId: string }): Promise<Broadcast> => {
  return threatApi.get(`/api/v1/broadcasts/${broadcastId}`, {
    headers: attachToken().headers,
  });
};

export const getBroadcastQueryOptions = (broadcastId: string) => {
  return queryOptions({
    queryKey: ['broadcasts', broadcastId],
    queryFn: () => getBroadcast({ broadcastId }),
  });
};

type UseBroadcastOptions = {
  broadcastId: string;
  queryConfig?: QueryConfig<typeof getBroadcastQueryOptions>;
};

export const useBroadcast = ({ broadcastId, queryConfig }: UseBroadcastOptions) => {
  return useQuery({
    ...getBroadcastQueryOptions(broadcastId),
    ...queryConfig,
  });
};
