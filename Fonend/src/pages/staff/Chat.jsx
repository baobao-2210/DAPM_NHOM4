import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTinNhan, useStaffData, useYeuCauDetail, useLichCuuHo } from '../../hooks/useStaffQueries';
import { staffApi } from '../../api/staffApi';
import toast from 'react-hot-toast';

const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const requestId = id ? Number(id) : 0; 

  const { staffInfo } = useStaffData();
  const idTaiKhoan = staffInfo?.idTaiKhoan ?? 0;
  const staffId = staffInfo?.idNhanVien ?? 0;

  const { data: yc } = useYeuCauDetail(requestId, staffId);
  const { data: messages = [], refetch } = useTinNhan(requestId, idTaiKhoan);

  const now = new Date();
  const { data: historyData } = useLichCuuHo(staffId, now.getMonth() + 1, now.getFullYear());
  const conversations = historyData?.lichCuuHo ?? [];

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const bottomRef = useRef(null);

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
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Gửi tin nhắn thất bại');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const filteredConversations = conversations.filter(c =>
    c.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toString().includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 overflow-hidden">
      <div className="w-[320px] flex flex-col border-r border-gray-100 bg-white shrink-0 h-full">
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tin nhắn cứu hộ</h2>
          <div className="relative">
            <input type="text" placeholder="Tìm kiếm hội thoại..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-100 text-sm border-none rounded-full pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                <div key={chat.id} onClick={() => navigate(`/partner/chat/${chat.id}`)} className={`relative flex gap-4 p-4 cursor-pointer transition-colors ${isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                  {isSelected && <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-700 rounded-r-md" />}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-lg">{chat.tenKhachHang.charAt(0)}</div>
                    {chat.trangThaiHienTai !== 'HoanThanh' && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{chat.tenKhachHang}</p>
                    </div>
                    <p className="text-sm text-blue-700 font-semibold truncate mb-1.5">{chat.tenDichVu}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {requestId === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 min-w-0">
          <h3 className="text-xl font-bold text-gray-800">Tin nhắn & Hỗ trợ</h3>
          <p className="text-gray-500 mt-2 text-sm max-w-sm text-center">Chọn một đoạn hội thoại để xem chi tiết.</p>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col bg-white min-w-0 border-r border-gray-100">
            <div className="h-20 border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-lg">{yc?.tenKhachHang?.charAt(0) ?? 'K'}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{yc?.tenKhachHang ?? 'Khách hàng'}</h3>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcfcfd]">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">Chưa có tin nhắn nào. Bắt đầu hội thoại ngay!</div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.isMyMessage;
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isMe && <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs shrink-0 mt-auto">{msg.tenNguoiGui?.charAt(0) ?? 'K'}</div>}
                      <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`px-5 py-3.5 text-sm ${isMe ? 'bg-[#1e3a8a] text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm' : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-t-2xl rounded-br-2xl rounded-bl-sm'}`}>
                          {msg.noiDung}
                        </div>
                        <div className={`flex items-center gap-1.5 mt-1.5 text-[10px] font-medium text-gray-400 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span>{fmtTime(msg.thoiGianGui)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-50 rounded-full px-5 py-3 border border-gray-200">
                  <input type="text" value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Nhập tin nhắn hỗ trợ..." className="w-full bg-transparent border-none outline-none text-sm text-gray-800" />
                </div>
                <button onClick={handleSend} disabled={!text.trim() || sending} className="w-11 h-11 bg-[#0a358c] hover:bg-blue-900 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 shrink-0">Gửi</button>
              </div>
            </div>
          </div>

          <div className="w-[300px] bg-[#f9fafb] shrink-0 h-full overflow-y-auto p-6 hidden lg:block">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Thông tin cứu hộ</p>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Trạng thái</span>
                <span className={`${yc?.trangThaiHienTai === 'HoanThanh' ? 'bg-gray-100 text-gray-600' : 'bg-[#ffc107] text-[#856404]'} text-[10px] font-bold px-3 py-1 rounded-full uppercase`}>
                  {yc?.trangThaiHienTai === 'DangXuLy' ? 'Đang xử lý' : yc?.trangThaiHienTai === 'HoanThanh' ? 'Hoàn thành' : 'Chờ xử lý'}
                </span>
              </div>
            </div>
            <button onClick={() => navigate(`/partner/yeucau/${requestId}`)} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#1e3a8a] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
              <span className="text-xs uppercase tracking-wider">Xem chi tiết đơn</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}