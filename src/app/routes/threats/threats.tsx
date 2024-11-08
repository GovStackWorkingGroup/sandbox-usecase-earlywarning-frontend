import React from 'react';

import { ContentLayout } from '@/components/layouts';
import { ThreatsView } from '@/features/threats/components/threats-view';

export const ThreatsRoute = () => {
  return (
    <ContentLayout title="Threats">
      <ThreatsView />
    </ContentLayout>
  );
};
