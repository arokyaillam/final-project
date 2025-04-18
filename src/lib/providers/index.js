'use client';

import QueryProvider from './queryProvider';
import ReduxProvider from './reduxProvider';

export default function Providers({ children }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </ReduxProvider>
  );
}
