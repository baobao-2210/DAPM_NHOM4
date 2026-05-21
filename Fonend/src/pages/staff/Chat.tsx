// src/pages/staff/Chat.tsx  —  UC-25: Nhắn tin khách hàng
// Theo demo image9: 3 cột — sidebar tin nhắn | chat area | thông tin cứu hộ
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTinNhan, useStaffData, useYeuCauDetail } from '../../hooks/useStaffQueries';
import { staffApi } from '../../api/staffApi';
import toast from 'react-hot-toast';

const fmtTime = (d?: string) =>
  d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '';

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  TiepNhan:  { label: 'Chờ nhận',    color: 'bg-orange-100 text-orange-700' },
  DangXuLy:  { label: 'Đang xử lý', color: 'bg-blue-600 text-white' },
  HoanThanh: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
  DaHuy:     { label: 'Đã hủy',     color: 'bg-red-100 text-red-700' },
};

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const requestId = Number(id);

  const { staffInfo } = useStaffData();
  const idTaiKhoan   = staffInfo?.idTaiKhoan ?? 0;
  const staffId      = staffInfo?.idNhanVien ?? 0;

  const { data: yc }          = useYeuCauDetail(requestId, staffId);
  const { data: messages = [], refetch } = useTinNhan(requestId, idTaiKhoan);

  const [text, setText]     = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !idTaiKhoan) return;
    setSending(true);
    try {
      await staffApi.sendMessage(requestId, idTaiKhoan, text.trim());
      setText('');
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Gửi tin nhắn thất bại');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const statusInfo = STATUS_LABEL[yc?.trangThaiHienTai ?? ''] ?? { label: 'Không xác định', color: 'bg-gray-100 text-gray-600' };

  return (
    <div className="flex h-full bg-gray-50" style={{ height: 'calc(100vh - 0px)' }}>

      {/* ── Col 1: Chat header & messages ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-600 transition-colors mr-1"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              {yc?.tenKhachHang?.charAt(0) ?? 'K'}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">
                {yc?.tenKhachHang ?? 'Khách hàng'}
              </p>
              <p className="text-xs text-green-500 font-medium">
                Đang trực tuyến • Mã yêu cầu: #{requestId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${yc?.soDienThoai}`}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              title="Gọi điện"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.0 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </a>
            <button
              onClick={() => navigate(`/partner/yeucau/${requestId}`)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              title="Thông tin chi tiết"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <p className="font-medium text-sm">Chưa có tin nhắn nào</p>
              <p className="text-xs mt-1">Hãy bắt đầu hội thoại với khách hàng</p>
            </div>
          ) : (
            <>
              {/* Date separator */}
              {messages[0] && (
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium px-2">
                    HÔM NAY, {new Date(messages[0].thoiGianGui).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long' }).toUpperCase()}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}

              {messages.map((msg, i) => {
                const isMe = msg.isMyMessage;
                const prev = i > 0 ? messages[i - 1] : null;
                const showAvatar = !prev || prev.idTaiKhoanGui !== msg.idTaiKhoanGui;

                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    {!isMe && (
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                        {msg.avatarNguoiGui
                          ? <img src={msg.avatarNguoiGui} className="w-8 h-8 rounded-full object-cover" alt="" />
                          : <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                              {msg.tenNguoiGui?.charAt(0) ?? 'K'}
                            </div>
                        }
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`max-w-[65%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {msg.loai === 'Image' && msg.fileUrl ? (
                        <img src={msg.fileUrl} alt="" className={`rounded-xl max-w-[240px] ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`} />
                      ) : (
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? 'bg-[#1e3a8a] text-white rounded-br-sm'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                        }`}>
                          {msg.noiDung}
                        </div>
                      )}
                      <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[10px] text-gray-400">{fmtTime(msg.thoiGianGui)}</span>
                        {isMe && (
                          <span className="text-[10px] text-gray-400">• Đã gửi</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-400 pb-2 shrink-0">
          NHẤN ENTER ĐỂ GỬI • SHIFT+ENTER ĐỂ XUỐNG DÒNG
        </p>

        {/* Input */}
        <div className="bg-white border-t px-4 py-3 flex items-end gap-2 shrink-0">
          <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>

          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              rows={1}
              className="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors max-h-28"
              style={{ minHeight: '40px' }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!text.trim() || sending || !idTaiKhoan}
            className="w-10 h-10 bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-40 shrink-0 shadow-sm"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 translate-x-0.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Col 2: Thông tin cứu hộ (right panel) ── */}
      <div className="w-72 bg-white border-l shrink-0 overflow-y-auto">
        <div className="p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Thông tin cứu hộ
          </p>

          {yc ? (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Trạng thái</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>

              {/* Vehicle */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Phương tiện</p>
                <p className="font-bold text-gray-800 text-sm">
                  {yc.hangXe} {yc.dongXe}
                </p>
                <p className="text-xs text-gray-500">{yc.bienSo}</p>
                {yc.mauXe && <p className="text-xs text-gray-400">{yc.mauXe}</p>}
              </div>

              {/* Service */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Dịch vụ</p>
                <p className="font-bold text-blue-700 text-sm">{yc.tenDichVu}</p>
                <p className="text-xs text-gray-500 mt-0.5">{yc.tenDanhMuc}</p>
              </div>

              {/* Location */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-blue-600 mt-0.5 shrink-0">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <p className="text-xs text-gray-400">Điểm đến yêu cầu</p>
                    <p className="font-medium text-gray-700 text-xs mt-0.5">{yc.noiSuCo}</p>
                    <p className="text-xs text-gray-400">{yc.tenPhuongXa}, {yc.tenTinh}</p>
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-2">Chi phí</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Giá cơ bản</span>
                    <span className="font-medium">{(yc.giaCoBan ?? 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                  {yc.trangThaiHienTai === 'HoanThanh' && yc.chiPhiThucTe != null && (
                    <div className="flex justify-between border-t border-blue-200 pt-1 mt-1">
                      <span className="text-gray-700 font-semibold">Thực tế</span>
                      <span className="font-bold text-blue-700">{yc.chiPhiThucTe.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick actions */}
              <div className="pt-2 border-t space-y-2">
                <button
                  onClick={() => navigate(`/partner/yeucau/${requestId}`)}
                  className="w-full py-2.5 bg-[#1e3a8a] hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Xem chi tiết nhiệm vụ
                </button>
                <a
                  href={`tel:${yc.soDienThoai}`}
                  className="block w-full py-2.5 text-center border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium rounded-lg transition-colors"
                >
                  Gọi {yc.soDienThoai}
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8 text-sm">Đang tải thông tin...</div>
          )}
        </div>
      </div>
    </div>
  );
}