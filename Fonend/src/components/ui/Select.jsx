import { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Chọn...',
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[#0F172A]">
          {label}
          {required && <span className="text-[#EF4444] ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`
          w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#0F172A]
          appearance-none
          bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2394A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>')]
          bg-no-repeat bg-[position:right_12px_center]
          pr-10
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${error
            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
            : 'border-[#E2E8F0] focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/20 hover:border-[#CBD5E1]'
          }
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
