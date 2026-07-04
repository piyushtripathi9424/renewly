import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (q: string) => void;
}

export const ProviderSearch: React.FC<Props> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative max-w-md w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        placeholder="Search providers (e.g., Netflix, GitHub)..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
