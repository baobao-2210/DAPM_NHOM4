// src/pages/staff/RequestDetail.tsx — UC-22/23/24
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useYeuCauDetail, useStaffData } from '../../hooks/useStaffQueries';
import type { SubStatus } from '../../api/staffApi';

const fmt  = (n?: number | null) => n != null ? n.toLocaleString('vi-VN') + ' đ' : '—';
const fmtD = (d?: string | null) => d ? new Date(d).toLocaleString('vi-VN') : '—';

const STEPS = [
  { key: 'TiepNhan',    label: 'Nhiệm vụ tiếp nhận',       desc: 'Hệ thống tiếp nhận yêu cầu từ khách hàng' },
  { key: 'DangXuLy',   label: 'Đã bắt đầu di chuyển',     desc: 'Nhân viên đã xác nhận hệ thống và chuẩn bị đi' },
  { key: 'DangDen',    label: 'Đang đến hiện trường',      desc: 'Nhân viên đang trên đường di chuyển tới vị trí sự cố' },
  { key: 'DangSua',    label: 'Đang xử lý sự cố',         desc: 'Nhân viên đã tiếp cận và đang tiến hành sửa chữa' },
  { key: 'DangKiemTra',label: 'Kiểm tra hoàn tất',        desc: 'Sửa chữa hoàn tất, đang kiểm tra vận hành lần cuối' },
  { key: 'HoanThanh',  label: 'Hoàn thành cứu hộ',        desc: 'Nhiệm vụ kết thúc thành công, đã thu tiền' },
];

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const yeuCauId = Number(id);

  const { staffId, actions } = useStaffData();
  const { data: yc, isLoading, refetch } = useYeuCauDetail(yeuCauId, staffId);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [ghiChuST,  setGhiChuST]   = useState('');

  const [showDoneModal, setShowDoneModal] = useState(false);
  const [chiPhi,    setChiPhi]     = useState('');
  const [ghiChuHT,  setGhiChuHT]   = useState('');

  const [alertMsg, setAlertMsg] = useState<string | null>(null);

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

  const isDone = yc.trangThaiHienTai === 'HoanThanh';
  const isCancelled = yc.trangThaiHienTai === 'DaHuy';
  const isActive = !isDone && !isCancelled;

  const lastStatus = yc.lichSuTrangThai?.slice(-1)[0]?.trangThai ?? yc.trangThaiHienTai;
  const stepIdx = STEPS.findIndex(s => s.key === lastStatus);

  // 1. TỰ ĐỘNG TÍNH TOÁN BƯỚC TIẾP THEO THEO QUY TRÌNH 1 CHIỀU
  let nextStatus: SubStatus | null = null;
  let nextLabel = '';

  if (lastStatus === 'TiepNhan' || lastStatus === 'DangXuLy') {
    nextStatus = 'DangDen';
    nextLabel = 'Đang đến hiện trường';
  } else if (lastStatus === 'DangDen') {
    nextStatus = 'DangSua';
    nextLabel = 'Đang xử lý sự cố';
  } else if (lastStatus === 'DangSua') {
    nextStatus = 'DangKiemTra';
    nextLabel = 'Kiểm tra hoàn tất';
  }

  // 2. KHÓA HOÀN THÀNH: Chỉ cho phép click khi đã tới bước "Đang kiểm tra"
  const canComplete = lastStatus === 'DangKiemTra';

  const handleUpdateStatus = () => {
    if (!nextStatus) return;
    actions.updateStatus.mutate(
      { id: yeuCauId, trangThai: nextStatus, ghiChu: ghiChuST },
      { 
        onSuccess: () => { 
          setShowStatusModal(false); 
          setGhiChuST(''); 
          refetch(); 
        },
        onError: (err: any) => {
          setShowStatusModal(false);
          setAlertMsg(err?.response?.data?.message || 'Cập nhật trạng thái thất bại!');
        }
      }
    );
  };

  const handleComplete = () => {
    const cp = parseFloat(chiPhi);
    if (isNaN(cp) || cp < 0) { 
      setAlertMsg('Vui lòng nhập số tiền chi phí hợp lệ!'); 
      return; 
    }
    actions.complete.mutate(
      { id: yeuCauId, chiPhiThucTe: cp, ghiChu: ghiChuHT },
      { 
        onSuccess: () => { 
          setShowDoneModal(false); 
          refetch(); 
        },
        onError: (err: any) => {
          setShowDoneModal(false);
          setAlertMsg(err?.response?.data?.message || 'Không thể lưu hoàn thành cứu hộ!');
        }
      }
    );
  };

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(yc.noiSuCo || '')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="p-6">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-blue-600 text-sm hover:underline mb-2 flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Quay lại
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Mã nhiệm vụ: #{yc.id}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isDone ? 'bg-green-100 text-green-700' : isCancelled ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {isDone ? 'Hoàn thành' : isCancelled ? 'Đã hủy' : 'Đang xử lý'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isDone ? 'Chi tiết nhiệm vụ hoàn thành' : 'Cập nhật trạng thái cứu hộ'}
            </h1>
          </div>

          
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* CỘT TRÁI */}
        <div className="col-span-2 space-y-4">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1 h-[300px]">
            <iframe title="Google Maps Định Vị Sự Cố" src={googleMapsEmbedUrl} width="100%" height="100%" style={{ border: 0, borderRadius: '12px' }} allowFullScreen loading="lazy"></iframe>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h2 className="font-semibold text-gray-700 mb-4">Tóm tắt nhiệm vụ</h2>
            <div className="grid grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">KHÁCH HÀNG</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                    {yc.tenKhachHang?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{yc.tenKhachHang}</p>
                    <a href={`tel:${yc.soDienThoai}`} className="text-blue-600 text-xs hover:underline">{yc.soDienThoai}</a>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">PHƯƠNG TIỆN</p>
                <p className="font-semibold text-gray-800">{yc.hangXe} {yc.dongXe}</p>
                <p className="text-gray-500 text-xs">Biển số: {yc.bienSo} • {yc.mauXe || '—'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">DỊCH VỤ THỰC HIỆN</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-700 text-xs">🔧</span>
                  <span className="font-semibold text-gray-800">{yc.tenDichVu}</span>
                </div>
                {yc.moTaSuCo && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{yc.moTaSuCo}</p>}
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">ĐỊA ĐIỂM CỨU HỘ</p>
                <p className="font-medium text-gray-800">{yc.noiSuCo}</p>
                <p className="text-xs text-gray-500">{yc.tenPhuongXa}, {yc.tenTinh}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h2 className="font-semibold text-gray-700 mb-4">Cập nhật quy trình</h2>
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const done    = i < stepIdx;
                const current = i === stepIdx;
                const future  = i > stepIdx;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      done ? 'bg-blue-600 border-blue-600' : current ? 'bg-white border-blue-600' : 'bg-white border-gray-300'
                    }`}>
                      {done && <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3"><path d="M1 5l3 3.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      {current && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    </div>
                    <div className={`flex-1 ${future ? 'opacity-40' : ''}`}>
                      <p className={`text-sm ${done || current ? 'font-medium text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                      {current && <p className="text-xs text-blue-600">Đang ở bước này...</p>}
                      {done && yc.lichSuTrangThai?.find(ls => ls.trangThai === step.key) && (
                        <p className="text-xs text-gray-400">Lúc {fmtD(yc.lichSuTrangThai.find(ls => ls.trangThai === step.key)!.thoiGianCapNhat)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* THẺ HÀNH ĐỘNG */}
          {isActive && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700">Hành động</h2>
              <div className="grid grid-cols-2 gap-3">
                {/* NÚT CẬP NHẬT TỰ ĐỘNG LẤY TÊN BƯỚC TIẾP THEO */}
                {nextStatus ? (
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="px-4 py-3 bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors text-center"
                  >
                    Cập nhật: {nextLabel}
                  </button>
                ) : (
                  <div className="px-4 py-3 bg-green-50 text-green-700 text-sm font-semibold rounded-lg text-center flex items-center justify-center">
                    ✓ Đã hoàn thành các bước trung gian
                  </div>
                )}

                <button
                  onClick={() => navigate(`/partner/chat/${yeuCauId}`)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                >
                  Gọi điện / Nhắn tin
                </button>
              </div>

              {/* NÚT HOÀN THÀNH BỊ KHÓA CHẶT TẠI ĐÂY NẾU CHƯA ĐẠT ĐIỀU KIỆN */}
              <button
                onClick={() => setShowDoneModal(true)}
                disabled={!canComplete}
                className={`w-full px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
                  canComplete ? 'bg-green-600 hover:bg-green-700 text-white shadow' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canComplete ? 'Xác nhận hoàn thành cứu hộ & Xuất hóa đơn' : 'Cần cập nhật hết các bước trước khi Hoàn thành'}
              </button>
            </div>
          )}
        </div>

        {/* CỘT PHẢI */}
        <div className="space-y-4">
          <div className="bg-[#1e3a8a] rounded-xl p-5 text-white shadow-sm">
            <h2 className="font-bold text-base mb-1">Chi tiết hóa đơn</h2>
            <p className="text-blue-300 text-xs">Mã đơn: #{yc.id}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200">Phí dịch vụ cơ bản</span>
                <span className="font-medium">{fmt(yc.giaCoBan)}</span>
              </div>
              <div className="border-t border-blue-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-blue-200">Tổng dự kiến</span>
                  <span className="font-bold">{fmt(yc.chiPhiDuKien ?? yc.giaCoBan)}</span>
                </div>
                {isDone && yc.chiPhiThucTe != null && (
                  <div className="flex justify-between mt-1 pt-1 border-t border-dashed border-blue-400">
                    <span className="text-white font-semibold">Thực tế thu</span>
                    <span className="text-yellow-300 font-bold text-base">{fmt(yc.chiPhiThucTe)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {yc.danhGia && (
            <div className="bg-white rounded-xl p-4 border border-yellow-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 text-sm mb-2">Đánh giá từ khách</h3>
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} viewBox="0 0 24 24" fill={i <= yc.danhGia!.soSao ? '#f59e0b' : '#e5e7eb'} className="w-4 h-4">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
                <span className="text-xs text-gray-500 ml-1">{yc.danhGia.soSao}/5</span>
              </div>
              <p className="text-sm text-gray-600 italic">"{yc.danhGia.nhanXet}"</p>
            </div>
          )}

          {yc.lichSuTrangThai && yc.lichSuTrangThai.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 text-sm mb-3">Nhật ký hoạt động</h3>
              <div className="space-y-2">
                {yc.lichSuTrangThai.slice().reverse().map(ls => (
                  <div key={ls.idLichSu} className="flex gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-gray-700 font-medium">{ls.trangThai}</p>
                      {ls.ghiChu && <p className="text-gray-400">{ls.ghiChu}</p>}
                      <p className="text-gray-300 text-[11px]">{fmtD(ls.thoiGianCapNhat)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL: CẬP NHẬT TRẠNG THÁI (KHÔNG CẦN CHỌN, LƯU TRỰC TIẾP BƯỚC TIẾP THEO) ── */}
      {showStatusModal && nextStatus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Xác nhận tiến độ</h3>
            <p className="text-gray-500 text-sm mb-4">
              Hệ thống sẽ cập nhật trạng thái cứu hộ sang: <span className="font-bold text-blue-700">{nextLabel}</span>
            </p>

            <textarea
              value={ghiChuST}
              onChange={e => setGhiChuST(e.target.value)}
              placeholder="Nhập ghi chú tình hình (tuỳ chọn)..."
              rows={2}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowStatusModal(false)} className="py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50">
                Hủy bỏ
              </button>
              <button 
                onClick={handleUpdateStatus} disabled={actions.updateStatus.isPending}
                className="py-2.5 bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
              >
                {actions.updateStatus.isPending ? 'Đang lưu...' : 'Xác nhận đi tiếp'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: XÁC NHẬN HOÀN THÀNH (NHẬP TỔNG TIỀN TRỰC TIẾP) ── */}
      {showDoneModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Xác nhận hoàn thành cứu hộ</h3>
            <p className="text-gray-500 text-sm mb-5">Vui lòng nhập <span className="font-bold">Tổng chi phí thực tế</span> đã thu từ khách hàng.</p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Chi phí thực tế (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={chiPhi}
                onChange={e => setChiPhi(e.target.value)}
                placeholder={`Gợi ý (Giá cơ bản): ${(yc.giaCoBan ?? 0).toLocaleString('vi-VN')}`}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            <textarea
              value={ghiChuHT}
              onChange={e => setGhiChuHT(e.target.value)}
              placeholder="Ghi chú chi tiết kết quả sửa chữa..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowDoneModal(false)} className="py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50">
                Quay lại
              </button>
              <button
                onClick={handleComplete} disabled={!chiPhi || isNaN(parseFloat(chiPhi)) || actions.complete.isPending}
                className="py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
              >
                {actions.complete.isPending ? 'Đang lưu...' : 'Xuất hóa đơn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: THÔNG BÁO LỖI ── */}
      {alertMsg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Thông báo hệ thống</h3>
            <p className="text-gray-500 text-sm mb-6">{alertMsg}</p>
            <button onClick={() => setAlertMsg(null)} className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl">
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}