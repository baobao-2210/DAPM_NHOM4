// src/pages/staff/Chat.tsx  —  UC-25: Nhắn tin khách hàng & Quản lý Inbox
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTinNhan, useStaffData, useYeuCauDetail, useLichCuuHo } from '../../hooks/useStaffQueries';
import { staffApi } from '../../api/staffApi';
import toast from 'react-hot-toast';

const fmtTime = (d?: string) => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';

export default function Chat() {
  // Lấy ID từ URL (Nếu vào từ menu Tin nhắn thì id sẽ undefined)
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const requestId = id ? Number(id) : 0; 

  const { staffInfo } = useStaffData();
  const idTaiKhoan = staffInfo?.idTaiKhoan ?? 0;
  const staffId = staffInfo?.idNhanVien ?? 0;

  // FETCH DỮ LIỆU TỪ DATABASE
  const { data: yc } = useYeuCauDetail(requestId, staffId);
  const { data: messages = [], refetch } = useTinNhan(requestId, idTaiKhoan);

  // Lấy lịch sử tháng hiện tại để làm danh sách Inbox bên trái
  const now = new Date();
  const { data: historyData } = useLichCuuHo(staffId, now.getMonth() + 1, now.getFullYear());
  const conversations = historyData?.lichCuuHo ?? [];

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !idTaiKhoan || requestId === 0) return;
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

  // Lọc cuộc hội thoại theo thanh tìm kiếm
  const filteredConversations = conversations.filter(c =>
    c.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toString().includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 overflow-hidden">

      {/* ========================================================= */}
      {/* CỘT 1: SIDEBAR DANH SÁCH TIN NHẮN (LẤY TỪ DB)             */}
      {/* ========================================================= */}
      <div className="w-[320px] flex flex-col border-r border-gray-100 bg-white shrink-0 h-full">
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tin nhắn cứu hộ</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm hội thoại..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 text-sm border-none rounded-full pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-gray-400 text-sm mt-10">Chưa có cuộc hội thoại nào.</div>
          ) : (
            filteredConversations.map(chat => {
              const isSelected = chat.id === requestId;
              const statusColor = chat.trangThaiHienTai === 'HoanThanh' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700';

              return (
                <div
                  key={chat.id}
                  onClick={() => navigate(`/partner/chat/${chat.id}`)}
                  className={`relative flex gap-4 p-4 cursor-pointer transition-colors ${isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                  {isSelected && <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-700 rounded-r-md" />}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-lg">
                      {chat.tenKhachHang.charAt(0)}
                    </div>
                    {chat.trangThaiHienTai !== 'HoanThanh' && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                        {chat.tenKhachHang}
                      </p>
                      <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                        {new Date(chat.ngayTao).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 font-semibold truncate mb-1.5">
                      {chat.tenDichVu}
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                      {chat.trangThaiHienTai === 'HoanThanh' ? 'HOÀN THÀNH' : `CASE #RG-${chat.id}`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* CỘT 2 & 3: HIỂN THỊ CHAT & THÔNG TIN HOẶC PLACEHOLDER     */}
      {/* ========================================================= */}
      {requestId === 0 ? (
        // TRẠNG THÁI TRỐNG (Khi vừa bấm vào tab Tin nhắn từ Sidebar)
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 min-w-0">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="1.5" className="w-10 h-10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Tin nhắn & Hỗ trợ</h3>
          <p className="text-gray-500 mt-2 text-sm max-w-sm text-center">
            Chọn một đoạn hội thoại từ danh sách bên trái để xem chi tiết trao đổi và thông tin cứu hộ của khách hàng.
          </p>
        </div>
      ) : (
        // TRẠNG THÁI CÓ DATA (Khi đã chọn 1 đoạn chat)
        <>
          <div className="flex-1 flex flex-col bg-white min-w-0 border-r border-gray-100">
            {/* Header Chat */}
            <div className="h-20 border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-lg">
                  {yc?.tenKhachHang?.charAt(0) ?? 'K'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{yc?.tenKhachHang ?? 'Khách hàng'}</h3>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mt-0.5">
                    {yc?.trangThaiHienTai !== 'HoanThanh' && <span className="w-2 h-2 rounded-full bg-green-500" />}
                    {yc?.trangThaiHienTai === 'HoanThanh' ? 'Đã hoàn thành' : 'Đang trực tuyến'} • Mã yêu cầu: RG-{requestId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-[#1e3a8a]">
                <a href={`tel:${yc?.soDienThoai}`} className="hover:opacity-70 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                </a>
              </div>
            </div>

            {/* Khung chứa tin nhắn */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcfcfd]">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">Chưa có tin nhắn nào. Bắt đầu hội thoại ngay!</div>
              ) : (
                <>
                  <div className="flex justify-center my-4">
                    <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      LỊCH SỬ TRÒ CHUYỆN
                    </span>
                  </div>
                  {messages.map((msg) => {
                    const isMe = msg.isMyMessage;
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isMe && (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs shrink-0 mt-auto">
                            {msg.tenNguoiGui?.charAt(0) ?? 'K'}
                          </div>
                        )}
                        <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`px-5 py-3.5 text-sm ${isMe
                            ? 'bg-[#1e3a8a] text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                            : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                            }`}>
                            {msg.noiDung}
                          </div>
                          <div className={`flex items-center gap-1.5 mt-1.5 text-[10px] font-medium text-gray-400 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span>{fmtTime(msg.thoiGianGui)}</span>
                            {isMe && <span>• Đã gửi</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-50 rounded-full px-5 py-3 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn hỗ trợ..."
                    className="w-full bg-transparent border-none outline-none text-sm text-gray-800"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  className="w-11 h-11 bg-[#0a358c] hover:bg-blue-900 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 shrink-0"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-0.5"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* CỘT 3: THÔNG TIN CỨU HỘ */}
          <div className="w-[300px] bg-[#f9fafb] shrink-0 h-full overflow-y-auto p-6 hidden lg:block">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Thông tin cứu hộ</p>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Trạng thái</span>
                <span className={`${yc?.trangThaiHienTai === 'HoanThanh' ? 'bg-gray-100 text-gray-600' : 'bg-[#ffc107] text-[#856404]'} text-[10px] font-bold px-3 py-1 rounded-full uppercase`}>
                  {yc?.trangThaiHienTai === 'DangXuLy' ? 'Đang xử lý' : yc?.trangThaiHienTai === 'HoanThanh' ? 'Hoàn thành' : 'Chờ xử lý'}
                </span>
              </div>
              <div className="h-px bg-gray-100 w-full mb-4" />
              <div className="flex items-start gap-3 mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" className="w-5 h-5 shrink-0 mt-0.5"><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H8.5a1 1 0 00-.8.4L5 11l-5.16.86a1 1 0 00-.84.99V16h3m14 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM9 16a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Phương tiện</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{yc?.hangXe} {yc?.dongXe}</p>
                  <p className="text-xs text-gray-500">{yc?.bienSo}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" className="w-5 h-5 shrink-0 mt-0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Điểm đến yêu cầu</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{yc?.noiSuCo}</p>
                  <p className="text-xs text-gray-500">{yc?.tenPhuongXa}, {yc?.tenTinh}</p>
                </div>
              </div>
            </div>

            <button onClick={() => navigate(`/partner/yeucau/${requestId}`)} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#1e3a8a] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span className="text-xs uppercase tracking-wider">Xem chi tiết đơn</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}