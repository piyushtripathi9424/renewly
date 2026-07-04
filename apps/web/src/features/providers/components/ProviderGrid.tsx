import React from 'react';
import { ProviderCard } from './ProviderCard';
import { Provider } from '../types';

interface Props {
  providers: Provider[];
  onProviderClick: (p: Provider) => void;
}

export const ProviderGrid: React.FC<Props> = ({ providers, onProviderClick }) => {
  if (providers.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">No providers found</h3>
        <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {providers.map((p) => (
        <ProviderCard key={p.id} provider={p} onClick={onProviderClick} />
      ))}
    </div>
  );
};
