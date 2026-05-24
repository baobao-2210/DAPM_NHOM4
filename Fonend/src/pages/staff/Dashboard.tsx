// src/pages/staff/Dashboard.tsx  — UC-21: Nhận yêu cầu cứu hộ
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffData } from '../../hooks/useStaffQueries';

const STATUS_COLOR: Record<string, { bg: string; text: string; label: string }> = {
  TiepNhan:  { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Chờ nhận' },
  DangXuLy:  { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Đang xử lý' },
  HoanThanh: { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Hoàn thành' },
  DaHuy:     { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Đã hủy' },
};

const fmt  = (n?: number) => n != null ? n.toLocaleString('vi-VN') + ' đ' : '—';
const fmtD = (d?: string) =>
  d ? new Date(d).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }) : '—';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'pending' | 'active'>('pending');
  const { pendingQuery, activeTaskQuery, actions } = useStaffData();

  // State quản lý các Hộp thoại (Modals)
  const [confirmAcceptId, setConfirmAcceptId] = useState<number | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  // Xử lý dữ liệu trả về
  const pendingTasks = Array.isArray(pendingQuery.data) ? pendingQuery.data : [];
  const activeData = activeTaskQuery.data;
  const activeTasks = activeData ? (Array.isArray(activeData) ? activeData : [activeData]) : [];
  
  // Kiểm tra xem nhân viên có đang bận không
  const hasActiveTask = activeTasks.length > 0;

  // 1. Logic kiểm tra trước khi bấm nhận đơn
  const handleAcceptClick = (id: number) => {
    if (hasActiveTask) {
      setWarningMsg('Bạn đang có nhiệm vụ chưa hoàn thành. Vui lòng hoàn tất xử lý trước khi nhận thêm đơn mới!');
      return;
    }
    // Nếu rảnh rỗi, mở hộp thoại Yes/No
    setConfirmAcceptId(id);
  };

  // 2. Logic gọi API sau khi bấm "Yes"
  const confirmAccept = () => {
    if (confirmAcceptId) {
      actions.accept.mutate(confirmAcceptId, {
        onSuccess: () => {
          setConfirmAcceptId(null);
          setTab('active'); // Tự động chuyển sang tab Đang xử lý
        },
        onError: () => {
          setConfirmAcceptId(null);
          setWarningMsg('Có lỗi xảy ra khi nhận nhiệm vụ. Vui lòng thử lại sau.');
        }
      });
    }
  };

  // Render thẻ nhiệm vụ
  const renderTaskCard = (task: any, isActiveTab: boolean) => {
    const status = STATUS_COLOR[task.trangThaiHienTai] || STATUS_COLOR.TiepNhan;

    return (
      <div key={task.id} className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-5">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mã nhiệm vụ</span>
            <h3 className="text-xl font-black text-[#1e3a8a] leading-none mt-1">#{task.id}</h3>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400 shrink-0 mt-0.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Khách hàng</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{task.tenKhachHang || 'Khách vãng lai'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400 shrink-0 mt-0.5"><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H8.5a1 1 0 00-.8.4L5 11l-5.16.86a1 1 0 00-.84.99V16h3m14 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM9 16a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phương tiện</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{task.hangXe} {task.dongXe} {task.mauXe && `- ${task.mauXe}`}</p>
                <p className="text-xs text-gray-500 font-medium">{task.bienSo}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dịch vụ yêu cầu</p>
                <p className="text-sm font-bold text-blue-700 mt-0.5">{task.tenDichVu}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-red-500 shrink-0 mt-0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Vị trí sự cố</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5 leading-snug">{task.noiSuCo}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">{fmtD(task.ngayTao)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Khu vực nút bấm */}
        <div className="border-t border-gray-100 pt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Phí dự kiến</p>
            <p className="text-xl font-black text-gray-900">{fmt(task.chiPhiDuKien || task.giaCoBan)}</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-3">
            {!isActiveTab ? (
              <button
                onClick={() => handleAcceptClick(task.id)}
                disabled={actions.accept.isPending}
                className="w-full md:w-auto px-8 py-3 bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 shadow-sm"
              >
                Nhận nhiệm vụ
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/partner/chat/${task.id}`)}
                  className="flex-1 md:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                >
                  Nhắn tin
                </button>
                <button
                  onClick={() => navigate(`/partner/yeucau/${task.id}`)}
                  className="flex-1 md:flex-none px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  Tiến hành xử lý
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nhiệm vụ cứu hộ</h1>
          <p className="text-gray-500 mt-1 font-medium">Quản lý và tiếp nhận các yêu cầu cứu hộ từ khách hàng</p>
        </div>

        {/* TABS */}
        <div className="flex space-x-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => setTab('pending')}
            className={`px-6 py-3.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2.5 ${
              tab === 'pending'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Đơn chờ tiếp nhận
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${tab === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
              {pendingTasks.length}
            </span>
          </button>
          <button
            onClick={() => setTab('active')}
            className={`px-6 py-3.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2.5 ${
              tab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Đang xử lý
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${tab === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
              {activeTasks.length}
            </span>
          </button>
        </div>

        {/* DANH SÁCH NHIỆM VỤ (HIỂN THỊ DẠNG LIST ĐỂ TRÁNH TRỐNG MÀN HÌNH BÊN PHẢI) */}
        <div className="flex flex-col gap-5">
          {tab === 'pending' ? (
            pendingQuery.isLoading ? (
              <div className="py-10 text-center text-gray-400 font-medium">Đang tìm kiếm đơn mới...</div>
            ) : pendingTasks.length > 0 ? (
              pendingTasks.map(task => renderTaskCard(task, false))
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-400"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
                <p className="text-gray-600 font-bold text-lg">Chưa có yêu cầu cứu hộ nào</p>
                <p className="text-gray-400 text-sm mt-1">Hệ thống sẽ tự động cập nhật khi có đơn mới.</p>
              </div>
            )
          ) : (
            activeTaskQuery.isLoading ? (
              <div className="py-10 text-center text-gray-400 font-medium">Đang kiểm tra nhiệm vụ...</div>
            ) : activeTasks.length > 0 ? (
              activeTasks.map(task => renderTaskCard(task, true))
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <p className="text-gray-600 font-bold text-lg">Bạn đang rảnh rỗi</p>
                <p className="text-gray-400 text-sm mt-1">Bạn chưa nhận nhiệm vụ nào hoặc đã hoàn thành hết.</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. HỘP THOẠI XÁC NHẬN NHẬN ĐƠN (YES / NO BOX)               */}
      {/* ========================================================= */}
      {confirmAcceptId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 mx-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" className="w-8 h-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="text-2xl font-black text-center text-gray-900 mb-3">Nhận nhiệm vụ?</h3>
            <p className="text-center text-gray-500 mb-8 leading-relaxed">
              Bạn sắp tiếp nhận yêu cầu mã <span className="font-bold text-blue-700">#{confirmAcceptId}</span>. Vui lòng di chuyển đến vị trí của khách hàng ngay sau khi xác nhận.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmAcceptId(null)}
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmAccept}
                disabled={actions.accept.isPending}
                className="flex-1 py-3.5 bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-50"
              >
                {actions.accept.isPending ? 'Đang nhận...' : 'Đồng ý nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. HỘP THOẠI CẢNH BÁO (THAY THẾ CHO TOAST NOTIFICATION)     */}
      {/* ========================================================= */}
      {warningMsg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5 mx-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="w-8 h-8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 className="text-xl font-black text-center text-gray-900 mb-3">Không thể nhận đơn</h3>
            <p className="text-center text-gray-500 mb-8 leading-relaxed">
              {warningMsg}
            </p>
            <button 
              onClick={() => setWarningMsg(null)}
              className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

    </div>
  );
}