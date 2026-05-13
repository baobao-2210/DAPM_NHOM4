import { Send, User, MessageCircle, Clock, MapPin } from 'lucide-react';

export default function StaffChat() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Nhân Viên</span><span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Liên Lạc</span>
          </div>
          <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Trò Chuyện Trực Tiếp</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 flex-1 min-h-0">
        {/* Sidebar / Contacts List */}
        <div className="card flex flex-col min-h-0 overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-body)]/50 shrink-0">
            <h2 className="font-black text-[var(--text-main)] flex items-center gap-2">
              <MessageCircle size={18} className="text-[var(--primary)]" />
              Đang hỗ trợ
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="p-4 rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/30 cursor-pointer transition-all hover:bg-[var(--primary)]/10">
              <div className="flex justify-between items-start mb-2">
                <div className="font-black text-[var(--primary)] text-sm">Khách hàng cứu hộ</div>
                <span className="text-[10px] font-bold text-[var(--text-muted)] flex items-center gap-1">
                  <Clock size={10} /> Vừa xong
                </span>
              </div>
              <div className="text-xs text-[var(--text-main)] font-medium truncate">Đang xử lý sự cố...</div>
            </div>
            {/* Can add more history chats here if needed */}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="card flex flex-col min-h-0 overflow-hidden relative">
          {/* Chat Header */}
          <div className="p-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-body)]/50 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white shadow-md font-bold">
                KH
              </div>
              <div>
                <div className="font-black text-[var(--text-main)] text-lg">Khách hàng cứu hộ</div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-bold mt-0.5">
                  <MapPin size={12} className="text-[var(--primary)]" /> Đường Lê Lợi, Quận 1
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Trực tuyến</span>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto bg-[var(--bg-body)]/30 flex flex-col gap-6">
            {/* Customer Message */}
            <div className="flex items-end gap-3 self-start max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                KH
              </div>
              <div className="bg-white border border-[var(--border)] p-4 rounded-2xl rounded-bl-none shadow-sm text-sm text-[var(--text-main)] font-medium leading-relaxed">
                Chào anh, tôi bị hỏng lốp xe ở đường Lê Lợi. Anh có thể tới nhanh được không?
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold mb-1 shrink-0">14:30</span>
            </div>
            
            {/* Staff Message */}
            <div className="flex items-end gap-3 self-end max-w-[80%] flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <User size={14} />
              </div>
              <div className="bg-[var(--primary)] text-white p-4 rounded-2xl rounded-br-none shadow-md text-sm font-medium leading-relaxed">
                Chào anh, tôi đã nhận yêu cầu. Hiện tôi đang di chuyển tới hiện trường, khoảng 10 phút nữa tôi tới nhé. Anh vui lòng bật đèn cảnh báo nguy hiểm.
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold mb-1 shrink-0">14:32</span>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[var(--border)] shrink-0">
            <div className="flex items-center gap-3 bg-[var(--bg-body)] p-2 rounded-full border border-[var(--border)] focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary)]/5 transition-all">
              <input 
                className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-medium" 
                placeholder="Nhập tin nhắn hỗ trợ..." 
              />
              <button className="w-10 h-10 rounded-full bg-[var(--primary)] hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-md shrink-0">
                <Send size={16} className="-ml-0.5 mt-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}