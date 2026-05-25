import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBox = ({
  value: controlledValue,
  onChange,
  placeholder = 'Tìm kiếm...',
  debounce = 300,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(controlledValue || '');

  useEffect(() => {
    if (controlledValue !== undefined) setLocalValue(controlledValue);
  }, [controlledValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) onChange(localValue);
    }, debounce);
    return () => clearTimeout(timer);
  }, [localValue, debounce]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 text-sm text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl placeholder:text-[#94A3B8] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] hover:border-[#CBD5E1]"
      />
      {localValue && (
        <button
          onClick={() => setLocalValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
