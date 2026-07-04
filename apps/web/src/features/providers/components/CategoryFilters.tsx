import React from 'react';

interface Props {
  selectedCategory: string | undefined;
  onSelectCategory: (category: string | undefined) => void;
}

const CATEGORIES = [
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'software', name: 'Software' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'cloud-storage', name: 'Cloud Storage' },
  { id: 'ai', name: 'AI' },
  { id: 'developer-tools', name: 'Dev Tools' },
  { id: 'music', name: 'Music' },
  { id: 'education', name: 'Education' },
  { id: 'finance', name: 'Finance' },
  { id: 'security', name: 'Security' },
];

export const CategoryFilters: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 py-4">
      <button
        onClick={() => onSelectCategory(undefined)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          !selectedCategory
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedCategory === cat.id
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};
