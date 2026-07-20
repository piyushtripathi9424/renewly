import React, { useCallback } from 'react';
import { ProviderGrid } from './components/ProviderGrid';
import { ProviderSearch } from './components/ProviderSearch';
import { CategoryFilters } from './components/CategoryFilters';
import { useProviders } from './hooks/useProviders';
import { Provider } from './types';
import { Loader2 } from 'lucide-react';

export const ProvidersPage: React.FC = () => {
  const { data, loading, error, params, updateParams } = useProviders({ limit: 12, sort: 'popularity' });

  const handleSearch = useCallback((q: string) => {
    updateParams({ q });
  }, [updateParams]);

  const handleCategorySelect = useCallback((category: string | undefined) => {
    updateParams({ category });
  }, [updateParams]);

  const handleProviderClick = useCallback((provider: Provider) => {
    console.log('Clicked provider:', provider.name);
    // Open modal or navigate
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    updateParams({ page: newPage });
  }, [updateParams]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
            Provider Catalog
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Browse and manage your subscriptions for various digital services.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {/* Admin Create Button could go here */}
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <ProviderSearch onSearch={handleSearch} />
        <CategoryFilters selectedCategory={params.category} onSelectCategory={handleCategorySelect} />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-8">
          <div className="text-sm text-red-700">Error loading providers: {error.message}</div>
        </div>
      )}

      {loading && !data ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : data ? (
        <>
          <ProviderGrid providers={data.items} onProviderClick={handleProviderClick} />
          
          {data.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(data.page - 1) * data.limit + 1}</span> to <span className="font-medium">{Math.min(data.page * data.limit, data.total)}</span> of{' '}
                    <span className="font-medium">{data.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(data.page - 1)}
                      disabled={data.page === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {/* Render basic page numbers */}
                    {Array.from({ length: data.totalPages }).map((_, idx) => {
                      const p = idx + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
                            p === data.page
                              ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(data.page + 1)}
                      disabled={data.page === data.totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};
