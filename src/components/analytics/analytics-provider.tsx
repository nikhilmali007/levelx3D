'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {gaId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `,
            }}
          />
        </>
      )}
      {children}
    </>
  );
}
