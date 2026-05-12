import React, { useState } from 'react'; // Phải có useState ở đây

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('info');

  const vehicles = [
    { id: 1, name: 'Toyota Camry', plate: '51A-888.88', color: 'bg-black', icon: 'directions_car' },
    { id: 2, name: 'Honda SH 150i', plate: '59G2-123.45', color: 'bg-white border border-slate-200', icon: 'moped' },
  ];

  return (
    <div className="bg-[#f8f9fb] font-['Inter'] text-[#191c1e] min-h-screen">
      {/* pt-24 để tránh bị Navbar che khuất */}
      <main className="md:pl-64 pt-24 pb-12 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}s
          <header className="mb-10">
            <h1 className="text-4xl font-['Manrope'] font-black text-[#003fb1] mb-2 tracking-tight">Hồ sơ cá nhân</h1>
            <p className="text-[#434654] font-medium">Quản lý thông tin tài khoản và phương tiện để nhận dịch vụ tốt nhất.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cột trái: Tab Menu & Avatar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#edeef0]">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-4 group cursor-pointer">
                    <div className="w-28 h-28 rounded-full border-4 border-[#dbe1ff] overflow-hidden shadow-inner">
                      <img 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        src="https://i.pravatar.cc/150?u=leminhtuan" 
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[#003fb1] text-white p-2.5 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                    </div>
                  </div>
                  <h3 className="font-['Manrope'] font-black text-xl text-[#191c1e]">Lê Minh Tuấn</h3>
                  <p className="text-[#737686] text-xs font-bold uppercase tracking-widest mt-1">Thành viên từ 2023</p>
                </div>

                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'info' ? 'bg-[#003fb1] text-white shadow-lg shadow-[#003fb1]/20' : 'text-[#434654] hover:bg-[#f3f4f6]'}`}
                  >
                    <span className="material-symbols-outlined">contact_mail</span>
                    Thông tin liên lạc
                  </button>
                  <button 
                    onClick={() => setActiveTab('vehicle')}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'vehicle' ? 'bg-[#003fb1] text-white shadow-lg shadow-[#003fb1]/20' : 'text-[#434654] hover:bg-[#f3f4f6]'}`}
                  >
                    <span className="material-symbols-outlined">directions_car</span>
                    Quản lý phương tiện
                  </button>
                  <button 
                    onClick={() => setActiveTab('password')}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'password' ? 'bg-[#003fb1] text-white shadow-lg shadow-[#003fb1]/20' : 'text-[#434654] hover:bg-[#f3f4f6]'}`}
                  >
                    <span className="material-symbols-outlined">lock_reset</span>
                    Đổi mật khẩu
                  </button>
                </nav>
              </div>

              <div className="bg-[#ffe083]/20 p-6 rounded-[2rem] border-l-8 border-[#fed01b]">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#735c00]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <div>
                    <h4 className="font-black text-[#735c00] text-sm uppercase">Tài khoản xác thực</h4>
                    <p className="text-[11px] text-[#574500] mt-1 leading-relaxed font-medium">Tài khoản chính chủ. Yêu cầu cứu hộ sẽ được ưu tiên xử lý nhanh hơn.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Form hiển thị theo Tab */}
            <div className="lg:col-span-8 space-y-8">
              {/* Tab: Thông tin liên lạc */}
              {activeTab === 'info' && (
                <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#edeef0]">
                  <div className="mb-8">
                    <h2 className="text-2xl font-['Manrope'] font-black text-[#191c1e]">Thông tin liên lạc</h2>
                    <p className="text-sm text-[#737686] font-medium">Thông tin dùng để liên hệ khi bạn gặp sự cố.</p>
                  </div>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#737686] uppercase tracking-widest ml-1">Họ và tên</label>
                        <input className="w-full bg-[#f3f4f6] border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#003fb1]/20 outline-none font-bold" defaultValue="Lê Minh Tuấn" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#737686] uppercase tracking-widest ml-1">Số điện thoại</label>
                        <input className="w-full bg-[#f3f4f6] border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#003fb1]/20 outline-none font-bold" defaultValue="0901 234 567" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#737686] uppercase tracking-widest ml-1">Địa chỉ Email</label>
                      <input className="w-full bg-[#f3f4f6] border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#003fb1]/20 outline-none font-bold" defaultValue="minhtuan.le@email.com" />
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button className="bg-[#003fb1] text-white px-10 py-4 rounded-full font-black text-sm shadow-xl hover:bg-[#1a56db] transition-all active:scale-95" type="button">Lưu thay đổi</button>
                    </div>
                  </form>
                </section>
              )}

              {/* Tab: Quản lý phương tiện */}
              {activeTab === 'vehicle' && (
                <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#edeef0]">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-['Manrope'] font-black text-[#191c1e]">Quản lý phương tiện</h2>
                      <p className="text-sm text-[#737686] font-medium">Danh sách xe được hỗ trợ cứu hộ.</p>
                    </div>
                    <button className="flex items-center gap-2 text-[#003fb1] font-black text-sm bg-[#dbe1ff] px-6 py-3 rounded-2xl hover:bg-[#003fb1] hover:text-white transition-all">
                      <span className="material-symbols-outlined">add_circle</span>
                      Thêm xe
                    </button>
                  </div>
                  <div className="space-y-4">
                    {vehicles.map((car) => (
                      <div key={car.id} className="bg-[#f3f4f6] p-6 rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-[#edeef0]">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#003fb1] shadow-sm">
                            <span className="material-symbols-outlined text-4xl">{car.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-black text-[#191c1e] text-lg">{car.name}</h4>
                            <div className="flex items-center gap-3 text-sm mt-1">
                              <span className="bg-[#dbe1ff] text-[#003fb1] px-3 py-1 rounded-lg font-mono font-bold text-xs">{car.plate}</span>
                              <span className="flex items-center gap-2 text-[#737686] font-bold text-xs">
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
                <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#edeef0]">
                  <h2 className="text-2xl font-['Manrope'] font-black mb-8">Đổi mật khẩu</h2>
                  <form className="space-y-6">
                    <input className="w-full bg-[#f3f4f6] border-0 rounded-2xl px-5 py-4 outline-none" type="password" placeholder="Mật khẩu cũ" />
                    <input className="w-full bg-[#f3f4f6] border-0 rounded-2xl px-5 py-4 outline-none" type="password" placeholder="Mật khẩu mới" />
                    <button className="bg-[#003fb1] text-white px-10 py-4 rounded-full font-black text-sm" type="button">Cập nhật</button>
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