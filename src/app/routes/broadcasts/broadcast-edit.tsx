import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner/spinner';
import { getBroadcastQueryOptions, useBroadcast } from '@/features/broadcasts/api/get-broadcast';
import { BroadcastForm } from '@/features/broadcasts/components/broadcast-form';

export const broadcastEditLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const broadcastId = params.broadcastId as string;

    const broadcastQuery = getBroadcastQueryOptions(broadcastId);

    return (
      queryClient.getQueryData(broadcastQuery.queryKey) ??
      (await queryClient.fetchQuery(broadcastQuery))
    );
  };

export const BroadcastEditRoute = () => {
  const params = useParams();
  const broadcastId = params.broadcastId as string;
  const broadcastQuery = useBroadcast({
    broadcastId,
  });

  if (broadcastQuery.isLoading) {
    return <Spinner />;
  }

  const broadcast = broadcastQuery.data;

  if (!broadcast) return null;

  return (
    <ContentLayout title={broadcast.title}>
      <BroadcastForm broadcastId={broadcast.broadcastId} />
    </ContentLayout>
  );
};
