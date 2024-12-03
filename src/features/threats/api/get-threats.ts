import { queryOptions, useQuery } from '@tanstack/react-query';

import { attachToken, threatApi } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Paged, Threat } from '@/types/api';

export const getThreats = (
  country?: string,
  active = true,
  page = 1,
  size = 10,
  sort?: string,
): Promise<Paged<Threat>> => {
  const params: Record<string, any> = {
    active,
    page,
    size,
  };

  if (country) {
    params.country = country;
  }

  if (sort) {
    params.sort = sort;
  }

  return threatApi.get(`/api/v1/threats`, {
    params,
    headers: attachToken().headers,
  });
};

export const getThreatsQueryOptions = ({
  country,
  active,
  page,
  size,
  sort,
}: {
  country?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}) => {
  return queryOptions({
    queryKey: ['threats', { country, active, page, size, sort }],
    queryFn: () => getThreats(country, active, page, size, sort),
  });
};

type UseThreatsOptions = {
  country?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sort?: string;
  queryConfig?: QueryConfig<typeof getThreatsQueryOptions>;
};

export const useThreats = ({
  queryConfig,
  country,
  active,
  page,
  size,
  sort,
}: UseThreatsOptions) => {
  return useQuery({
    ...getThreatsQueryOptions({ country, active, page, size, sort }),
    ...queryConfig,
  });
};
