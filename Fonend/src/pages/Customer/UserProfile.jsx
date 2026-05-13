import React, { useState } from 'react';
import { Camera, User, Car, Lock, ShieldCheck, PlusCircle, Bike } from 'lucide-react';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('info');

  const vehicles = [
    { id: 1, name: 'Toyota Camry', plate: '51A-888.88', color: 'bg-black', type: 'car' },
    { id: 2, name: 'Honda SH 150i', plate: '59G2-123.45', color: 'bg-white border border-[var(--border)]', type: 'bike' },
  ];

  return (
    <div className="bg-[var(--bg-body)] font-sans text-[var(--text-main)] min-h-screen">
      <main className="md:pl-64 pt-24 pb-12 px-6 lg:px-12 animate-fade-in">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <header className="mb-10">
            <h1 className="text-4xl font-black text-[var(--text-main)] mb-2 tracking-tight">Hồ sơ cá nhân</h1>
            <p className="text-[var(--text-sub)] font-medium">Quản lý thông tin tài khoản và phương tiện để nhận dịch vụ tốt nhất.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cột trái: Tab Menu & Avatar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="card p-8">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-4 group cursor-pointer">
                    <div className="w-28 h-28 rounded-full border-4 border-[var(--primary)]/20 overflow-hidden shadow-inner bg-white">
                      <img 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        src="https://i.pravatar.cc/150?u=leminhtuan" 
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[var(--primary)] text-white p-2.5 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <Camera size={16} />
                    </div>
                  </div>
                  <h3 className="font-black text-xl text-[var(--text-main)]">Lê Minh Tuấn</h3>
                  <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mt-1">Thành viên từ 2023</p>
                </div>

                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'info' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : 'text-[var(--text-sub)] hover:bg-[var(--primary)]/5'}`}
                  >
                    <User size={20} />
                    Thông tin liên lạc
                  </button>
                  <button 
                    onClick={() => setActiveTab('vehicle')}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'vehicle' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : 'text-[var(--text-sub)] hover:bg-[var(--primary)]/5'}`}
                  >
                    <Car size={20} />
                    Quản lý phương tiện
                  </button>
                  <button 
                    onClick={() => setActiveTab('password')}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'password' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : 'text-[var(--text-sub)] hover:bg-[var(--primary)]/5'}`}
                  >
                    <Lock size={20} />
                    Đổi mật khẩu
                  </button>
                </nav>
              </div>

              <div className="bg-amber-50 p-6 rounded-[2rem] border-l-8 border-[var(--accent)]">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-amber-600 shrink-0" size={24} />
                  <div>
                    <h4 className="font-black text-amber-700 text-sm uppercase tracking-wider">Tài khoản xác thực</h4>
                    <p className="text-xs text-amber-900/80 mt-1.5 leading-relaxed font-semibold">Tài khoản chính chủ. Yêu cầu cứu hộ sẽ được ưu tiên xử lý nhanh hơn.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Form hiển thị theo Tab */}
            <div className="lg:col-span-8 space-y-8">
              {/* Tab: Thông tin liên lạc */}
              {activeTab === 'info' && (
                <section className="card p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-[var(--text-main)]">Thông tin liên lạc</h2>
                    <p className="text-sm text-[var(--text-sub)] font-medium">Thông tin dùng để liên hệ khi bạn gặp sự cố.</p>
                  </div>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Họ và tên</label>
                        <input className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none font-bold transition-all text-[var(--text-main)]" defaultValue="Lê Minh Tuấn" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Số điện thoại</label>
                        <input className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none font-bold transition-all text-[var(--text-main)]" defaultValue="0901 234 567" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Địa chỉ Email</label>
                      <input className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none font-bold transition-all text-[var(--text-main)]" defaultValue="minhtuan.le@email.com" />
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button className="btn btn-primary px-10 py-4 rounded-full text-sm shadow-xl" type="button">Lưu thay đổi</button>
                    </div>
                  </form>
                </section>
              )}

              {/* Tab: Quản lý phương tiện */}
              {activeTab === 'vehicle' && (
                <section className="card p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-[var(--text-main)]">Quản lý phương tiện</h2>
                      <p className="text-sm text-[var(--text-sub)] font-medium">Danh sách xe được hỗ trợ cứu hộ.</p>
                    </div>
                    <button className="flex items-center gap-2 text-[var(--primary)] font-black text-sm bg-[var(--primary)]/10 px-6 py-3 rounded-2xl hover:bg-[var(--primary)] hover:text-white transition-all">
                      <PlusCircle size={18} />
                      Thêm xe
                    </button>
                  </div>
                  <div className="space-y-4">
                    {vehicles.map((car) => (
                      <div key={car.id} className="bg-[var(--bg-body)] p-6 rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all border border-[var(--border)] hover:border-[var(--primary)]/30">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[var(--primary)] shadow-sm">
                            {car.type === 'car' ? <Car size={32} /> : <Bike size={32} />}
                          </div>
                          <div>
                            <h4 className="font-black text-[var(--text-main)] text-lg">{car.name}</h4>
                            <div className="flex items-center gap-3 text-sm mt-1">
                              <span className="bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-lg font-mono font-bold text-xs">{car.plate}</span>
                              <span className="flex items-center gap-2 text-[var(--text-muted)] font-bold text-xs">
                                <div className={`w-3 h-3 rounded-full ${car.color}`}></div> Màu sắc
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tab: Đổi mật khẩu */}
              {activeTab === 'password' && (
                <section className="card p-10">
                  <h2 className="text-2xl font-black mb-8 text-[var(--text-main)]">Đổi mật khẩu</h2>
                  <form className="space-y-6">
                    <input className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all font-semibold" type="password" placeholder="Mật khẩu cũ" />
                    <input className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all font-semibold" type="password" placeholder="Mật khẩu mới" />
                    <button className="btn btn-primary px-10 py-4 rounded-full text-sm" type="button">Cập nhật</button>
                  </form>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;