'use client';

import { useEffect } from 'react';
import { useSimpleAuth } from '@/components/providers/simple-auth-provider';
import { getPageTitle } from '@/lib/utils';

interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  const { user } = useSimpleAuth();

  useEffect(() => {
    const updateTitle = async () => {
      try {
        const response = await fetch('/api/settings/company');
        if (response.ok) {
          const data = await response.json();
          const pageTitle = getPageTitle(title, data.companyName, data.companyType);
          document.title = pageTitle;
        } else {
          // Fallback to default title
          document.title = getPageTitle(title);
        }
      } catch (error) {
        // Fallback to default title
        document.title = getPageTitle(title);
      }
    };

    updateTitle();
  }, [title]);

  return null; // This component doesn't render anything
} 