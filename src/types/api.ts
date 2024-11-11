export type ErrorResponse = {
  message?: string;
};

export type Paged<T> = {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
};

export type County = {
  countyId: number;
  countyName: string;
};

export type Country = {
  countryName: string;
  affectedCounties: County[];
};

export type Threat = {
  threatId: string;
  threatNumber: number;
  type: string;
  severity: string;
  affectedCountries: Country[];
  range: string;
  periodStart: string;
  periodEnd: string;
  active: boolean;
  notes: string;
};

export type Broadcast = {
  broadcastId: string;
  broadcastNumber: number;
  threatId: string;
  title: string;
  status: string;
  notes: string;
  primaryLangMessage: string;
  secondaryLangMessage: string;
  countryId: number;
  countryName: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  initiated: string;
  createdBy: string;
  affectedCounties: County[];
};

export type Dashboard = {
  threats: {
    activeThreatsCount: number;
    highPriorityCount: number;
  };
  broadcasts: {
    sentCount: number;
    pendingCount: number;
  };
  feedbacks: {
    receivedCount: number;
    todayCount: number;
  };
};

export type UserCountry = {
  countryId: number;
  name: string;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  userUUID: string;
  country: UserCountry;
};

export type AuthResponse = {
  id_token: string;
};
