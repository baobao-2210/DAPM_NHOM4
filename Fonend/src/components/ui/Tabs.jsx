const Tabs = ({ tabs, activeTab, onChange, className = '' }) => (
  <div className={`flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl ${className}`}>
    {tabs.map((tab) => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={`
          flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
          transition-all duration-200
          ${activeTab === tab.value
            ? 'bg-white text-[#0F172A] shadow-sm'
            : 'text-[#64748B] hover:text-[#0F172A]'
          }
        `}
      >
        {tab.icon && <tab.icon className="w-4 h-4" />}
        {tab.label}
        {tab.count !== undefined && (
          <span className={`
            text-xs font-semibold px-1.5 py-0.5 rounded-md
            ${activeTab === tab.value
              ? 'bg-[#EFF6FF] text-[#1D4ED8]'
              : 'bg-[#E2E8F0] text-[#64748B]'
            }
          `}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

export default Tabs;
