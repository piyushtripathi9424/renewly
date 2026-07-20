import React from 'react';

export const CreateSubscription = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Create Subscription</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input type="text" className="w-full border rounded px-3 py-2 mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Currency</label>
            <select className="w-full border rounded px-3 py-2 mt-1">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Billing Cycle</label>
          <select className="w-full border rounded px-3 py-2 mt-1">
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
            <option value="QUARTERLY">Quarterly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input type="date" className="w-full border rounded px-3 py-2 mt-1" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Subscription
        </button>
      </form>
    </div>
  );
};
