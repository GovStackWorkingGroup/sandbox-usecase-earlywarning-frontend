import * as React from 'react';

import { Head } from '../seo';

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div>
        <div>
          <h1>{title}</h1>
        </div>
        <div>
          {children}
        </div>
      </div>
    </>
  );
};
