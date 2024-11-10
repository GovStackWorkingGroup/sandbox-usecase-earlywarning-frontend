import { queryOptions, useQuery } from '@tanstack/react-query';

import { attachToken, userApi } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { User } from '@/types/api';

export const getUserById = ({ userId }: { userId: string }): Promise<User> => {
  return userApi.get(`/v1/users/${userId}`, {
    headers: attachToken().headers,
  });
};

export const getUserByIdQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUserById({ userId }),
  });
};

type UsegetUserByIdOptions = {
  userId: string;
  queryConfig?: QueryConfig<typeof getUserByIdQueryOptions>;
};

export const useUserById = ({ userId, queryConfig }: UsegetUserByIdOptions) => {
  return useQuery({
    ...getUserByIdQueryOptions(userId),
    ...queryConfig,
  });
};
