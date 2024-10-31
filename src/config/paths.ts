export const paths = {
  auth: {
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },
  app: {
    root: {
      path: '/',
      getHref: () => '/',
    },
    dashboard: {
      path: '',
      getHref: () => '/',
    },
    threats: {
      path: 'threats',
      getHref: () => '/threats',
    },
    broadcasts: {
      path: 'broadcasts',
      getHref: () => '/broadcasts',
    },
    feedbacks: {
      path: 'feedbacks',
      getHref: () => '/feedbacks',
    },
    mapView: {
      path: 'map-view',
      getHref: () => '/map-view',
    },
  },
} as const;
