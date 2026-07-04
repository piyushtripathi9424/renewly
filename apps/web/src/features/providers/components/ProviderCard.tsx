import React from 'react';
import { Provider } from '../types';
import { CheckCircle, ExternalLink, CreditCard } from 'lucide-react';

interface Props {
  provider: Provider;
  onClick: (p: Provider) => void;
}

export const ProviderCard: React.FC<Props> = ({ provider, onClick }) => {
  return (
    <div 
      onClick={() => onClick(provider)}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300 cursor-pointer"
      style={{ '--provider-color': provider.color || '#e5e7eb' } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-50 overflow-hidden border border-gray-100 p-2 group-hover:scale-105 transition-transform">
          {provider.logoUrl ? (
            <img src={provider.logoUrl} alt={provider.name} className="h-full w-full object-contain" />
          ) : (
            <div className="text-2xl font-bold text-gray-400">{provider.name.charAt(0)}</div>
          )}
        </div>
        {provider.verified && (
          <CheckCircle className="h-5 w-5 text-blue-500" title="Verified Provider" />
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--provider-color)] transition-colors">{provider.name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{provider.description || 'No description available.'}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          {provider.category?.name || 'Other'}
        </span>
      </div>

      <div className="mt-6 flex gap-3" onClick={(e) => e.stopPropagation()}>
        {provider.websiteUrl && (
          <a
            href={provider.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Site
          </a>
        )}
        {provider.billingUrl && (
          <a
            href={provider.billingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            Billing
          </a>
        )}
      </div>
    </div>
  );
};
