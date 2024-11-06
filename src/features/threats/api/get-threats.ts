import { queryOptions, useQuery } from '@tanstack/react-query';

import { attachToken, threatApi } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Paged, Threat } from '@/types/api';

export const getThreatsByCountry = (
  country: string,
  page = 1,
  size = 10,
  sort?: string,
): Promise<Paged<Threat>> => {
  const params: Record<string, any> = {
    country,
    page,
    size,
  };

  if (sort) {
    params.sort = sort;
  }

  return threatApi.get(`/v1/threat/getAllThreatsForCountry`, {
    params,
    headers: attachToken().headers,
  });
};

export const getThreatsByCountryQueryOptions = ({
  country,
  page,
  size,
  sort,
}: {
  country: string;
  page?: number;
  size?: number;
  sort?: string;
}) => {
  return queryOptions({
    queryKey: ['threats', { country, page, size, sort }],
    queryFn: () => getThreatsByCountry(country, page, size, sort),
  });
};

type UseThreatsOptions = {
  country: string;
  page?: number;
  size?: number;
  sort?: string;
  queryConfig?: QueryConfig<typeof getThreatsByCountryQueryOptions>;
};

export const useThreatsByCountry = ({
  queryConfig,
  country,
  page,
  size,
  sort,
}: UseThreatsOptions) => {
  return useQuery({
    ...getThreatsByCountryQueryOptions({ country, page, size, sort }),
    ...queryConfig,
  });
};
