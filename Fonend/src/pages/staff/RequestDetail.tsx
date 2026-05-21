// src/pages/staff/RequestDetail.tsx — UC-22/23/24
// Giao diện bám sát demo Hình 14 & 15 trong file Word
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useYeuCauDetail, useStaffData } from '../../hooks/useStaffQueries';
import type { SubStatus } from '../../api/staffApi';

const fmt  = (n?: number | null) => n != null ? n.toLocaleString('vi-VN') + ' đ' : '—';
const fmtD = (d?: string | null) =>
  d ? new Date(d).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
const fmtTime = (d?: string | null) => 
  d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—';

// Các bước tiến trình theo demo
const STEPS = [
  { key: 'TiepNhan',    label: 'Nhiệm vụ tiếp nhận',       done: false },
  { key: 'DangXuLy',   label: 'Đã bắt đầu di chuyển',     done: false },
  { key: 'DangDen',    label: 'Đang đến hiện trường',      done: false },
  { key: 'DangSua',    label: 'Đang xử lý sự cố',         done: false },
  { key: 'DangKiemTra',label: 'Kiểm tra hoàn tất',        done: false },
  { key: 'HoanThanh',  label: 'Hoàn thành cứu hộ',        done: false },
];

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const yeuCauId = Number(id);

  const { staffId, actions } = useStaffData();
  const { data: yc, isLoading, refetch } = useYeuCauDetail(yeuCauId, staffId);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selStatus, setSelStatus]   = useState<SubStatus>('DangDen');
  const [ghiChuST,  setGhiChuST]   = useState('');

  const [showDoneModal, setShowDoneModal] = useState(false);
  const [chiPhi,    setChiPhi]     = useState('');
  const [ghiChuHT,  setGhiChuHT]  = useState('');

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!yc) return (
    <div className="p-6 text-center">
      <p className="text-gray-500">Không tìm thấy yêu cầu</p>
      <button onClick={() => navigate(-1)} className="mt-3 text-blue-600 text-sm underline">← Quay lại</button>
    </div>
  );

  const isActive  = yc.trangThaiHienTai === 'DangXuLy';
  const isDone    = yc.trangThaiHienTai === 'HoanThanh';
  const isCancelled = yc.trangThaiHienTai === 'DaHuy';

  // Tìm bước hiện tại
  const lastStatus = yc.lichSuTrangThai?.slice(-1)[0]?.trangThai ?? yc.trangThaiHienTai;
  const stepIdx = STEPS.findIndex(s => s.key === lastStatus);

  const handleUpdateStatus = () => {
    actions.updateStatus.mutate(
      { id: yeuCauId, trangThai: selStatus, ghiChu: ghiChuST },
      { onSuccess: () => { setShowStatusModal(false); setGhiChuST(''); refetch(); } }
    );
  };

  const handleComplete = () => {
    const cp = parseFloat(chiPhi);
    if (isNaN(cp) || cp < 0) { alert('Chi phí không hợp lệ'); return; }
    if (!window.confirm(`Xác nhận hoàn thành với chi phí ${cp.toLocaleString('vi-VN')} đ?`)) return;
    actions.complete.mutate(
      { id: yeuCauId, chiPhiThucTe: cp, ghiChu: ghiChuHT },
      { onSuccess: () => { setShowDoneModal(false); refetch(); } }
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">
              Mã nhiệm vụ: #{yc.id}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              isDone ? 'bg-green-100 text-green-700'
              : isCancelled ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
            }`}>
              {isDone ? 'Hoàn thành' : isCancelled ? 'Đã hủy' : 'Đang xử lý'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isDone ? 'Chi tiết hoàn thành cứu hộ' : 'Cập nhật trạng thái cứu hộ'}
          </h1>
        </div>

        {isActive && (
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Lưu nháp
            </button>
            <button
              onClick={() => setShowDoneModal(true)}
              className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              Xác nhận & Gửi hóa đơn
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* Main Layout (2 Columns matching Demo Word) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI: BẢN ĐỒ & TÓM TẮT */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Bản đồ ảo (Giống demo Image 14) */}
          <div className="bg-[#0f172a] rounded-2xl h-[450px] relative overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
            {/* Tấm nền giả lập bản đồ */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #1e3a8a 0%, transparent 70%)' }}></div>
            <div className="text-center z-10">
              <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" className="w-16 h-16 mx-auto mb-3 opacity-80"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <h2 className="text-3xl font-black text-white/90 tracking-widest uppercase">Safe Work</h2>
              <p className="text-blue-300 text-sm mt-2">Bản đồ định vị GPS (Demo)</p>
            </div>
            
            {/* Badge vị trí */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg flex gap-6">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Vị trí của bạn</p>
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Đang di chuyển...
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Khoảng cách</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">2.4 km (8 phút)</p>
              </div>
            </div>
          </div>

          {/* Tóm tắt nhiệm vụ (Nếu đã hoàn thành - Giống Image 15) */}
          {isDone && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Tóm tắt nhiệm vụ</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Khách hàng</p>
                    <p className="font-semibold text-gray-800">{yc.tenKhachHang}</p>
                    <p className="text-sm text-gray-500">{yc.soDienThoai}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Địa điểm cứu hộ</p>
                    <p className="font-semibold text-gray-800">{yc.noiSuCo}</p>
                    <p className="text-sm text-gray-500">{yc.tenPhuongXa}, {yc.tenTinh}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Phương tiện</p>
                    <p className="font-semibold text-gray-800">{yc.hangXe} {yc.dongXe}</p>
                    <p className="text-sm text-gray-500">BS: {yc.bienSo} • {yc.mauXe}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Dịch vụ thực hiện</p>
                    <p className="font-semibold text-gray-800">{yc.tenDichVu}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: THÔNG TIN CHI TIẾT & HÀNH ĐỘNG */}
        <div className="space-y-6">
          
          {/* Card: Thông tin khách hàng (Dùng khi đang xử lý) */}
          {!isDone && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Thông tin khách hàng</h3>
                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Cần hỗ trợ gấp</span>
              </div>
              
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                  {yc.tenKhachHang?.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Khách hàng</p>
                  <p className="font-bold text-gray-900">{yc.tenKhachHang}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Phương tiện</p>
                  <p className="font-semibold text-gray-800 text-sm mt-0.5">{yc.hangXe} {yc.dongXe}</p>
                  <p className="text-xs text-gray-500">{yc.bienSo}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                  <p className="text-[10px] text-red-500 uppercase font-bold">Vấn đề</p>
                  <p className="font-semibold text-red-700 text-sm mt-0.5">{yc.tenDichVu}</p>
                  <p className="text-xs text-red-500">{fmtTime(yc.ngayTao)}</p>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-blue-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Địa chỉ sự cố
                </p>
                <p className="text-sm font-medium text-gray-800">{yc.noiSuCo}</p>
                <p className="text-xs text-gray-500">{yc.tenPhuongXa}, {yc.tenTinh}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${yc.soDienThoai}`} className="flex justify-center items-center gap-2 py-2.5 rounded-xl border-2 border-blue-100 text-blue-600 font-semibold hover:bg-blue-50 transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  Gọi điện
                </a>
                <button onClick={() => navigate(`/partner/chat/${yeuCauId}`)} className="flex justify-center items-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                  Nhắn tin
                </button>
              </div>
            </div>
          )}

          {/* Card: Cập nhật quy trình */}
          {!isDone && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Cập nhật quy trình</h3>
              <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-3 before:w-0.5 before:bg-gray-100">
                {STEPS.map((step, i) => {
                  const done    = i < stepIdx;
                  const current = i === stepIdx;
                  const future  = i > stepIdx;
                  return (
                    <div key={step.key} className="flex gap-4 relative z-10">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-white ${
                        done ? 'border-blue-600 bg-blue-600' : current ? 'border-blue-600' : 'border-gray-200'
                      }`}>
                        {done && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
                        {current && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                      </div>
                      <div className={`flex-1 pt-0.5 ${future ? 'opacity-40' : ''}`}>
                        <p className={`text-sm ${done || current ? 'font-bold text-gray-800' : 'font-medium text-gray-400'}`}>
                          {step.label}
                        </p>
                        {current && <p className="text-xs text-blue-600 font-medium italic mt-0.5">Đang cập nhật...</p>}
                        {done && yc.lichSuTrangThai?.find(ls => ls.trangThai === step.key) && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Lúc {fmtTime(yc.lichSuTrangThai.find(ls => ls.trangThai === step.key)!.thoiGianCapNhat)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {isActive && (
                <div className="mt-6 space-y-2">
                  <button onClick={() => setShowStatusModal(true)} className="w-full py-3 bg-[#1e3a8a] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Cập nhật trạng thái
                  </button>
                  <button onClick={() => setShowDoneModal(true)} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                    Hoàn thành cứu hộ
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Card: Chi tiết hóa đơn (Dùng khi đã hoàn thành - Giống Image 15) */}
          {isDone && (
            <div className="bg-[#1e3a8a] rounded-2xl p-6 text-white shadow-md">
              <h3 className="font-bold text-lg mb-1">Chi tiết hóa đơn</h3>
              <p className="text-blue-300 text-xs mb-6">Đơn vị: VNĐ</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-100">Phí dịch vụ cơ bản</span>
                  <span className="font-semibold">{fmt(yc.giaCoBan)}</span>
                </div>
                {yc.phiDichVu != null && yc.phiDichVu > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-100">Phụ phí phát sinh</span>
                    <span className="font-semibold">{fmt(yc.phiDichVu)}</span>
                  </div>
                )}
                
                <div className="pt-4 mt-2 border-t border-blue-700">
                  <div className="flex justify-between items-end">
                    <span className="text-blue-200 text-xs uppercase tracking-wider font-bold">Tổng thanh toán</span>
                    <span className="text-3xl font-black text-white">{fmt(yc.chiPhiThucTe ?? yc.chiPhiDuKien)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-900/50 rounded-xl p-3 flex items-center gap-3">
                <div className="bg-yellow-400 p-1.5 rounded text-[#1e3a8a]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                </div>
                <div>
                  <p className="text-xs text-blue-200">Hình thức</p>
                  <p className="text-sm font-semibold">Tiền mặt / Chuyển khoản</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Modal: Cập nhật trạng thái (UC-23) ── */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Cập nhật trạng thái</h3>
            <p className="text-gray-500 text-sm mb-6">Chọn trạng thái phù hợp với tiến độ công việc hiện tại</p>

            <div className="space-y-3 mb-6">
              {([
                { key: 'DangDen',     label: 'Đã bắt đầu di chuyển', desc: 'Đang trên đường đến vị trí khách hàng' },
                { key: 'DangSua',     label: 'Đang xử lý sự cố',     desc: 'Đã đến nơi và đang sửa chữa' },
                { key: 'DangKiemTra', label: 'Kiểm tra hoàn tất',    desc: 'Sắp xong, đang kiểm tra lần cuối' },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSelStatus(opt.key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    selStatus === opt.key ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selStatus === opt.key ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                    {selStatus === opt.key && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <textarea
              value={ghiChuST}
              onChange={e => setGhiChuST(e.target.value)}
              placeholder="Nhập thêm ghi chú (tuỳ chọn)..."
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 resize-none"
            />

            <div className="flex gap-3">
              <button onClick={() => setShowStatusModal(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                Hủy bỏ
              </button>
              <button onClick={handleUpdateStatus} disabled={actions.updateStatus.isPending} className="flex-1 py-3 bg-[#1e3a8a] text-white font-bold rounded-xl hover:bg-blue-800 transition disabled:opacity-50">
                {actions.updateStatus.isPending ? 'Đang lưu...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Hoàn thành (UC-24) ── */}
      {showDoneModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Xác nhận hoàn thành</h3>
            <p className="text-gray-500 text-sm mb-6">Vui lòng nhập chi phí để tạo hóa đơn cho khách hàng.</p>

            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                Chi phí thực tế (VNĐ) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={chiPhi}
                  onChange={e => setChiPhi(e.target.value)}
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-xl font-black text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">đ</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">Giá dịch vụ niêm yết: <span className="text-gray-800">{fmt(yc.giaCoBan)}</span></p>
            </div>

            <textarea
              value={ghiChuHT}
              onChange={e => setGhiChuHT(e.target.value)}
              placeholder="Ghi chú thêm về tình trạng phương tiện sau khi sửa..."
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 resize-none"
            />

            <div className="flex gap-3">
              <button onClick={() => setShowDoneModal(false)} className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                Quay lại
              </button>
              <button
                onClick={handleComplete}
                disabled={!chiPhi || isNaN(parseFloat(chiPhi)) || actions.complete.isPending}
                className="flex-[2] py-3.5 bg-[#1e3a8a] text-white font-bold rounded-xl hover:bg-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actions.complete.isPending ? 'Đang xử lý...' : 'Xác nhận & Hoàn tất'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}