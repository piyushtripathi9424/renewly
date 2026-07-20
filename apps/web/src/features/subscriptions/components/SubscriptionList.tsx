import { useState } from 'react';

export const SubscriptionList = () => {
  const [search, setSearch] = useState('');
  // Assuming a generic fetcher or placeholder for now
  const isLoading = false;
  const data = { items: [] };

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
