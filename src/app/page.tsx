import { Suspense } from 'react';
import MarketingLayout from './(marketing)/layout';
import dynamic from 'next/dynamic';

// 动态导入MarketingPage组件
const MarketingPage = dynamic(() => import('./(marketing)/page'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Home() {
  return (
    <MarketingLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <MarketingPage />
      </Suspense>
    </MarketingLayout>
  );
}