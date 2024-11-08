import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner/spinner';
import { getThreatQueryOptions, useThreat } from '@/features/threats/api/get-threat';
import { ThreatView } from '@/features/threats/components/threat-view';

export const threatLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const threatId = params.threatId as string;

    const threatQuery = getThreatQueryOptions(threatId);

    return (
      queryClient.getQueryData(threatQuery.queryKey) ?? (await queryClient.fetchQuery(threatQuery))
    );
  };

export const ThreatRoute = () => {
  const params = useParams();
  const threatId = params.threatId as string;
  const threatQuery = useThreat({
    threatId,
  });

  if (threatQuery.isLoading) {
    return <Spinner />;
  }

  const threat = threatQuery.data;

  if (!threat) return null;

  return (
    <>
      <ContentLayout title={`Threat #${threat.threatNumber}`}>
        <ThreatView threatId={threat.threatId} />
      </ContentLayout>
    </>
  );
};
