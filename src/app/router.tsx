import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import { ProtectedRoute } from '@/lib/auth';

import { AppRoot } from './routes/root';

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/',
          lazy: async () => {
            const { DashboardRoute } = await import('./routes/dashboard');
            return { Component: DashboardRoute };
          },
        },
      ],
    },
    {
      path: '/auth/register',
      lazy: async () => {
        const { RegisterRoute } = await import('./routes/auth/register');
        return { Component: RegisterRoute };
      },
    },
    {
      path: '/auth/login',
      lazy: async () => {
        const { LoginRoute } = await import('./routes/auth/login');
        return { Component: LoginRoute };
      },
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('./routes/not-found');
        return { Component: NotFoundRoute };
      },
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
