import { useState } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Users, CheckCircle,
  Clock, Star, BarChart3, PieChart, Calendar, Download,
  ArrowUpRight, Car, Zap, MapPin
} from 'lucide-react';

// ===================== MOCK REPORT DATA =====================
const monthlyRevenue = [
  { month: 'T1', revenue: 45000000, requests: 89 },
  { month: 'T2', revenue: 52000000, requests: 104 },
  { month: 'T3', revenue: 48000000, requests: 96 },
  { month: 'T4', revenue: 61000000, requests: 122 },
  { month: 'T5', revenue: 58000000, requests: 116 },
  { month: 'T6', revenue: 73000000, requests: 147 },
  { month: 'T7', revenue: 85000000, requests: 170 },
  { month: 'T8', revenue: 79000000, requests: 158 },
  { month: 'T9', revenue: 92000000, requests: 184 },
  { month: 'T10', revenue: 88000000, requests: 176 },
  { month: 'T11', revenue: 95000000, requests: 190 },
  { month: 'T12', revenue: 102000000, requests: 204 },
];

const serviceBreakdown = [
  { name: 'Kéo xe cứu hộ', count: 412, revenue: 144200000, color: '#003fb1' },
  { name: 'Thay lốp xe', count: 531, revenue: 79650000, color: '#1e62e6' },
  { name: 'Cấp nhiên liệu', count: 378, revenue: 37800000, color: '#6366f1' },
  { name: 'Khởi động ắc quy', count: 289, revenue: 34680000, color: '#8b5cf6' },
  { name: 'Mở khóa xe', count: 167, revenue: 33400000, color: '#a855f7' },
];

const topStaffStats = [
  { name: 'Nguyễn Hùng Dũng', completed: 312, rating: 4.9, revenue: 109200000 },
  { name: 'Trần Minh Khoa', completed: 208, rating: 4.7, revenue: 72800000 },
  { name: 'Lê Quang Vinh', completed: 176, rating: 4.8, revenue: 61600000 },
  { name: 'Phạm Đức Tài', completed: 145, rating: 4.6, revenue: 50750000 },
  { name: 'Võ Thành Nam', completed: 98, rating: 4.5, revenue: 34300000 },
];

const regionStats = [
  { region: 'Quận 1', requests: 284, percent: 22 },
  { region: 'Quận 7', requests: 196, percent: 15 },
  { region: 'Bình Thạnh', requests: 180, percent: 14 },
  { region: 'Quận 12', requests: 143, percent: 11 },
  { region: 'Gò Vấp', requests: 130, percent: 10 },
  { region: 'Khác', requests: 365, percent: 28 },
];

