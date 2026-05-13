import { Calendar, MapPin, CheckCircle, Search, FileText } from 'lucide-react';
import { useStaffData } from '../../hooks/useStaffQueries';

export default function StaffHistory() {
  const { historyQuery } = useStaffData();
  const historyData = historyQuery.data || [];

  if (historyQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold">Đang tải lịch sử cứu hộ...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Nhân Viên</span><span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Lịch Sử</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Lịch sử hoạt động</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">Xem lại các nhiệm vụ cứu hộ bạn đã hoàn thành và doanh thu tương ứng.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
          <input 
            placeholder="Tìm kiếm nhiệm vụ..." 
            className="w-full bg-white border border-[var(--border)] rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all focus:ring-4 focus:ring-[var(--primary)]/5"
          />
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {historyData.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center text-[var(--text-muted)]">
            <FileText size={48} className="opacity-20 mb-4" />
            <p className="font-bold text-lg text-[var(--text-main)]">Chưa có lịch sử làm việc</p>
            <p className="text-sm">Bạn chưa hoàn thành nhiệm vụ cứu hộ nào.</p>
          </div>
        ) : (
          historyData.map((req: any) => (
            <div key={req.id} className="card p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-[var(--primary)]/40 transition-all group">
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0 bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <CheckCircle size={24} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-[var(--text-main)]">{req.tenKhachHang}</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
                      <Calendar size={10} /> Hoàn thành
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-sub)]">
                    <MapPin size={14} className="text-[var(--primary)] flex-shrink-0" /> 
                    <span className="truncate max-w-md">{req.diaChi}</span>
                  </div>
                </div>
              </div>
              <div className="text-right w-full md:w-auto bg-[var(--bg-body)] md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Doanh Thu</div>
                <div className="text-2xl font-black text-[var(--primary)]">
                  {req.chiPhiThucTe ? new Intl.NumberFormat('vi-VN').format(req.chiPhiThucTe) + ' ₫' : '0 ₫'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}