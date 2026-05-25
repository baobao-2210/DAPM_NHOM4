import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[#0F172A]">
          {label}
          {required && <span className="text-[#EF4444] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#0F172A]
            placeholder:text-[#94A3B8]
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${Icon ? 'pl-10' : ''}
            ${error
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
              : 'border-[#E2E8F0] focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/20 hover:border-[#CBD5E1]'
            }
          `}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
