const variantStyles = {
  default: 'bg-[#F1F5F9] text-[#64748B]',
  primary: 'bg-[#EFF6FF] text-[#1D4ED8]',
  success: 'bg-[#F0FDF4] text-[#16A34A]',
  warning: 'bg-[#FFFBEB] text-[#D97706]',
  danger: 'bg-[#FEF2F2] text-[#DC2626]',
  info: 'bg-[#EFF6FF] text-[#2563EB]',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

const Badge = ({ children, variant = 'default', size = 'md', dot = false, className = '' }) => (
  <span
    className={`
      inline-flex items-center gap-1.5 font-medium rounded-lg
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `}
  >
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
    )}
    {children}
  </span>
);

export default Badge;
