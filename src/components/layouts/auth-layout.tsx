import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Head } from '@/components/seo';
import { useUser } from '@/lib/auth';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const user = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      navigate('/', {
        replace: true,
      });
    }
  }, [user.data, navigate]);

  return (
    <>
      <Head title={title} />
      {children}
    </>
  );
};
