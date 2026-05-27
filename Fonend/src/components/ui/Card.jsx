const variantStyles = {
  default: 'bg-white border border-[#E2E8F0]',
  bordered: 'bg-white border-2 border-[#E2E8F0]',
  elevated: 'bg-white shadow-md border border-[#F1F5F9]',
  interactive: 'bg-white border border-[#E2E8F0] hover:shadow-lg hover:border-[#1D4ED8]/20 hover:-translate-y-0.5 cursor-pointer',
  flat: 'bg-[#F8FAFC] border border-transparent',
};

const Card = ({ children, variant = 'default', className = '', padding = true, ...props }) => (
  <div
    className={`
      rounded-2xl transition-all duration-200
      ${variantStyles[variant]}
      ${padding ? 'p-6' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

Card.Header = ({ children, className = '', border = true }) => (
  <div className={`px-6 py-4 ${border ? 'border-b border-[#E2E8F0]' : ''} ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', border = true }) => (
  <div className={`px-6 py-4 ${border ? 'border-t border-[#E2E8F0]' : ''} ${className}`}>
    {children}
  </div>
);

export default Card;
