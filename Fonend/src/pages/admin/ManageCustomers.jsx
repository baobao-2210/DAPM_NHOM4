import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import SearchBox from '../../components/ui/SearchBox';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import { Users, Plus, Edit3, Trash2 } from 'lucide-react';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    adminApi.getCustomers()
      .then(res => setCustomers(res.data?.data || res.data || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const openCreate = () => { setForm({ name: '', email: '', phone: '', password: '' }); setSelected(null); setModal('create'); };
  const openEdit = (c) => { setSelected(c); setForm({ name: c.name || '', email: c.email || '', phone: c.phone || '', password: '' }); setModal('edit'); };
  const closeModal = () => { setModal(null); setSelected(null); };
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error('Nhập đầy đủ tên và email'); return; }
    if (modal === 'create' && !form.password) { toast.error('Nhập mật khẩu'); return; }
    setSaving(true);
    try {
      if (modal === 'create') {
        await adminApi.createCustomer({ ...form, role: 'customer' });
        toast.success('Thêm khách hàng thành công!');
      } else {
        await adminApi.updateCustomer(selected._id, form);
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
    if (!confirm('Xóa khách hàng này?')) return;
    try {
      await adminApi.deleteCustomer(id);
      toast.success('Đã xóa khách hàng');
      fetch();
    } catch { toast.error('Xóa thất bại'); }
  };

  return (
    <div>
      <PageHeader
        title="Quản lý khách hàng"
        description={`${customers.length} khách hàng trong hệ thống`}
        actions={
          <Button variant="primary" size="md" icon={Plus} onClick={openCreate}>
            Thêm khách hàng
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên, email, điện thoại..."
        />
      </div>

      {loading ? <Loading fullscreen={false} /> : (
        <Table>
          <Table.Head>
            <Table.Row hoverable={false}>
              <Table.HeadCell>Khách hàng</Table.HeadCell>
              <Table.HeadCell className="hidden md:table-cell">Điện thoại</Table.HeadCell>
              <Table.HeadCell className="hidden lg:table-cell">Ngày đăng ký</Table.HeadCell>
              <Table.HeadCell align="right">Thao tác</Table.HeadCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <EmptyState
                    icon={Users}
                    title="Không có khách hàng nào"
                    description="Thử tìm kiếm với từ khóa khác hoặc thêm khách hàng mới"
                    actionLabel="Thêm khách hàng"
                    onAction={openCreate}
                  />
                </td>
              </tr>
            ) : filtered.map(c => (
              <Table.Row key={c._id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#22C55E] border border-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">{c.name?.[0]?.toUpperCase() || 'C'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{c.name}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{c.email}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  <span className="text-sm text-[#0F172A]">{c.phone || '—'}</span>
                </Table.Cell>
                <Table.Cell className="hidden lg:table-cell">
                  <span className="text-sm text-[#64748B]">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : '—'}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="ghost" size="sm" icon={Edit3} onClick={() => openEdit(c)} />
                    <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(c._id)} className="hover:text-[#EF4444] hover:bg-[#FEF2F2]" />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Modal isOpen={!!modal} onClose={closeModal} title={modal === 'create' ? 'Thêm khách hàng' : 'Chỉnh sửa khách hàng'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Họ tên"
            required
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Nguyễn Văn A"
          />
          <Input
            label="Email"
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="email@example.com"
          />
          <Input
            label="Điện thoại"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="0901234567"
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

export default ManageCustomers;
