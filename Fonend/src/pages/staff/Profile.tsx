// src/pages/staff/Profile.tsx  —  UC-27: Cập nhật thông tin cá nhân (Sử dụng Modal từng phần)
import { useState, useEffect } from 'react';
import { useStaffData } from '../../hooks/useStaffQueries';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { profileQuery, actions, staffInfo } = useStaffData();
  const profile = profileQuery.data;
  const { user } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form, setForm] = useState({ hoTen: '', soDienThoai: '', moTa: '', avatar: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile && isEditModalOpen) {
      setForm({
        hoTen: profile.hoTen ?? '',
        soDienThoai: profile.soDienThoai ?? '',
        moTa: profile.moTa ?? '',
        avatar: profile.avatar ?? '',
      });
      setErrors({});
    }
  }, [profile, isEditModalOpen]);

  // CẬP NHẬT TRẠNG THÁI HOẠT ĐỘNG (LƯU NGAY LẬP TỨC KHI GẠT)
  const handleToggleStatus = () => {
    if (!profile) return;
    const newStatus = !profile.trangThaiNhanViec;
    actions.updateProfile.mutate({ trangThaiNhanViec: newStatus });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.hoTen.trim()) errs.hoTen = 'Họ và tên không được để trống';
    if (!/^0\d{9}$/.test(form.soDienThoai)) errs.soDienThoai = 'Số điện thoại không hợp lệ (VD: 0901234567)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // CẬP NHẬT THÔNG TIN CÁ NHÂN TỪ MODAL
  const handleSaveInfo = () => {
    if (!validate()) return;
    actions.updateProfile.mutate(
      { hoTen: form.hoTen, soDienThoai: form.soDienThoai, moTa: form.moTa, avatar: form.avatar },
      { onSuccess: () => setIsEditModalOpen(false) }
    );
  };

  if (profileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOnline = profile?.trangThaiNhanViec ?? false;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        <p className="text-gray-500 text-sm mt-1">Quản lý thông tin cá nhân và thiết lập hoạt động</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ── CỘT TRÁI: Avatar & Toggle Hoạt Động ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="relative inline-block mb-3">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="avatar" className="w-28 h-28 rounded-full object-cover border-4 border-gray-50 mx-auto" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold mx-auto border-4 border-gray-50 shadow-sm">
                  {profile?.hoTen?.charAt(0) ?? 'N'}
                </div>
              )}
            </div>
            <h3 className="font-bold text-xl text-gray-800">{profile?.hoTen}</h3>
            <p className="text-xs font-semibold text-blue-600 tracking-wider mt-1 uppercase">Nhân viên cứu hộ</p>

            <div className="mt-6 space-y-3 text-left text-sm border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Mã nhân viên</span>
                <span className="font-bold text-gray-900 text-xs bg-gray-100 px-2 py-1 rounded">RES-{String(profile?.idNhanVien ?? 0).padStart(4, '0')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Điểm đánh giá</span>
                <span className="text-xs font-black text-yellow-500 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {(profile?.diemTb ?? 0).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Đã hoàn thành</span>
                <span className="text-xs font-bold text-gray-900">{profile?.thongKe?.tongDonHoanThanh ?? 0} chuyến</span>
              </div>
            </div>
          </div>

          {/* TOGGLE TRẠNG THÁI HOẠT ĐỘNG */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:border-blue-300 transition-colors">
            <div>
              <p className="text-sm font-bold text-gray-900">Nhận đơn mới</p>
              <p className={`text-xs mt-1 font-semibold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {isOnline ? 'Đang sẵn sàng hoạt động' : 'Đang tạm nghỉ'}
              </p>
            </div>
            <button
              onClick={handleToggleStatus}
              disabled={actions.updateProfile.isPending}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isOnline ? 'bg-blue-600' : 'bg-gray-300'} disabled:opacity-50`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${isOnline ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"><path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
              <p className="text-xs font-bold text-blue-800">Tài khoản xác thực</p>
              <p className="text-xs text-blue-600 mt-1 leading-relaxed">Hồ sơ đã được duyệt. Bạn được ưu tiên hiển thị trên bản đồ cứu hộ.</p>
            </div>
          </div>
        </div>

        {/* ── CỘT PHẢI: Box thông tin ── */}
        <div className="col-span-2 space-y-6">
          
          {/* BOX 1: THÔNG TIN CÁ NHÂN */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="font-bold text-gray-800">Thông tin cá nhân</h2>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Chỉnh sửa
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Họ và tên</p>
                <p className="text-sm font-medium text-gray-900">{profile?.hoTen}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Số điện thoại</p>
                <p className="text-sm font-medium text-gray-900">{profile?.soDienThoai}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Địa chỉ Email</p>
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Giới thiệu kinh nghiệm</p>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {profile?.moTa || <span className="text-gray-400 italic">Chưa có thông tin giới thiệu...</span>}
                </p>
              </div>
            </div>
          </div>

          {/* BOX 2: KHU VỰC VÀ DỊCH VỤ (READ-ONLY) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="font-bold text-gray-800">Khu vực & Dịch vụ phục vụ</h2>
              <a href="/partner/services" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                Cài đặt dịch vụ <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Khu vực đăng ký</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.khuVucPhucVu?.map(kv => (
                    <span key={kv.idPhuongXa} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-red-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {kv.tenPhuongXa}, {kv.tenTinh}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dịch vụ cung cấp</p>
                <div className="grid grid-cols-2 gap-3">
                  {profile?.dichVuCungCap?.map(dv => (
                    <div key={dv.idDichVu} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{dv.tenDichVu}</p>
                        <p className="text-xs text-green-600 font-bold">{dv.giaCoBan.toLocaleString('vi-VN')} đ</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* ── MODAL: CHỈNH SỬA THÔNG TIN CÁ NHÂN ── */}
      {/* ========================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <h3 className="text-lg font-bold text-gray-900">Sửa thông tin cá nhân</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-full p-1.5 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                <input name="hoTen" value={form.hoTen} onChange={handleFormChange} className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${errors.hoTen ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`} />
                {errors.hoTen && <p className="text-red-500 text-xs mt-1 font-medium">{errors.hoTen}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                <input name="soDienThoai" value={form.soDienThoai} onChange={handleFormChange} maxLength={10} className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${errors.soDienThoai ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`} />
                {errors.soDienThoai && <p className="text-red-500 text-xs mt-1 font-medium">{errors.soDienThoai}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Link Ảnh đại diện (URL)</label>
                <input name="avatar" value={form.avatar} onChange={handleFormChange} placeholder="https://..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Kinh nghiệm & Giới thiệu</label>
                <textarea name="moTa" value={form.moTa} onChange={handleFormChange} rows={3} placeholder="Viết vài dòng giới thiệu về chuyên môn..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors">
                Hủy bỏ
              </button>
              <button onClick={handleSaveInfo} disabled={actions.updateProfile.isPending} className="px-6 py-2.5 bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50">
                {actions.updateProfile.isPending ? 'Đang lưu...' : 'Lưu cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}