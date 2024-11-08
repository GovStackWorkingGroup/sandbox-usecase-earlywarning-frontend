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
    threat: {
      path: 'threats/:threatId',
      getHref: (id: string) => `/threats/${id}`,
    },
    broadcasts: {
      path: 'broadcasts',
      getHref: () => '/broadcasts',
    },
    broadcast: {
      path: 'broadcasts/:broadcastId',
      getHref: (id: string) => `/broadcasts/${id}`,
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
