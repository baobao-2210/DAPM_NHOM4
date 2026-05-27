import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  iconBg = 'bg-[#EFF6FF]',
  iconColor = 'text-[#1D4ED8]',
  className = '',
}) => (
  <div className={`bg-white rounded-2xl border border-[#E2E8F0] p-5 transition-all duration-200 hover:shadow-md ${className}`}>
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trend >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
        }`}>
          {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-2xl font-bold text-[#0F172A] mb-1">{value}</p>
    <p className="text-sm text-[#64748B]">{title}</p>
    {trendLabel && (
      <p className="text-xs text-[#94A3B8] mt-1">{trendLabel}</p>
    )}
  </div>
);

export default StatCard;
