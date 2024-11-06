import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { getThreatsByCountryQueryOptions } from '@/features/threats/api/get-threats';

export const threatsLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const country = url.searchParams.get('country') ?? '';

    const query = getThreatsByCountryQueryOptions({ country });

    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
  };

export const ThreatsRoute = () => {
  return (
    <ContentLayout title="Threats">
      Threats
    </ContentLayout>
  );
};
