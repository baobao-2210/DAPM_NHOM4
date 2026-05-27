import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  id,
  required = false,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-[#0F172A]">
          {label}
          {required && <span className="text-[#EF4444] ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`
          w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#0F172A]
          placeholder:text-[#94A3B8] resize-vertical min-h-[80px]
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${error
            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
            : 'border-[#E2E8F0] focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/20 hover:border-[#CBD5E1]'
          }
        `}
        {...props}
      />
      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
