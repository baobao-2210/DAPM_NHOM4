// src/pages/staff/Profile.tsx  —  UC-27: Cập nhật thông tin cá nhân
// Theo demo image16: sidebar trái (avatar, ID, trạng thái) + form bên phải
import { useState, useEffect } from 'react';
import { useStaffData } from '../../hooks/useStaffQueries';

export default function Profile() {
  const { profileQuery, actions, staffInfo } = useStaffData();
  const profile = profileQuery.data;

  const [form, setForm] = useState({
    hoTen: '', soDienThoai: '', moTa: '',
    trangThaiNhanViec: true, avatar: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        hoTen: profile.hoTen ?? '',
        soDienThoai: profile.soDienThoai ?? '',
        moTa: profile.moTa ?? '',
        trangThaiNhanViec: profile.trangThaiNhanViec ?? true,
        avatar: profile.avatar ?? '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setIsDirty(true);
    setSaved(false);
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.hoTen.trim()) errs.hoTen = 'Họ và tên không được để trống';
    if (!/^0\d{9}$/.test(form.soDienThoai))
      errs.soDienThoai = 'Số điện thoại không hợp lệ (VD: 0901234567)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload: Record<string, any> = {};
    if (form.hoTen !== profile?.hoTen) payload.hoTen = form.hoTen;
    if (form.soDienThoai !== profile?.soDienThoai) payload.soDienThoai = form.soDienThoai;
    if (form.moTa !== profile?.moTa) payload.moTa = form.moTa;
    if (form.trangThaiNhanViec !== profile?.trangThaiNhanViec) payload.trangThaiNhanViec = form.trangThaiNhanViec;
    if (form.avatar !== profile?.avatar) payload.avatar = form.avatar;

    if (Object.keys(payload).length === 0) return;
    actions.updateProfile.mutate(payload, {
      onSuccess: () => { setIsDirty(false); setSaved(true); },
    });
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        hoTen: profile.hoTen ?? '',
        soDienThoai: profile.soDienThoai ?? '',
        moTa: profile.moTa ?? '',
        trangThaiNhanViec: profile.trangThaiNhanViec ?? true,
        avatar: profile.avatar ?? '',
      });
    }
    setIsDirty(false);
    setErrors({});
  };

  if (profileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cập nhật hồ sơ</h1>
        <p className="text-gray-500 text-sm mt-1">
          Quản lý thông tin cá nhân và thiết lập tài khoản của bạn
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* ── Left sidebar ── */}
        <div className="space-y-4">
          {/* Avatar card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="relative inline-block mb-3">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 mx-auto"
                  onError={e => { (e.target as HTMLImageElement).src = ''; }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold mx-auto">
                  {profile?.hoTen?.charAt(0) ?? 'N'}
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-7 h-7 bg-[#1e3a8a] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-3.5 h-3.5">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </label>
            </div>
            <h3 className="font-bold text-gray-800">{profile?.hoTen}</h3>
            <p className="text-xs text-gray-400 mt-0.5">NHÂN VIÊN CỨU HỘ</p>

            <div className="mt-4 space-y-2 text-left text-sm border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">ID Nhân viên</span>
                <span className="font-semibold text-gray-700 text-xs">
                  RES-{String(profile?.idNhanVien ?? 0).padStart(4, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Trạng thái</span>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${form.trangThaiNhanViec ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className={`text-xs font-semibold ${form.trangThaiNhanViec ? 'text-green-600' : 'text-gray-500'}`}>
                    {form.trangThaiNhanViec ? 'Đang hoạt động' : 'Tạm nghỉ'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Điểm TB</span>
                <span className="text-xs font-bold text-yellow-600">
                  ★ {(profile?.diemTb ?? 0).toFixed(1)}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Đã hoàn thành</span>
                <span className="text-xs font-semibold text-gray-700">
                  {profile?.thongKe?.tongDonHoanThanh ?? 0} đơn
                </span>
              </div>
            </div>
          </div>

          {/* Verified badge */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-blue-700">Trạng thái xác thực</p>
                <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
                  Tài khoản đã được xác thực. Các dịch vụ cứu hộ sẽ được ưu tiên xử lý nhanh hơn.
                </p>
              </div>
            </div>
          </div>

          {/* Khu vực */}
          {profile?.khuVucPhucVu && profile.khuVucPhucVu.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Khu vực phục vụ</p>
              <div className="space-y-2">
                {profile.khuVucPhucVu.map(kv => (
                  <div key={kv.idPhuongXa} className="flex items-center gap-2 text-xs text-gray-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-blue-500 shrink-0">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {kv.tenPhuongXa}, {kv.tenTinh}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Form ── */}
        <div className="col-span-2 space-y-5">
          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-800 mb-1">Thông tin liên lạc</h2>
            <p className="text-gray-400 text-xs mb-5">
              Cung cấp thông tin chính xác để khách hàng và hệ thống liên hệ.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Họ tên */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Họ và tên
                </label>
                <input
                  name="hoTen"
                  value={form.hoTen}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.hoTen ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                {errors.hoTen && <p className="text-red-500 text-xs mt-1">{errors.hoTen}</p>}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Số điện thoại
                </label>
                <input
                  name="soDienThoai"
                  value={form.soDienThoai}
                  onChange={handleChange}
                  maxLength={10}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.soDienThoai ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                {errors.soDienThoai && <p className="text-red-500 text-xs mt-1">{errors.soDienThoai}</p>}
              </div>

              {/* Email (readonly) */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Địa chỉ Email
                </label>
                <input
                  value={profile?.email ?? ''}
                  disabled
                  className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi. Liên hệ quản trị viên nếu cần.</p>
              </div>

              {/* URL Avatar */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  URL Ảnh đại diện
                </label>
                <input
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Giới thiệu */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Giới thiệu bản thân
                </label>
                <textarea
                  name="moTa"
                  value={form.moTa}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Mô tả kinh nghiệm và chuyên môn của bạn..."
                  className="w-full border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Toggle nhận việc */}
            <div className="mt-4 flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm font-semibold text-gray-700">Nhận đơn mới</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {form.trangThaiNhanViec
                    ? 'Bạn đang hiển thị trong danh sách nhân viên sẵn sàng'
                    : 'Bạn đang tắt nhận đơn mới. Đơn chờ sẽ không hiển thị'}
                </p>
              </div>
              <button
                onClick={() => { setForm(f => ({ ...f, trangThaiNhanViec: !f.trangThaiNhanViec })); setIsDirty(true); setSaved(false); }}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                  form.trangThaiNhanViec ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                  form.trangThaiNhanViec ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
              {saved && (
                <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                    <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Đã lưu thành công
                </span>
              )}
              <button
                onClick={handleCancel}
                disabled={!isDirty}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                disabled={!isDirty || actions.updateProfile.isPending}
                className="px-5 py-2 bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40"
              >
                {actions.updateProfile.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>

          {/* Dịch vụ đang cung cấp (read-only, link sang trang Services) */}
          {profile?.dichVuCungCap && profile.dichVuCungCap.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-800">Dịch vụ đang cung cấp</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Quản lý trong tab "Dịch vụ của tôi"</p>
                </div>
                <a
                  href="/partner/services"
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Cập nhật →
                </a>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {profile.dichVuCungCap.map(dv => (
                  <div key={dv.idDichVu} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" className="w-4 h-4">
                        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">{dv.tenDichVu}</p>
                      <p className="text-xs text-green-600 font-medium">{dv.giaCoBan.toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}