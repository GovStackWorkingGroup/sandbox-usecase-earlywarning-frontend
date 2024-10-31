import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { paths } from '@/config/paths';
import { ProtectedRoute } from '@/lib/auth';

import { AppRoot, AppRootErrorBoundary } from './routes/root';

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.auth.login.path,
      lazy: async () => {
        const { LoginRoute } = await import('./routes/auth/login');
        return { Component: LoginRoute };
      },
    },
    {
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.dashboard.path,
          lazy: async () => {
            const { DashboardRoute } = await import('./routes/dashboard');
            return { Component: DashboardRoute };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.threats.path,
          lazy: async () => {
            const { ThreatsRoute } = await import('./routes/threats');
            return { Component: ThreatsRoute };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.broadcasts.path,
          lazy: async () => {
            const { BroadcastsRoute } = await import('./routes/broadcasts');
            return { Component: BroadcastsRoute };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.feedbacks.path,
          lazy: async () => {
            const { FeedbacksRoute } = await import('./routes/feedbacks');
            return { Component: FeedbacksRoute };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.mapView.path,
          lazy: async () => {
            const { MapViewRoute } = await import('./routes/map-view');
            return { Component: MapViewRoute };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
      ],
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('./routes/not-found');
        return { Component: NotFoundRoute };
      },
      ErrorBoundary: AppRootErrorBoundary,
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
