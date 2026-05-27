import { forwardRef } from 'react';

const variants = {
  primary: 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF] shadow-sm shadow-[#1D4ED8]/20',
  secondary: 'bg-[#FBBF24] text-[#0F172A] hover:bg-[#F59E0B] shadow-sm shadow-[#FBBF24]/20',
  outline: 'border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#1D4ED8] hover:text-[#1D4ED8]',
  danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm shadow-[#EF4444]/20',
  ghost: 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]',
  success: 'bg-[#22C55E] text-white hover:bg-[#16A34A] shadow-sm shadow-[#22C55E]/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
  xl: 'px-8 py-4 text-lg gap-3 rounded-xl',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
