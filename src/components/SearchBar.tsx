import React, { useState } from 'react';

interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);
    onSearch(value); 
  };

  return (
    <div>
      <input
        className='searchBar'
        placeholder={placeholder}
        type="text"
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
