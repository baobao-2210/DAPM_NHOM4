import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import SearchBox from '../../components/ui/SearchBox';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { UserCog, Plus, Edit3, Trash2 } from 'lucide-react';

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', specialization: '' });
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    axiosClient.get('/admin/staff')
      .then(res => setStaff(res.data?.data || res.data || []))
      .catch(() => setStaff([]))
      .finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const filtered = staff.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm({ name: '', email: '', phone: '', password: '', specialization: '' }); setSelected(null); setModal('create'); };
  const openEdit = (s) => { setSelected(s); setForm({ name: s.name || '', email: s.email || '', phone: s.phone || '', password: '', specialization: s.specialization || '' }); setModal('edit'); };
  const closeModal = () => { setModal(null); setSelected(null); };
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error('Nhập đầy đủ tên và email'); return; }
    if (modal === 'create' && !form.password) { toast.error('Nhập mật khẩu'); return; }
    setSaving(true);
    try {
      if (modal === 'create') {
        await axiosClient.post('/admin/staff', { ...form, role: 'staff' });
        toast.success('Thêm nhân viên thành công!');
      } else {
        await axiosClient.put(`/admin/staff/${selected._id}`, form);
        toast.success('Cập nhật thành công!');
      }
      closeModal(); fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa nhân viên này?')) return;
    try {
      await axiosClient.delete(`/admin/staff/${id}`);
      toast.success('Đã xóa nhân viên');
      fetch();
    } catch { toast.error('Xóa thất bại'); }
  };

  return (
    <div>
      <PageHeader
        title="Quản lý nhân viên"
        description={`${staff.length} nhân viên trong hệ thống`}
        actions={
          <Button variant="primary" size="md" icon={Plus} onClick={openCreate}>
            Thêm nhân viên
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên hoặc email..."
        />
      </div>

      {loading ? <Loading fullscreen={false} /> : (
        <Table>
          <Table.Head>
            <Table.Row hoverable={false}>
              <Table.HeadCell>Nhân viên</Table.HeadCell>
              <Table.HeadCell className="hidden md:table-cell">Chuyên môn</Table.HeadCell>
              <Table.HeadCell className="hidden md:table-cell">Điện thoại</Table.HeadCell>
              <Table.HeadCell align="right">Thao tác</Table.HeadCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <EmptyState
                    icon={UserCog}
                    title="Không có nhân viên nào"
                    description="Thử tìm kiếm với từ khóa khác hoặc thêm nhân viên mới"
                    actionLabel="Thêm nhân viên"
                    onAction={openCreate}
                  />
                </td>
              </tr>
            ) : filtered.map(s => (
              <Table.Row key={s._id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#1D4ED8]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">{s.name?.[0]?.toUpperCase() || 'S'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{s.name}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{s.email}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  <Badge variant="primary" size="sm">
                    {s.specialization || 'Tổng hợp'}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  <span className="text-sm text-[#0F172A]">{s.phone || '—'}</span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="ghost" size="sm" icon={Edit3} onClick={() => openEdit(s)} />
                    <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(s._id)} className="hover:text-[#EF4444] hover:bg-[#FEF2F2]" />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Modal isOpen={!!modal} onClose={closeModal} title={modal === 'create' ? 'Thêm nhân viên' : 'Chỉnh sửa nhân viên'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Họ tên"
            required
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Trần Văn B"
          />
          <Input
            label="Email"
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="staff@rescuecar.vn"
          />
          <Input
            label="Điện thoại"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="0901234567"
          />
          <Input
            label="Chuyên môn"
            type="text"
            value={form.specialization}
            onChange={set('specialization')}
            placeholder="Kéo xe, Thay lốp..."
          />
          <Input
            label={modal === 'create' ? 'Mật khẩu' : 'Mật khẩu (để trống nếu không đổi)'}
            required={modal === 'create'}
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder={modal === 'edit' ? 'Để trống nếu không đổi' : '••••••••'}
          />
          <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
            <Button type="submit" variant="primary" fullWidth loading={saving}>
              {modal === 'create' ? 'Thêm mới' : 'Lưu thay đổi'}
            </Button>
            <Button type="button" variant="outline" onClick={closeModal}>
              Hủy
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageStaff;
