import { queryOptions, useQuery } from '@tanstack/react-query';

import { attachToken, threatApi } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Threat } from '@/types/api';

export const getThreat = ({ threatId }: { threatId: string }): Promise<Threat> => {
  return threatApi.get(`/api/v1/threats/${threatId}`, {
    headers: attachToken().headers,
  });
};

export const getThreatQueryOptions = (threatId: string) => {
  return queryOptions({
    queryKey: ['threats', threatId],
    queryFn: () => getThreat({ threatId }),
  });
};

type UseThreatOptions = {
  threatId: string;
  queryConfig?: QueryConfig<typeof getThreatQueryOptions>;
};

export const useThreat = ({ threatId, queryConfig }: UseThreatOptions) => {
  return useQuery({
    ...getThreatQueryOptions(threatId),
    ...queryConfig,
  });
};
