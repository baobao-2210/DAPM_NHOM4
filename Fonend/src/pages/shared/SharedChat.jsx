import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Send, ArrowLeft, Phone, Info } from 'lucide-react';
import Card from '../../components/ui/Card';
import { staffApi } from '../../api/staffApi';

const SharedChat = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const isCustomer = user?.role === 'customer';
  const otherPartyName = isCustomer ? 'Nhân viên cứu hộ' : 'Khách hàng';
  const idTaiKhoan = user?._id || 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!requestId || !idTaiKhoan) return;
      try {
        const res = await staffApi.getMessages(requestId, idTaiKhoan);
        setMessages(res.data || []);
      } catch (err) {
        console.error('Lỗi tải tin nhắn:', err);
      }
    };
    
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [requestId, idTaiKhoan]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !idTaiKhoan) return;

    const textToSend = inputText.trim();
    setInputText('');

    try {
      const res = await staffApi.sendMessage(requestId, idTaiKhoan, textToSend);
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Lỗi gửi tin nhắn:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <Card padding={false} className="flex flex-col h-full overflow-hidden shadow-lg border-[#E2E8F0]">
        
        {/* Chat Header */}
        <div className="bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link 
              to={isCustomer ? `/customer/rescue-requests/${requestId}` : `/staff/requests/${requestId}`} 
              className="p-2 hover:bg-[#F8FAFC] rounded-full transition-colors text-[#64748B]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-bold">
                {otherPartyName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] leading-tight">{otherPartyName}</h3>
                <p className="text-xs text-[#22C55E] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span> Trực tuyến
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-[#1D4ED8] hover:bg-[#EFF6FF] rounded-full transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-full transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#EFF6FF] p-2 text-center text-xs font-semibold text-[#1D4ED8] shrink-0 border-b border-[#BFDBFE]">
          Mã đơn cứu hộ: {requestId}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC]">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-sm text-[#94A3B8] my-8">
                Chưa có tin nhắn nào. Bắt đầu hội thoại ngay!
              </div>
            )}
            {messages.map((msg) => {
              const isMine = msg.isMyMessage;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isMine 
                          ? 'bg-[#1D4ED8] text-white rounded-tr-sm' 
                          : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {msg.noiDung}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[10px] text-[#94A3B8]">
                        {new Date(msg.thoiGianGui).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-[#E2E8F0] p-4 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center hover:bg-[#1E40AF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-md shadow-[#1D4ED8]/20"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default SharedChat;
