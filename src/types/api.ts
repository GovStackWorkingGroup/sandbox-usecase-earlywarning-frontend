export type ErrorResponse = {
  message?: string;
};

export type BaseEntity = {
  id: string;
  createdAt: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

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

export type County = Entity<{
  countyId: number;
  countyName: string;
}>;

export type Country = Entity<{
  countryName: string;
  affectedCounties: County[];
}>;

export type Threat = Entity<{
  threatUUID: string;
  type: string;
  severity: string;
  affectedCountries: Country[];
  range: string;
  periodStart: string;
  periodEnd: string;
}>;

export type User = Entity<{
  firstName: string;
  lastName: string;
  email: string;
  userUUID: string;
  country: string;
}>;

export type AuthResponse = {
  id_token: string;
};
