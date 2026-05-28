import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { User, Phone, MapPin, Star, ShieldCheck, Mail, Camera, Edit2, Check, X, Info, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // States quản lý Inline Edit (Sửa thông tin)
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // States quản lý Đổi mật khẩu
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const idTaiKhoan = user?._id || user?.id;
        if (!idTaiKhoan) return;
        const nvRes = await axiosClient.get(`/NhanVien/by-taikhoan/${idTaiKhoan}`);
        const staffId = nvRes.data.idNhanVien;
        const profileRes = await axiosClient.get(`/NhanVien/${staffId}/profile`);
        setProfileData(profileRes.data);
      } catch (error) {
        toast.error('Lỗi khi tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Các hàm xử lý đổi thông tin (giữ nguyên)
  const startEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue || '');
  };
  const cancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };
  const handleSaveField = async () => {
    if (!tempValue.trim() && editingField !== 'moTa') {
      toast.error('Thông tin này không được để trống!');
      return;
    }
    setIsSaving(true);
    try {
      await axiosClient.put(`/NhanVien/${profileData.idNhanVien}/profile`, { [editingField]: tempValue });
      setProfileData(prev => ({ ...prev, [editingField]: tempValue }));
      toast.success('Đã cập nhật thành công!');
      setEditingField(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  // Hàm xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwdForm.oldPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
      toast.error('Vui lòng điền đủ các trường mật khẩu');
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setIsChangingPwd(true);
    try {
      // Giả định API C# cho việc đổi mật khẩu. Nếu team bạn chưa có API này, nhờ backend viết thêm nhé!
      await axiosClient.post(`/TaiKhoan/change-password`, {
        idTaiKhoan: user?._id || user?.id,
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword
      });
      toast.success('Đổi mật khẩu thành công!');
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại. Mật khẩu cũ có thể sai.');
    } finally {
      setIsChangingPwd(false);
    }
  };

  const renderField = (fieldKey, label, icon, isEditable = true, placeholder = 'Chưa cập nhật') => {
    const isEditing = editingField === fieldKey;
    const value = profileData[fieldKey];

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-100 group hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
        <div className="flex items-center gap-3 mb-2 sm:mb-0 w-1/3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">{icon}</div>
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </div>
        <div className="flex-1 flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full max-w-md animate-fade-in">
              <input
                type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} disabled={isSaving}
                className="flex-1 px-4 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white" autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveField(); if (e.key === 'Escape') cancelEdit(); }}
              />
              <button onClick={handleSaveField} disabled={isSaving} className="p-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors"><Check className="w-4 h-4" /></button>
              <button onClick={cancelEdit} disabled={isSaving} className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className={`text-sm ${value ? 'text-slate-700 font-medium' : 'text-slate-400 italic'}`}>{value || placeholder}</span>
              {isEditable && (
                <button onClick={() => startEdit(fieldKey, value)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100" title="Chỉnh sửa">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <Loading fullscreen={false} />;
  if (!profileData) return <div className="p-8 text-center text-gray-500">Không có dữ liệu.</div>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <PageHeader title="Hồ sơ nhân viên" description="Quản lý thông tin cá nhân. Nhấn vào biểu tượng cây bút để sửa từng mục." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding={true} className="text-center sticky top-24">
            <div className="relative inline-block mb-4 group">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {profileData.avatar ? <img src={profileData.avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-5xl font-black text-blue-600">{profileData.hoTen?.charAt(0)}</span>}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform hover:scale-105 border-2 border-white cursor-pointer z-10"><Camera className="w-4 h-4" /></button>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">{profileData.hoTen}</h2>
            <p className="text-slate-500 text-sm mb-4 font-medium">Mã NV: #{profileData.idNhanVien}</p>
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant={profileData.trangThaiNhanViec ? 'success' : 'default'} className="flex items-center gap-1 py-1.5 px-3">
                <ShieldCheck className="w-3.5 h-3.5" /> {profileData.trangThaiNhanViec ? 'Sẵn sàng' : 'Tạm nghỉ'}
              </Badge>
              <Badge variant="warning" className="flex items-center gap-1 py-1.5 px-3">
                <Star className="w-3.5 h-3.5 fill-yellow-500" /> {profileData.diemTb > 0 ? profileData.diemTb.toFixed(1) : 'Chưa có'}
              </Badge>
            </div>
            <div className="border-t border-slate-100 pt-5 text-left">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Khu vực phục vụ</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.khuVucPhucVu?.length > 0 ? profileData.khuVucPhucVu.map((kv, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">{kv.tenPhuongXa}</span>
                )) : <span className="text-xs text-slate-400 italic">Chưa đăng ký khu vực</span>}
              </div>
            </div>
          </Card>
        </div>

        {/* CỘT PHẢI */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding={true}>
            <div className="mb-2 pb-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Thông tin liên hệ & Giới thiệu</h3>
              <div className="bg-blue-50 text-blue-600 p-2 rounded-full hidden sm:block"><Info className="w-4 h-4" /></div>
            </div>
            <div className="space-y-1">
              {renderField('hoTen', 'Họ và tên', <User className="w-4 h-4" />)}
              {renderField('soDienThoai', 'Số điện thoại', <Phone className="w-4 h-4" />)}
              {renderField('email', 'Email (Cố định)', <Mail className="w-4 h-4" />, false, 'Không có Email')}
              {renderField('moTa', 'Kinh nghiệm / Mô tả', <Info className="w-4 h-4" />, true, 'Ví dụ: 5 năm kinh nghiệm...')}
            </div>
          </Card>

          {/* CARD ĐỔI MẬT KHẨU MỚI */}
          <Card padding={true}>
            <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Bảo mật tài khoản</h3>
              <div className="bg-orange-50 text-orange-600 p-2 rounded-full hidden sm:block"><Lock className="w-4 h-4" /></div>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={pwdForm.oldPassword} onChange={e => setPwdForm({...pwdForm, oldPassword: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10" placeholder="Nhập mật khẩu cũ..." />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPwd ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu mới</label>
                <input type={showPwd ? 'text' : 'password'} value={pwdForm.newPassword} onChange={e => setPwdForm({...pwdForm, newPassword: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Nhập mật khẩu mới..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Xác nhận mật khẩu mới</label>
                <input type={showPwd ? 'text' : 'password'} value={pwdForm.confirmPassword} onChange={e => setPwdForm({...pwdForm, confirmPassword: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Nhập lại mật khẩu mới..." />
              </div>
              <button type="submit" disabled={isChangingPwd} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2">
                {isChangingPwd ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;