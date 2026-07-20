const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'apps/web/src/features/subscriptions');
fs.mkdirSync(baseDir, { recursive: true });

const files = {
  'index.ts': `export * from './components/SubscriptionList';
export * from './components/SubscriptionDashboard';
export * from './components/CreateSubscription';
`,
  'components/SubscriptionDashboard.tsx': `import React from 'react';
import { SubscriptionList } from './SubscriptionList';
import { StatisticsCards } from './StatisticsCards';
import { UpcomingRenewalsWidget } from './UpcomingRenewalsWidget';

export const SubscriptionDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscription Dashboard</h1>
      <StatisticsCards />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SubscriptionList />
        </div>
        <div>
          <UpcomingRenewalsWidget />
        </div>
      </div>
    </div>
  );
};
`,
  'components/SubscriptionList.tsx': `import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const SubscriptionList = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions', search],
    queryFn: async () => {
      const res = await api.get('/subscriptions', { params: { q: search } });
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Subscriptions</h2>
        <input 
          type="text" 
          placeholder="Search..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>
      {data?.items?.length === 0 ? (
        <div>No subscriptions found.</div>
      ) : (
        <ul className="space-y-2">
          {data?.items?.map((sub: any) => (
            <li key={sub.id} className="border p-3 rounded flex justify-between">
              <div>
                <p className="font-semibold">{sub.name}</p>
                <p className="text-sm text-gray-500">{sub.provider?.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{sub.currency} {sub.amount}</p>
                <p className="text-sm text-gray-500">{sub.billingCycle}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
`,
  'components/StatisticsCards.tsx': `import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const StatisticsCards = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions-stats'],
    queryFn: async () => {
      const res = await api.get('/subscriptions/statistics');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading stats...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 shadow rounded-lg">
        <p className="text-sm text-gray-500">Monthly Spend</p>
        <p className="text-2xl font-bold">${data?.totalMonthlySpend?.toFixed(2) || '0.00'}</p>
      </div>
      <div className="bg-white p-4 shadow rounded-lg">
        <p className="text-sm text-gray-500">Annual Spend</p>
        <p className="text-2xl font-bold">${data?.totalAnnualSpend?.toFixed(2) || '0.00'}</p>
      </div>
      <div className="bg-white p-4 shadow rounded-lg">
        <p className="text-sm text-gray-500">Active</p>
        <p className="text-2xl font-bold">{data?.activeSubscriptions || 0}</p>
      </div>
      <div className="bg-white p-4 shadow rounded-lg">
        <p className="text-sm text-gray-500">Trials</p>
        <p className="text-2xl font-bold">{data?.trialSubscriptions || 0}</p>
      </div>
    </div>
  );
};
`,
  'components/UpcomingRenewalsWidget.tsx': `import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const UpcomingRenewalsWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions-upcoming'],
    queryFn: async () => {
      const res = await api.get('/subscriptions/upcoming');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">Upcoming Renewals</h3>
      {data?.length === 0 ? (
        <p className="text-gray-500">No upcoming renewals.</p>
      ) : (
        <ul className="space-y-3">
          {data?.map((sub: any) => (
            <li key={sub.id} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-semibold">{sub.name}</p>
                <p className="text-xs text-gray-500">Renews: {new Date(sub.renewalDate).toLocaleDateString()}</p>
              </div>
              <p className="font-bold">{sub.currency} {sub.amount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
`,
  'components/CreateSubscription.tsx': `import React from 'react';
import { useForm } from 'react-form';

export const CreateSubscription = () => {
  return (
    <div>
      <h2>Create Subscription</h2>
      {/* Form implementation */}
    </div>
  );
};
`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

console.log('Frontend files generated successfully.');
