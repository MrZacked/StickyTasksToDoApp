import React from 'react';
import { FilterType } from '../types/Todo';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ 
  currentFilter, 
  onFilterChange, 
  stats 
}) => {
  const filters: Array<{ key: FilterType; label: string; count: number }> = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'active', label: 'Active', count: stats.pending },
    { key: 'completed', label: 'Completed', count: stats.completed }
  ];

  const handleFilterClick = async (filter: FilterType) => {
    try {
      onFilterChange(filter);
    } catch (error) {
      console.error('Failed to change filter:', error);
    }
  };

  return (
    <div className="filter-buttons">
      {filters.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => handleFilterClick(key)}
          className={`filter-btn ${currentFilter === key ? 'active' : ''}`}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  );
};

export default FilterButtons; 