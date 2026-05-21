// src/pages/staff/Dashboard.tsx  — UC-21: Nhận yêu cầu cứu hộ
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffData } from '../../hooks/useStaffQueries';

const STATUS_COLOR: Record<string, { bg: string; text: string; label: string }> = {
  TiepNhan:    { bg: 'bg-orange-100',   text: 'text-orange-700',  label: 'Chờ nhận' },
  DangXuLy:    { bg: 'bg-blue-100',     text: 'text-blue-700',    label: 'Đang xử lý' },
  HoanThanh:   { bg: 'bg-green-100',    text: 'text-green-700',   label: 'Hoàn thành' },
  DaHuy:       { bg: 'bg-red-100',      text: 'text-red-700',     label: 'Đã hủy' },
};

const fmt  = (n?: number) => n != null ? n.toLocaleString('vi-VN') + 'đ' : '—';
const fmtD = (d?: string) =>
  d ? new Date(d).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }) : '—';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'pending' | 'active'>('pending');
  const { pendingQuery, activeTaskQuery, actions, staffInfo } = useStaffData();

  const pending = pendingQuery.data ?? [];
  const active  = activeTaskQuery.data;

  const handleAccept = (id: number) => {
    if (!window.confirm('Xác nhận nhận yêu cầu cứu hộ này?')) return;
    actions.accept.mutate(id, {
      onSuccess: () => setTab('active'),
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nhiệm vụ hiện tại</h1>
        <p className="text-gray-500 text-sm mt-1">
          Quản lý và xử lý các yêu cầu cứu hộ được phân công
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Đơn chờ nhận',    value: pending.length,    color: 'text-orange-600', bg: 'bg-orange-50  border-orange-100' },
          { label: 'Đang xử lý',      value: active ? 1 : 0,   color: 'text-blue-600',   bg: 'bg-blue-50    border-blue-100' },
          { label: 'Hoàn thành (tháng)', value: staffInfo?.thongKe?.tongDonHoanThanh ?? 0, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-600 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5 w-fit">
        {[
          { key: 'pending', label: `Đơn chờ nhận (${pending.length})` },
          { key: 'active',  label: active ? 'Đơn đang xử lý' : 'Đang rảnh' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-white text-[#1e3a8a] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Pending list ── */}
      {tab === 'pending' && (
        <>
          {pendingQuery.isLoading ? (
            <div className="text-center py-20 text-gray-400">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Đang tải danh sách...</p>
            </div>
          ) : pending.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-400">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Không có đơn chờ phù hợp</p>
              <p className="text-gray-400 text-sm mt-1">Các đơn sẽ xuất hiện khi phù hợp với dịch vụ và khu vực của bạn</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all overflow-hidden">
                  {/* Colored top bar */}
                  <div className="h-1 bg-orange-400" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-bold text-gray-500">#{item.id}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR['TiepNhan'].bg} ${STATUS_COLOR['TiepNhan'].text}`}>
                            Chờ nhận
                          </span>
                          <span className="ml-auto text-xs text-gray-400">{fmtD(item.ngayTao)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-400 text-xs block">Khách hàng</span>
                            <span className="font-semibold text-gray-800">{item.tenKhachHang}</span>
                            <span className="text-blue-600 ml-2 text-xs">{item.soDienThoai}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs block">Phương tiện</span>
                            <span className="font-semibold text-gray-800">{item.bienSo}</span>
                            <span className="text-gray-500 ml-1 text-xs">{item.hangXe} {item.dongXe}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs block">Dịch vụ</span>
                            <span className="font-semibold text-blue-700">{item.tenDichVu}</span>
                            <span className="text-green-600 ml-2 text-xs font-medium">{fmt(item.giaCoBan)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs block">Địa điểm</span>
                            <span className="text-gray-700 text-sm">{item.noiSuCo}</span>
                            <span className="text-gray-400 text-xs ml-1">({item.tenPhuongXa})</span>
                          </div>
                        </div>

                        {item.moTaSuCo && (
                          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-sm text-amber-800">
                            <span className="font-medium">Ghi chú: </span>{item.moTaSuCo}
                          </div>
                        )}
                      </div>

                      {/* Right: actions */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleAccept(item.id)}
                          disabled={actions.accept.isPending}
                          className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {actions.accept.isPending ? 'Đang nhận...' : 'Nhận nhiệm vụ'}
                        </button>
                        <button
                          onClick={() => navigate(`/partner/yeucau/${item.id}`)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Active task ── */}
      {tab === 'active' && (
        <>
          {!active ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-green-500">
                  <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Bạn đang rảnh</p>
              <p className="text-gray-400 text-sm mt-1">Chuyển sang tab "Đơn chờ nhận" để nhận nhiệm vụ mới</p>
              <button
                onClick={() => setTab('pending')}
                className="mt-4 px-5 py-2 bg-[#1e3a8a] text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Xem đơn chờ
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
              <div className="h-1 bg-blue-600" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-gray-500">#{active.id}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Đang xử lý</span>
                      {active.subStatus && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          {active.subStatus === 'DangDen' ? 'Đang di chuyển'
                           : active.subStatus === 'DangSua' ? 'Đang sửa chữa'
                           : active.subStatus === 'DangKiemTra' ? 'Đang kiểm tra'
                           : active.subStatus}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Khách hàng</p>
                        <p className="font-semibold text-gray-800">{active.tenKhachHang}</p>
                        <a href={`tel:${active.soDienThoai}`} className="text-blue-600 text-xs hover:underline">
                          {active.soDienThoai}
                        </a>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Phương tiện</p>
                        <p className="font-semibold text-gray-800">{active.bienSo}</p>
                        <p className="text-gray-500 text-xs">{active.hangXe} {active.dongXe} {active.mauXe && `- ${active.mauXe}`}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Dịch vụ</p>
                        <p className="font-semibold text-blue-700">{active.tenDichVu}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Địa điểm sự cố</p>
                        <p className="text-gray-700">{active.noiSuCo}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/partner/yeucau/${active.id}`)}
                      className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Cập nhật tiến trình
                    </button>
                    <button
                      onClick={() => navigate(`/partner/chat/${active.id}`)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      Nhắn tin khách
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}