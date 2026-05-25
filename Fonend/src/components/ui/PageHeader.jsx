const PageHeader = ({
  title,
  description,
  actions,
  backButton,
  className = '',
}) => (
  <div className={`mb-8 ${className}`}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        {backButton && (
          <div className="mb-2">{backButton}</div>
        )}
        <h1 className="text-2xl font-bold text-[#0F172A]">{title}</h1>
        {description && (
          <p className="text-[#64748B] text-sm mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  </div>
);

export default PageHeader;
