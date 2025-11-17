/**
 * App Providers
 * アプリケーション全体のプロバイダーを統合
 */

'use client';

import { ReactNode } from 'react';
import { ReactQueryProvider } from './react-query-provider';
import { ToasterProvider, TooltipProviderWrapper } from './ui-providers';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * アプリケーション全体のプロバイダー
 * React Query、UI関連のプロバイダーを統合
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
      <TooltipProviderWrapper>
        <ToasterProvider>{children}</ToasterProvider>
      </TooltipProviderWrapper>
    </ReactQueryProvider>
  );
}
