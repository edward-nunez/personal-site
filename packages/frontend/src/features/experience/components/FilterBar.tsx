import { useState, type ChangeEvent } from 'react';
import { Input } from '@/design-system/components';

interface FilterBarProps {
  onFilterChange: (filter: string) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filter, setFilter] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);
    onFilterChange(value);
  };

  return (
    <div className="mb-8">
      <Input
        type="text"
        placeholder="Filter by company, role, or technology..."
        value={filter}
        onChange={handleChange}
      />
    </div>
  );
}
