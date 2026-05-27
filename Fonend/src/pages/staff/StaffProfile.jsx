import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { User, Phone, MapPin, Star, ShieldCheck, Mail, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Nguyễn Văn A',
    email: 'staff.a@rescuecar.com',
    phone: '0901234567',
    address: '123 Đường Số 1, Quận 1, TP.HCM',
  });

  const [isEditing, setIsEditing] = useState(false);

  const specializations = [
    'Kéo xe cứu hộ',
    'Kích bình ắc quy',
    'Vá lốp lưu động',
  ];

  const handleSave = () => {
    toast.success('Đã cập nhật hồ sơ cá nhân');
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Hồ sơ nhân viên"
        description="Quản lý thông tin cá nhân và xem đánh giá hoạt động của bạn."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <Card padding={true} className="text-center">
            <div className="relative inline-block mb-4 group">
              <div className="w-32 h-32 mx-auto rounded-full bg-[#EFF6FF] border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                <span className="text-4xl font-bold text-[#1D4ED8]">{profile.name.charAt(0)}</span>
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#1D4ED8] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#1E40AF] transition-colors border-2 border-white cursor-pointer">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-1">{profile.name}</h2>
            <p className="text-[#64748B] text-sm mb-4">Nhân viên cứu hộ</p>

            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="success" className="flex items-center gap-1 py-1 px-3">
                <ShieldCheck className="w-3 h-3" /> Đã xác thực
              </Badge>
              <Badge variant="warning" className="flex items-center gap-1 py-1 px-3">
                <Star className="w-3 h-3" /> 4.8 / 5.0
              </Badge>
            </div>
            
            <div className="border-t border-[#E2E8F0] pt-4 text-left space-y-3">
              <h3 className="font-bold text-[#0F172A] text-sm mb-2 uppercase tracking-wider">Chuyên môn</h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec, idx) => (
                  <Badge key={idx} variant="outline" className="border-[#1D4ED8]/30 text-[#1D4ED8] bg-[#EFF6FF]">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <Card padding={true}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-bold text-[#0F172A]">Thông tin liên hệ</h3>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Lưu
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#64748B]" /> Họ và tên
                  </label>
                  <Input
                    value={profile.name}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#64748B]" /> Số điện thoại
                  </label>
                  <Input
                    value={profile.phone}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#64748B]" /> Email
                  </label>
                  <Input
                    value={profile.email}
                    disabled={true} // Email usually shouldn't be edited freely
                  />
                  <p className="text-xs text-[#94A3B8]">Vui lòng liên hệ Admin để thay đổi email.</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#64748B]" /> Địa chỉ hiện tại
                  </label>
                  <Input
                    value={profile.address}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
