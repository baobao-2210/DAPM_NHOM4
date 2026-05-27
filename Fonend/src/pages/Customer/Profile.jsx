import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Save, Edit3 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axiosClient.get('/customer/profile')
      .then(res => {
        const data = res.data?.data || res.data;
        setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '' });
      })
      .catch(() => {
        setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', address: '' });
      });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error('Vui lòng điền tên và email'); return; }
    setLoading(true);
    try {
      const res = await axiosClient.put('/customer/profile', form);
      updateUser(res.data?.data || form);
      toast.success('Cập nhật hồ sơ thành công!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Quản lý thông tin tài khoản của bạn"
        actions={
          !editing && (
            <Button variant="outline" size="md" icon={Edit3} onClick={() => setEditing(true)}>
              Chỉnh sửa
            </Button>
          )
        }
      />

      {/* Avatar Section */}
      <Card className="mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#EFF6FF] flex items-center justify-center border-2 border-[#1D4ED8]/20 flex-shrink-0">
            <span className="text-[#1D4ED8] text-3xl font-bold">{form.name?.[0]?.toUpperCase() || 'C'}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-1">{form.name || 'Khách hàng'}</h2>
            <p className="text-sm text-[#64748B] font-medium">{form.email}</p>
            <Badge variant="success" size="sm" className="mt-2">Khách hàng</Badge>
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Họ tên"
              required
              icon={User}
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="Nguyễn Văn A"
              disabled={!editing}
            />
            <Input
              label="Email"
              required
              icon={Mail}
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="email@example.com"
              disabled={!editing}
            />
            <Input
              label="Điện thoại"
              icon={Phone}
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="0901234567"
              disabled={!editing}
            />
            <Input
              label="Địa chỉ"
              icon={MapPin}
              type="text"
              value={form.address}
              onChange={set('address')}
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
              disabled={!editing}
            />
          </div>

          {editing && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E2E8F0]">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={Save}
                loading={loading}
              >
                Lưu thay đổi
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setEditing(false)}
              >
                Hủy
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default Profile;
