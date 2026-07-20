import React from 'react';

export const StatisticsCards = () => {
  const isLoading = false;
  const data: any = {
    totalMonthlySpend: 0,
    totalAnnualSpend: 0,
    activeSubscriptions: 0,
    trialSubscriptions: 0,
  };

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
