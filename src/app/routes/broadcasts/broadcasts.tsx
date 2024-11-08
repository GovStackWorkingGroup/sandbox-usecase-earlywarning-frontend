import { ContentLayout } from '@/components/layouts';
import { BroadcastsView } from '@/features/broadcasts/components/broadcasts-view';

export const BroadcastsRoute = () => {
  return (
    <ContentLayout title="Broadcasts">
      <BroadcastsView />
    </ContentLayout>
  );
};