function formatCurrency(n: number) {
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(1)}tỷ`;
  if (n >= 1000000) return `${(n / 1000000).toFixed(0)}tr`;
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

// ===================== BAR CHART =====================
function BarChart({ data }: { data: typeof monthlyRevenue }) {
  const maxRev = Math.max(...data.map(d => d.revenue));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, padding: '0 4px' }}>
      {data.map((d, i) => {
        const pct = (d.revenue / maxRev) * 100;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div title={`${d.month}: ${formatCurrency(d.revenue)}`}
              style={{
                width: '100%', height: `${pct}%`, minHeight: 4,
                background: i === monthlyRevenue.length - 1
                  ? 'linear-gradient(to top,var(--primary),var(--primary-light))'
                  : 'linear-gradient(to top,var(--primary-soft),rgba(30,98,230,0.3))',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
              }}
            />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ===================== PIE CHART =====================
function DonutChart({ data }: { data: typeof serviceBreakdown }) {
  const total = data.reduce((a, s) => a + s.count, 0);
  let cumulativePercent = 0;
  const segments = data.map(s => {
    const pct = (s.count / total) * 100;
    const start = cumulativePercent;
    cumulativePercent += pct;
    return { ...s, pct, start };
  });

  const r = 50;
  const cx = 60; const cy = 60;
  function polarToCart(angle: number, radius: number) {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }
  function arc(pct: number, startPct: number) {
    const start = polarToCart(startPct * 3.6, r);
    const end = polarToCart((startPct + pct) * 3.6, r);
    const large = pct > 50 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <svg width={120} height={120}>
        {segments.map((s, i) => (
          <path key={i} d={arc(s.pct, s.start)} fill={s.color} opacity={0.9} />
        ))}
        <circle cx={cx} cy={cy} r={32} fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={11} fontWeight={900} fill="var(--text-main)">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={8} fill="var(--text-muted)">lượt</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 12, color: 'var(--text-sub)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--text-main)' }}>{s.pct.toFixed(0)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================
export default function ReportPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const totalRevenue = monthlyRevenue.reduce((a, m) => a + m.revenue, 0);
  const totalRequests = monthlyRevenue.reduce((a, m) => a + m.requests, 0);
  const avgRating = 4.72;
  const completionRate = 94.3;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Quản trị</span><span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Báo cáo thống kê</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Báo cáo & Thống kê</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">Theo dõi hiệu suất, doanh thu và các chỉ số hoạt động của hệ thống cứu hộ.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Filter */}
          <div className="flex bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
            {(['week', 'month', 'quarter', 'year'] as const).map(p => (
              <button key={p}
                className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${period === p ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-body)]'}`}
                onClick={() => setPeriod(p)}>
                {p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : p === 'quarter' ? 'Quý' : 'Năm'}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary">
            <Download size={15} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Tổng doanh thu', value: formatCurrency(totalRevenue), icon: DollarSign,
            color: 'var(--primary)', bg: 'var(--primary-soft)', trend: '+18.2%', up: true,
            sub: 'So với năm trước'
          },
          {
            label: 'Tổng yêu cầu', value: totalRequests.toLocaleString('vi-VN'), icon: Car,
            color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', trend: '+12.5%', up: true,
            sub: 'Tổng trong năm'
          },
          {
            label: 'Tỷ lệ hoàn thành', value: `${completionRate}%`, icon: CheckCircle,
            color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', trend: '+2.1%', up: true,
            sub: 'So với quý trước'
          },
          {
            label: 'Đánh giá TB', value: `${avgRating}/5.0`, icon: Star,
            color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', trend: '-0.1', up: false,
            sub: 'Từ khách hàng'
          },
        ].map((s, i) => (
          <div key={i} className="card p-6 group relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)]/10 transition-all rounded-[var(--radius-lg)]" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
                <s.icon size={22} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${s.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {s.trend}
              </div>
            </div>
            <div className="text-3xl font-black text-[var(--text-main)] mb-1">{s.value}</div>
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
                <span className="font-black text-[var(--text-main)]">Doanh thu theo tháng</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Năm 2025 · Đơn vị: triệu đồng</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-[var(--primary)]">{formatCurrency(totalRevenue)}</div>
              <div className="text-xs font-bold text-green-500 flex items-center justify-end gap-1"><TrendingUp size={11} /> +18.2% YoY</div>
            </div>
          </div>
          <BarChart data={monthlyRevenue} />
        </div>

        {/* Service Breakdown */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={18} style={{ color: 'var(--primary)' }} />
            <span className="font-black text-[var(--text-main)]">Phân bổ dịch vụ</span>
          </div>
          <DonutChart data={serviceBreakdown} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Staff */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users size={18} style={{ color: 'var(--primary)' }} />
              <span className="font-black text-[var(--text-main)]">Nhân viên xuất sắc</span>
            </div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Top 5</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topStaffStats.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : 'var(--bg-body)',
                  color: i === 0 ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 12
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.completed} ca · {formatCurrency(s.revenue)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#f59e0b', fontSize: 12, fontWeight: 900, flexShrink: 0 }}>
                  <Star size={12} fill="currentColor" /> {s.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Stats */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            <span className="font-black text-[var(--text-main)]">Thống kê theo khu vực</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {regionStats.map((r, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{r.region}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{r.requests} yêu cầu</span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--primary)' }}>{r.percent}%</span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--bg-body)', borderRadius: 99 }}>
                  <div style={{
                    height: '100%', borderRadius: 99, width: `${r.percent}%`,
                    background: `linear-gradient(to right, var(--primary), var(--primary-light))`,
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Revenue Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex items-center gap-2">
          <Zap size={18} style={{ color: 'var(--primary)' }} />
          <span className="font-black text-[var(--text-main)]">Chi tiết doanh thu theo dịch vụ</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>DỊCH VỤ</th>
                <th className="text-right">LƯỢT DÙNG</th>
                <th className="text-right">DOANH THU</th>
                <th className="text-right">TỶ TRỌNG</th>
                <th className="text-right">XU HƯỚNG</th>
              </tr>
            </thead>
            <tbody>
              {serviceBreakdown.map((s, i) => {
                const totalRev = serviceBreakdown.reduce((a, x) => a + x.revenue, 0);
                const pct = ((s.revenue / totalRev) * 100).toFixed(1);
                return (
                  <tr key={i} className="hover:bg-[var(--bg-body)]/40 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 12, height: 12, borderRadius: 4, background: s.color, flexShrink: 0 }} />
                        <span className="font-black text-sm text-[var(--text-main)]">{s.name}</span>
                      </div>
                    </td>
                    <td className="text-right font-bold text-[var(--text-sub)]">{s.count.toLocaleString('vi-VN')}</td>
                    <td className="text-right font-black text-[var(--primary)]">{formatCurrency(s.revenue)}</td>
                    <td className="text-right">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <div style={{ width: 60, height: 6, background: 'var(--bg-body)', borderRadius: 99 }}>
                          <div style={{ height: '100%', background: s.color, borderRadius: 99, width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--text-main)', minWidth: 32 }}>{pct}%</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <span className="flex items-center justify-end gap-1 text-xs font-black text-green-600">
                        <ArrowUpRight size={13} /> +{(Math.random() * 20 + 5).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
